use anchor_lang::prelude::*;

declare_id!("FomZuPR1nh4ZjAdaQ6e47tgbdPtKUmQ8o9TLvV2smjW");

#[program]
pub mod first {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
