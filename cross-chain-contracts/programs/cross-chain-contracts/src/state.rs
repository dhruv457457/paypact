// programs/cross-chain-hub/src/state.rs
// All state structures and events

use anchor_lang::prelude::*;

// ============================================================================
// STATE STRUCTURES
// ============================================================================

#[account]
pub struct HubState {
    pub authority: Pubkey,        // 32 bytes
    pub admin: Pubkey,           // 32 bytes  
    pub bridge_fee_bps: u16,     // 2 bytes
    pub is_paused: bool,         // 1 byte
    pub total_bridges: u64,      // 8 bytes
    pub total_volume: u64,       // 8 bytes
    pub bump: u8,                // 1 byte
}

impl HubState {
    pub const LEN: usize = 8 + 32 + 32 + 2 + 1 + 8 + 8 + 1; // 92 bytes
}

#[account]
pub struct BridgeRequest {
    pub user: Pubkey,            // 32 bytes
    pub token_mint: Pubkey,      // 32 bytes
    pub amount: u64,             // 8 bytes
    pub fee_amount: u64,         // 8 bytes
    pub target_chain: u16,       // 2 bytes
    pub recipient: [u8; 32],     // 32 bytes
    pub timestamp: i64,          // 8 bytes
    pub status: BridgeStatus,    // 1 byte
    pub bump: u8,                // 1 byte
}

impl BridgeRequest {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 2 + 32 + 8 + 1 + 1; // 132 bytes
}

#[account]
pub struct BridgeCompletion {
    pub source_chain: u16,       // 2 bytes
    pub bridge_hash: [u8; 32],   // 32 bytes
    pub recipient: Pubkey,       // 32 bytes
    pub token_mint: Pubkey,      // 32 bytes
    pub amount: u64,             // 8 bytes
    pub timestamp: i64,          // 8 bytes
    pub status: BridgeStatus,    // 1 byte
    pub bump: u8,                // 1 byte
}

impl BridgeCompletion {
    pub const LEN: usize = 8 + 2 + 32 + 32 + 32 + 8 + 8 + 1 + 1; // 124 bytes
}

#[account]
pub struct Portfolio {
    pub owner: Pubkey,           // 32 bytes
    pub solana_balance: u64,     // 8 bytes
    pub ethereum_balance: u64,   // 8 bytes
    pub polygon_balance: u64,    // 8 bytes
    pub total_value_usd: u64,    // 8 bytes
    pub last_update: i64,        // 8 bytes
    pub bump: u8,                // 1 byte
}

impl Portfolio {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 8 + 8 + 1; // 81 bytes
}

// ============================================================================
// ENUMS
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum BridgeStatus {
    Initiated,
    Completed, 
    Failed,
}

// ============================================================================
// EVENTS
// ============================================================================

#[event]
pub struct HubInitialized {
    pub authority: Pubkey,
    pub admin: Pubkey,
    pub bridge_fee_bps: u16,
    pub timestamp: i64,
}

#[event]
pub struct BridgeInitiated {
    pub user: Pubkey,
    pub bridge_id: Pubkey,
    pub token_mint: Pubkey,
    pub amount: u64,
    pub fee_amount: u64,
    pub target_chain: u16,
    pub recipient: [u8; 32],
    pub timestamp: i64,
}

#[event]
pub struct BridgeCompleted {
    pub recipient: Pubkey,
    pub completion_id: Pubkey,
    pub source_chain: u16,
    pub bridge_hash: [u8; 32],
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct PortfolioCreated {
    pub user: Pubkey,
    pub portfolio_id: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PortfolioUpdated {
    pub user: Pubkey,
    pub solana_balance: u64,
    pub ethereum_balance: u64,
    pub polygon_balance: u64,
    pub total_value_usd: u64,
    pub timestamp: i64,
}

#[event]
pub struct HubPauseStateChanged {
    pub is_paused: bool,
    pub timestamp: i64,
}

#[event]
pub struct FeesCollected {
    pub admin: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}