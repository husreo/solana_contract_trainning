use crate::*;

/**
 * Global pool stores admin address
 */
#[account]
#[derive(Default)]
pub struct GlobalPool {
    pub admin: Pubkey,     // 32
    pub total_staked: u16, // 2
}

impl GlobalPool {
    pub const DATA_SIZE: usize = 32 + 2;
}

#[account]
#[derive(Default)]
pub struct UserPool{
    pub user: Pubkey, //32
    pub stack_data: Vec<StakInfo> //4
}

impl UserPool{
    pub const DATA_SIZE: usize = 32 + 4 +4;
}

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct StakInfo {
    //  NFT mint address
    pub mint: Pubkey, // 32
    //  Start time
    pub time: i64, // 8,
    //  Staking time
    // pub staking_time: i64, // 8,

    pub halo: bool
}

impl StakInfo {
    pub const DATA_SIZE: usize = 32 + 8 + 8;
}