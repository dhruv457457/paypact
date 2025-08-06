// programs/cross-chain-hub/src/lib.rs
// Cross-Chain DeFi Hub - BALANCED MVP Main Contract
// Professional structure, hackathon timeline

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};

mod instructions;
mod state;
mod errors;

use instructions::*;
use state::*;
use errors::*;

declare_id!("11111111111111111111111111111112");

#[program]
pub mod cross_chain_hub {
    use super::*;

    /// Initialize the Cross-Chain Hub
    pub fn initialize_hub(
        ctx: Context<InitializeHub>,
        bridge_fee_bps: u16,
        admin: Pubkey,
    ) -> Result<()> {
        instructions::initialize_hub(ctx, bridge_fee_bps, admin)
    }

    /// Bridge assets to another chain
    pub fn bridge_assets(
        ctx: Context<BridgeAssets>,
        target_chain: u16,
        amount: u64,
        recipient: [u8; 32],
        token_mint: Pubkey,
    ) -> Result<()> {
        instructions::bridge_assets(ctx, target_chain, amount, recipient, token_mint)
    }

    /// Complete incoming bridge transfer
    pub fn complete_bridge(
        ctx: Context<CompleteBridge>,
        source_chain: u16,
        amount: u64,
        bridge_hash: [u8; 32],
        token_mint: Pubkey,
    ) -> Result<()> {
        instructions::complete_bridge(ctx, source_chain, amount, bridge_hash, token_mint)
    }

    /// Create user portfolio
    pub fn create_portfolio(
        ctx: Context<CreatePortfolio>,
    ) -> Result<()> {
        instructions::create_portfolio(ctx)
    }

    /// Update portfolio balances
    pub fn update_portfolio(
        ctx: Context<UpdatePortfolio>,
        solana_balance: u64,
        ethereum_balance: u64,
        polygon_balance: u64,
    ) -> Result<()> {
        instructions::update_portfolio(ctx, solana_balance, ethereum_balance, polygon_balance)
    }

    /// Emergency pause (Admin only)
    pub fn set_pause_state(
        ctx: Context<SetPauseState>,
        paused: bool,
    ) -> Result<()> {
        instructions::set_pause_state(ctx, paused)
    }

    /// Collect accumulated fees (Admin only)
    pub fn collect_fees(
        ctx: Context<CollectFees>,
        amount: u64,
    ) -> Result<()> {
        instructions::collect_fees(ctx, amount)
    }
}