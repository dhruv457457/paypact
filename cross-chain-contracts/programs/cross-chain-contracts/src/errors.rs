// programs/cross-chain-hub/src/errors.rs
// Custom error definitions

use anchor_lang::prelude::*;

#[error_code]
pub enum HubError {
    #[msg("Invalid fee basis points. Must be <= 1000 (10%)")]
    InvalidFee,
    
    #[msg("Invalid amount. Must be > 0")]
    InvalidAmount,
    
    #[msg("Invalid target/source chain ID")]
    InvalidChain,
    
    #[msg("Hub is currently paused")]
    HubPaused,
    
    #[msg("Bridge already completed")]
    BridgeAlreadyCompleted,
    
    #[msg("Unauthorized admin access")]
    UnauthorizedAdmin,
    
    #[msg("Unauthorized portfolio access")]
    UnauthorizedPortfolioAccess,
    
    #[msg("Invalid Wormhole signature")]
    InvalidWormholeSignature,
    
    #[msg("Bridge request not found")]
    BridgeRequestNotFound,
    
    #[msg("Insufficient hub token balance")]
    InsufficientHubBalance,
    
    #[msg("Portfolio not found")]
    PortfolioNotFound,
    
    #[msg("Bridge amount too small")]
    BridgeAmountTooSmall,
    
    #[msg("Bridge amount exceeds maximum")]
    BridgeAmountTooLarge,
}