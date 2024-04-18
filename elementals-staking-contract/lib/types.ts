import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js'

export interface GlobalPool {
    admin: PublicKey,
    totalStaked: number
}

export interface UserPool {
    user: PublicKey,
    stakeData: StakeInfo[],
}

export interface StakeInfo {
    mint: PublicKey,
    time: anchor.BN,
    halo: Boolean
}
