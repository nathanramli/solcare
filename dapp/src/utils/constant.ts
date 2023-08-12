import * as anchor from '@project-serum/anchor';

export const LOGIN_MESSAGE = 's3cretseedsforlogin';
export const API_BASE_URL = 'https://34.238.156.194.nip.io';
// export const API_BASE_URL = 'http://localhost:8000';
export const RPC_API_KEY =
    'https://sleek-blue-liquid.solana-devnet.quiknode.pro/36e54bb0b3be1f41d0d78439827c8bd97771533e/';

export const PROGRAM_ADDRESS = '7Ji9oG6aVk8SJutzwRP3nFZJYXtq7FaDqkVWvmBbc4z';

export const CAMPAIGN_SEED = 'campaign_seed';
export const CAMPAIGN_AUTHORITY_SEED = 'campaign_authority_seed';
export const DONOR_SEED = 'donor_seed';
export const PROPOSAL_SEED = 'proposal_seed';
export const VOTE_SEED = 'vote_seed';

export const USDC_MINT = new anchor.web3.PublicKey(
    '83DPRebGNu41Gr1ucibUtp538GuUJab8b1Quy5BkqDkf'
);

export const USDC_DECIMALS = 9;

export const STATUS_ACTIVE = 0;
export const STATUS_FILLED = 1;
export const STATUS_NOT_FILLED = 2;
export const STATUS_VOTING = 3;
export const STATUS_FUNDED = 4;
export const STATUS_NOT_FUNDED = 5;
export const STATUS_FUND_CLAIMABLE = 6;
export const STATUS_SUCCESS = 7;
export const STATUS_FAILED = 8;

export const STATUS_KYC_PENDING = 0;
export const STATUS_KYC_ACCEPTED = 1;
export const STATUS_KYC_DECLINED = 2;
export const STATUS_KYC_REMOVED = 3;

export const EVIDENCE_STATUS_WAITING = 0;
export const EVIDENCE_STATUS_REQUESTED = 1;
export const EVIDENCE_STATUS_SUCCESS = 2;
export const EVIDENCE_STATUS_FAILED = 3;

export const OPACITY = 0.5;

export const ITEM_PER_PAGE = 5;
