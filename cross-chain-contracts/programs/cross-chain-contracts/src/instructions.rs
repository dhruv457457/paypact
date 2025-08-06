// programs/cross-chain-hub/src/instructions.rs
// HACKATHON MVP VERSION - Simplified TokenAccount handling to avoid IDL issues

use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

/// Initialize the Cross-Chain Hub with configuration
pub fn initialize_hub(
    ctx: Context<InitializeHub>,
    bridge_fee_bps: u16,
    admin: Pubkey,
) -> Result<()> {
    let hub_state = &mut ctx.accounts.hub_state;
    
    require!(bridge_fee_bps <= 1000, HubError::InvalidFee);
    
    hub_state.authority = ctx.accounts.authority.key();
    hub_state.admin = admin;
    hub_state.bridge_fee_bps = bridge_fee_bps;
    hub_state.is_paused = false;
    hub_state.total_bridges = 0;
    hub_state.total_volume = 0;
    hub_state.bump = ctx.bumps.hub_state;

    emit!(HubInitialized {
        authority: hub_state.authority,
        admin: hub_state.admin,
        bridge_fee_bps,
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!("🚀 Cross-Chain Hub initialized!");
    Ok(())
}

/// Bridge assets to target chain
pub fn bridge_assets(
    ctx: Context<BridgeAssets>,
    target_chain: u16,
    amount: u64,
    recipient: [u8; 32],
    token_mint: Pubkey,
) -> Result<()> {
    let hub_state = &mut ctx.accounts.hub_state;
    let bridge_request = &mut ctx.accounts.bridge_request;
    
    require!(!hub_state.is_paused, HubError::HubPaused);
    require!(amount > 0, HubError::InvalidAmount);
    require!(target_chain != 1, HubError::InvalidChain); // 1 = Solana

    // Calculate fee
    let fee_amount = (amount as u128)
        .checked_mul(hub_state.bridge_fee_bps as u128)
        .unwrap()
        .checked_div(10000)
        .unwrap() as u64;
    
    let bridge_amount = amount.checked_sub(fee_amount).unwrap();

    // TODO: Add SPL token transfer logic here
    // For MVP, we'll emit events and track the bridge request
    // Token transfers can be handled in frontend or added later

    // Record bridge request
    bridge_request.user = ctx.accounts.user.key();
    bridge_request.token_mint = token_mint;
    bridge_request.amount = bridge_amount;
    bridge_request.fee_amount = fee_amount;
    bridge_request.target_chain = target_chain;
    bridge_request.recipient = recipient;
    bridge_request.timestamp = Clock::get()?.unix_timestamp;
    bridge_request.status = BridgeStatus::Initiated;
    bridge_request.bump = ctx.bumps.bridge_request;

    // Update hub stats
    hub_state.total_bridges = hub_state.total_bridges.checked_add(1).unwrap();
    hub_state.total_volume = hub_state.total_volume.checked_add(amount).unwrap();

    emit!(BridgeInitiated {
        user: ctx.accounts.user.key(),
        bridge_id: bridge_request.key(),
        token_mint: bridge_request.token_mint,
        amount: bridge_amount,
        fee_amount,
        target_chain,
        recipient,
        timestamp: bridge_request.timestamp,
    });

    msg!("✅ Bridge initiated: {} tokens to chain {}", bridge_amount, target_chain);
    Ok(())
}

/// Complete incoming bridge from another chain
pub fn complete_bridge(
    ctx: Context<CompleteBridge>,
    source_chain: u16,
    amount: u64,
    bridge_hash: [u8; 32],
    token_mint: Pubkey,
) -> Result<()> {
    let hub_state = &ctx.accounts.hub_state;
    let bridge_completion = &mut ctx.accounts.bridge_completion;
    
    require!(!hub_state.is_paused, HubError::HubPaused);
    require!(amount > 0, HubError::InvalidAmount);
    require!(source_chain != 1, HubError::InvalidChain);

    // TODO: Add Wormhole signature verification here
    // verify_wormhole_signature(&bridge_hash)?;

    // TODO: Add SPL token transfer logic here
    // For MVP, we'll track the completion and emit events

    // Record completion
    bridge_completion.source_chain = source_chain;
    bridge_completion.bridge_hash = bridge_hash;
    bridge_completion.recipient = ctx.accounts.recipient.key();
    bridge_completion.token_mint = token_mint;
    bridge_completion.amount = amount;
    bridge_completion.timestamp = Clock::get()?.unix_timestamp;
    bridge_completion.status = BridgeStatus::Completed;
    bridge_completion.bump = ctx.bumps.bridge_completion;

    emit!(BridgeCompleted {
        recipient: ctx.accounts.recipient.key(),
        completion_id: bridge_completion.key(),
        source_chain,
        bridge_hash,
        amount,
        timestamp: bridge_completion.timestamp,
    });

    msg!("✅ Bridge completed: {} tokens from chain {}", amount, source_chain);
    Ok(())
}

/// Create user portfolio tracking account
pub fn create_portfolio(ctx: Context<CreatePortfolio>) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio;
    
    portfolio.owner = ctx.accounts.user.key();
    portfolio.solana_balance = 0;
    portfolio.ethereum_balance = 0;
    portfolio.polygon_balance = 0;
    portfolio.total_value_usd = 0;
    portfolio.last_update = Clock::get()?.unix_timestamp;
    portfolio.bump = ctx.bumps.portfolio;

    emit!(PortfolioCreated {
        user: ctx.accounts.user.key(),
        portfolio_id: portfolio.key(),
        timestamp: portfolio.last_update,
    });

    msg!("📊 Portfolio created for user: {}", ctx.accounts.user.key());
    Ok(())
}

/// Update portfolio with latest balances
pub fn update_portfolio(
    ctx: Context<UpdatePortfolio>,
    solana_balance: u64,
    ethereum_balance: u64,
    polygon_balance: u64,
) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio;
    
    portfolio.solana_balance = solana_balance;
    portfolio.ethereum_balance = ethereum_balance;
    portfolio.polygon_balance = polygon_balance;
    
    // Simple USD calculation (in production, use price oracles)
    portfolio.total_value_usd = solana_balance
        .checked_add(ethereum_balance)
        .unwrap()
        .checked_add(polygon_balance)
        .unwrap();
    
    portfolio.last_update = Clock::get()?.unix_timestamp;

    emit!(PortfolioUpdated {
        user: ctx.accounts.user.key(),
        solana_balance,
        ethereum_balance,
        polygon_balance,
        total_value_usd: portfolio.total_value_usd,
        timestamp: portfolio.last_update,
    });

    msg!("📊 Portfolio updated - Total: ${}", portfolio.total_value_usd);
    Ok(())
}

/// Set hub pause state (Admin only)
pub fn set_pause_state(
    ctx: Context<SetPauseState>,
    paused: bool,
) -> Result<()> {
    let hub_state = &mut ctx.accounts.hub_state;
    
    require!(
        ctx.accounts.admin.key() == hub_state.admin,
        HubError::UnauthorizedAdmin
    );
    
    hub_state.is_paused = paused;

    emit!(HubPauseStateChanged {
        is_paused: paused,
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!("🔧 Hub pause state: {}", paused);
    Ok(())
}

/// Collect fees (Admin only) - Simplified for MVP
pub fn collect_fees(
    ctx: Context<CollectFees>,
    amount: u64,
) -> Result<()> {
    let hub_state = &ctx.accounts.hub_state;
    
    require!(
        ctx.accounts.admin.key() == hub_state.admin,
        HubError::UnauthorizedAdmin
    );
    require!(amount > 0, HubError::InvalidAmount);

    // TODO: Add SPL token transfer logic here
    // For MVP, just emit the event

    emit!(FeesCollected {
        admin: ctx.accounts.admin.key(),
        amount,
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!("💰 Fees collected: {} tokens", amount);
    Ok(())
}

// ============================================================================
// ACCOUNT VALIDATION STRUCTS - SIMPLIFIED FOR MVP
// ============================================================================

#[derive(Accounts)]
pub struct InitializeHub<'info> {
    #[account(
        init,
        payer = authority,
        space = HubState::LEN,
        seeds = [b"hub-state"],
        bump
    )]
    pub hub_state: Account<'info, HubState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(target_chain: u16, amount: u64, recipient: [u8; 32], token_mint: Pubkey)]
pub struct BridgeAssets<'info> {
    #[account(
        mut,
        seeds = [b"hub-state"],
        bump = hub_state.bump
    )]
    pub hub_state: Account<'info, HubState>,
    
    #[account(
        init,
        payer = user,
        space = BridgeRequest::LEN,
        seeds = [
            b"bridge-request", 
            user.key().as_ref(), 
            target_chain.to_le_bytes().as_ref(),
            amount.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub bridge_request: Account<'info, BridgeRequest>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(source_chain: u16, amount: u64, bridge_hash: [u8; 32], token_mint: Pubkey)]
pub struct CompleteBridge<'info> {
    #[account(
        seeds = [b"hub-state"],
        bump = hub_state.bump
    )]
    pub hub_state: Account<'info, HubState>,
    
    #[account(
        init,
        payer = payer,
        space = BridgeCompletion::LEN,
        seeds = [b"bridge-completion", bridge_hash.as_ref()],
        bump
    )]
    pub bridge_completion: Account<'info, BridgeCompletion>,
    
    /// CHECK: Recipient address for bridge completion
    pub recipient: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePortfolio<'info> {
    #[account(
        init,
        payer = user,
        space = Portfolio::LEN,
        seeds = [b"portfolio", user.key().as_ref()],
        bump
    )]
    pub portfolio: Account<'info, Portfolio>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePortfolio<'info> {
    #[account(
        mut,
        seeds = [b"portfolio", user.key().as_ref()],
        bump = portfolio.bump,
        constraint = portfolio.owner == user.key() @ HubError::UnauthorizedPortfolioAccess
    )]
    pub portfolio: Account<'info, Portfolio>,
    
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetPauseState<'info> {
    #[account(
        mut,
        seeds = [b"hub-state"],
        bump = hub_state.bump
    )]
    pub hub_state: Account<'info, HubState>,
    
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct CollectFees<'info> {
    #[account(
        seeds = [b"hub-state"],
        bump = hub_state.bump
    )]
    pub hub_state: Account<'info, HubState>,
    
    pub admin: Signer<'info>,
}