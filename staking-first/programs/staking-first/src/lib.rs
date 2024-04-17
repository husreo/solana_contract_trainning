use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod staking_first {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data:u64) -> Result<()> {
        ctx.account.my_account.data = data;
        Ok(())
    }
}

#[accounts]
pub struct MyAccount {
    data: u64
    mint: Pubkey
}

#[derive(Accounts)]
pub struct Initialize {
    #[account(mut)]

    pub my_account: Account<'info, MyAccont>

    #[account(
        constrain = my_account.mint == token_account.mint,
        has_one = owner
    )]
    token_account: Account<'info, TokenAccount>
    owner: Sign<'info>
}
