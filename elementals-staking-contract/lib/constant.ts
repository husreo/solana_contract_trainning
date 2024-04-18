
import {
    PublicKey,
} from "@solana/web3.js";

export const GLOBAL_AUTHORITY_SEED = "global-v1-authority";
export const VAULT_AUTHORITY_SEED = "vault-v1-authority";
export const USER_POOL_SEED = "user-v1-stake-pool";

export const PROGRAM_ID = new PublicKey("JHy4k7kR9gN7JVRAmBxGR9qUTJckU8cremLD13bPm8s");

export const LOYALTY_ADDRESS = new PublicKey("68TfXibBR7D6oPfvFxU1soZe7ndAVrmBsoQbxN6EPchA");


//  ---------------------   devnet  ----------------------

// export const MILSECS_IN_DAY = (1000 * 60);

// export const ELMNT_ADDRESS = new PublicKey("5NyADEEXaoniwHkwWYEVuuB9mAtnXSCsEfmDm4gFvhQM");
// export const ELMNT_DECIMAL = 1_000_000;

//  ---------------------   mainnet ----------------------

// export const MILSECS_IN_DAY = (1000 * 60 * 60 * 24);
export const MILSECS_IN_DAY = (1000 * 60 * 60 * 24);

export const ELMNT_ADDRESS = new PublicKey("9xYeZDHEwyuqJmqrTourbFRaxN2qhkYesnz3iQ3FPz4r");
export const ELMNT_DECIMAL = 100_000;

// Define the minimum lock duration in seconds (1 month = 30 days)
export const MIN_LOCK_DURATION_SECONDS = 30 * 24 * 60 * 60;
