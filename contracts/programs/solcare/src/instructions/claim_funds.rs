use crate::constant::*;
use crate::errors::CustomError;
use crate::state::{Campaign, Proposal};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

pub fn handler(ctx: Context<ClaimFunds>) -> Result<()> {
    if (ctx.accounts.campaign.funded_amount / 5 > ctx.accounts.proposal.agree + ctx.accounts.proposal.disagree) || (ctx.accounts.proposal.agree < ctx.accounts.proposal.disagree)
    {
        return err!(CustomError::CantClaimFund);
    }

    let campaign_authority_seed = &[
        CAMPAIGN_AUTHORITY_SEED,
        ctx.accounts.campaign.to_account_info().key.as_ref(),
        &[*ctx.bumps.get("campaign_authority").unwrap()],
    ];

    token::transfer(
        ctx.accounts
            .into_transfer_to_owner_token()
            .with_signer(&[&campaign_authority_seed[..]]),
        ctx.accounts.campaign_vault.amount,
    )?;

    ctx.accounts.campaign.status = STATUS_FUNDED;

    Ok(())
}

#[derive(Accounts)]
pub struct ClaimFunds<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        constraint = campaign.status == STATUS_VOTING @ CustomError::CampaignIsNotInVotingPeriod,
        constraint = campaign.owner == owner.key(),
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        seeds = [CAMPAIGN_AUTHORITY_SEED, campaign.key().as_ref()],
        bump,
    )]
    pub campaign_authority: SystemAccount<'info>,

    #[account(address = USDC_MINT_PUBKEY)]
    pub usdc_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = campaign_authority,
    )]
    pub campaign_vault: Account<'info, TokenAccount>,

    #[account(
        seeds = [PROPOSAL_SEED, campaign.key().as_ref()],
        bump,
        constraint = ((proposal.agree + proposal.disagree >= campaign.funded_amount) || (clock.unix_timestamp > proposal.created_at + proposal.duration)) @ CustomError::VotingHasNotEnd,
    )]
    pub proposal: Account<'info, Proposal>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = owner,
    )]
    pub owner_token: Account<'info, TokenAccount>,

    pub clock: Sysvar<'info, Clock>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,
}

impl<'info> ClaimFunds<'info> {
    fn into_transfer_to_owner_token(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            authority: self.campaign_authority.to_account_info(),
            from: self.campaign_vault.to_account_info(),
            to: self.owner_token.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}
