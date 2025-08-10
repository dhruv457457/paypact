use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("EdrFHSKQm93xsie3mkXPJ9k1W4MX3fM2ccWbPkVSV1ag");

#[program]
pub mod paypact {
    use super::*;

    pub fn initialize_pact(
        ctx: Context<InitializePact>,
        target_amount: u64,
        deadline: i64,
        vault_bump: u8,
    ) -> Result<()> {
        let pact = &mut ctx.accounts.pact;
        pact.creator = ctx.accounts.creator.key();
        pact.payout_recipient = ctx.accounts.payout_recipient.key();
        pact.target_amount = target_amount;
        pact.deadline = deadline;
        pact.total_raised = 0;
        pact.status = PactStatus::Open;
        pact.vault_bump = vault_bump;
        Ok(())
    }

    pub fn join_and_contribute(ctx: Context<JoinAndContribute>, amount: u64) -> Result<()> {
        let pact = &mut ctx.accounts.pact;
        let clock = Clock::get()?;

        require!(clock.unix_timestamp <= pact.deadline, ErrorCode::PactClosed);
        require!(pact.status == PactStatus::Open, ErrorCode::PactClosed);
        require!(amount > 0, ErrorCode::InvalidContribution);

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.contributor.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                },
            ),
            amount,
        )?;

        pact.total_raised = pact.total_raised.saturating_add(amount);
        Ok(())
    }

    pub fn withdraw_or_settle(ctx: Context<SettlePact>) -> Result<()> {
        let clock = Clock::get()?;
        let pact = &mut ctx.accounts.pact;
        require!(pact.status == PactStatus::Open, ErrorCode::PactClosed);
        require!(
            pact.total_raised >= pact.target_amount || clock.unix_timestamp >= pact.deadline,
            ErrorCode::PactNotReady
        );
        require_keys_eq!(
            ctx.accounts.payout_recipient.key(),
            pact.payout_recipient,
            ErrorCode::InvalidPayoutRecipient
        );

        let pact_key = pact.key();
        let vault_seeds = &[b"vault".as_ref(), pact_key.as_ref(), &[pact.vault_bump]];
        let signer_seeds = &[&vault_seeds[..]];

        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.payout_recipient.to_account_info(),
                },
                signer_seeds,
            ),
            ctx.accounts.vault.to_account_info().lamports(),
        )?;

        pact.status = PactStatus::Settled;
        Ok(())
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        let pact = &mut ctx.accounts.pact;
        let vault = &ctx.accounts.vault;
        let clock = Clock::get()?;

        require!(pact.status == PactStatus::Open, ErrorCode::PactClosed);
        require!(
            clock.unix_timestamp >= pact.deadline && pact.total_raised < pact.target_amount,
            ErrorCode::PactNotReady
        );

        let pact_key = pact.key();
        let vault_seeds = &[b"vault".as_ref(), pact_key.as_ref(), &[pact.vault_bump]];
        let signer_seeds = &[&vault_seeds[..]];

        // Refund all funds to the creator (simplified, no member tracking)
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: vault.to_account_info(),
                    to: ctx.accounts.creator.to_account_info(),
                },
                signer_seeds,
            ),
            vault.to_account_info().lamports(),
        )?;

        pact.total_raised = 0;
        pact.status = PactStatus::Refunded;
        Ok(())
    }
}

/* ============ Accounts ============ */

#[account]
pub struct Pact {
    pub creator: Pubkey,
    pub payout_recipient: Pubkey,
    pub target_amount: u64,
    pub deadline: i64,
    pub total_raised: u64,
    pub status: PactStatus,
    pub vault_bump: u8,
}

#[account]
pub struct Vault {} // zero-sized PDA, just holds lamports

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum PactStatus {
    Open,
    Settled,
    Refunded,
}

/* ============ Contexts ============ */

#[derive(Accounts)]
#[instruction(target_amount: u64, deadline: i64, vault_bump: u8)]
pub struct InitializePact<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    /// CHECK: only stored and verified later
    pub payout_recipient: UncheckedAccount<'info>,
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 32 + 8 + 8 + 8 + 1 + 1, // 98 bytes
    )]
    pub pact: Account<'info, Pact>,
    #[account(
        init,
        payer = creator,
        seeds = [b"vault", pact.key().as_ref()],
        bump,
        space = 8
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinAndContribute<'info> {
    #[account(mut)]
    pub contributor: Signer<'info>,
    #[account(mut)]
    pub pact: Account<'info, Pact>,
    #[account(
        mut,
        seeds = [b"vault", pact.key().as_ref()],
        bump = pact.vault_bump,
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettlePact<'info> {
    #[account(mut)]
    pub pact: Account<'info, Pact>,
    #[account(
        mut,
        seeds = [b"vault", pact.key().as_ref()],
        bump = pact.vault_bump,
        close = payout_recipient
    )]
    pub vault: Account<'info, Vault>,
    /// CHECK: must match stored payout_recipient
    #[account(mut)]
    pub payout_recipient: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(mut)]
    pub pact: Account<'info, Pact>,
    #[account(
        mut,
        seeds = [b"vault", pact.key().as_ref()],
        bump = pact.vault_bump,
        close = creator
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/* ============ Errors ============ */

#[error_code]
pub enum ErrorCode {
    #[msg("Pact is already closed.")]
    PactClosed,
    #[msg("Pact not ready to settle/refund.")]
    PactNotReady,
    #[msg("Contribution must be greater than zero.")]
    InvalidContribution,
    #[msg("Invalid payout recipient.")]
    InvalidPayoutRecipient,
}