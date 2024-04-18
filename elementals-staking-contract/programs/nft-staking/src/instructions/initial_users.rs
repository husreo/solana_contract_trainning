use crate::*;

#[derive(Accounts)]
pub struct Inituser<'info>{
    #[account(mut)]
    pub user: Signer<'info>

    #[account(
        init,
        space = 8 + UserPool::DATA_SIZE,
        seed = [user.key().as_ref(), USER_AUTHORITY_SEED.as_ref()],
        bump,
        payer = user
    )]
    pub user_pool = Account<'info, UserPool>,

    //  Needed to init new account
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl Inituser{
    pub fn process_instruction(ctx: &mut Context<Self>) -> Result<()> {
        let user_pool = &mut ctx.accounts.user_pool;

        user_pool.user = ctx.accounts.user.key();
        Ok(())
    }
}