use anchor_lang::{prelude::*, AnchorDeserialize};

pub mod constant;
// pub mod error;
// pub mod instructions;
pub mod instructions;
pub mod state;
// pub mod util;
use constant::*;
// use error::*;
// use instructions::*;
use instructions::*;
use state::*;
// use util::*;

declare_id!("JHy4k7kR9gN7JVRAmBxGR9qUTJckU8cremLD13bPm8s");

#[program]
pub mod nft_staking {
    use super::*;

    /**
     * Initialize global pool
     * super admin sets to the caller of this instruction
     */
    pub fn initialize(mut ctx: Context<Initizlize>) -> Result<()> {
        Initizlize::process_instruction(&mut ctx)
    }

    //initialize  user pool
    pub fn inituser(mut ctx: Context<Inituser>) -> Result<()> {
        Inituser::process_instruction(&mut ctx)
    }

    pub fn lock_pnft(mut ctx: Context<LockPNFT>, halo: bool) -> Result<()> {
        LockPNFT::lock_pnft_handler(ctx, halo)
    }
}
