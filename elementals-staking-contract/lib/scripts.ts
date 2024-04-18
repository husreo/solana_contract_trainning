import * as anchor from '@project-serum/anchor';
import * as borsh from '@coral-xyz/borsh'
import {
    PublicKey,
    Keypair,
    Connection,
    SystemProgram,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    ComputeBudgetProgram
} from '@solana/web3.js';

import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PROGRAM_ID as TOKEN_AUTH_RULES_ID } from "@metaplex-foundation/mpl-token-auth-rules";

import { METAPLEX, MPL_DEFAULT_RULE_SET, findTokenRecordPda, getATokenAccountsNeedCreate, getAssociatedTokenAccount, getMasterEdition, getMetadata, getTraitInfo } from './util';
import { GLOBAL_AUTHORITY_SEED, LOYALTY_ADDRESS, ELMNT_ADDRESS, USER_POOL_SEED, VAULT_AUTHORITY_SEED } from './constant';

export const createInitializeTx = async (
    userAddress: PublicKey,
    program: anchor.Program,
) => {
    const [globalPool, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalPool.toBase58());

    const txId = await program.methods
        .initialize()
        .accounts({
            admin: userAddress,
            globalPool,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY
        })
        .transaction();

    return txId;
}

export const createInitUserTx = async (
    userAddress: PublicKey,
    program: anchor.Program,
) => {
    const [userPool, bump] = PublicKey.findProgramAddressSync(
        [userAddress.toBuffer(), Buffer.from(USER_POOL_SEED)],
        program.programId);

    console.log("userPool: ", userPool.toBase58());

    const txId = await program.methods
        .initUser()
        .accounts({
            user: userAddress,
            userPool,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY
        })
        .transaction();

    return txId;
}

export const createLockPnftTx = async (
    userAddress: PublicKey,
    nftMint: PublicKey,
    program: anchor.Program,
    connection: Connection
) => {

    const [globalPool, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalPool.toBase58());

    // const [vault, vault_bump] = PublicKey.findProgramAddressSync(
    //     [Buffer.from(VAULT_AUTHORITY_SEED)],
    //     program.programId);
    // console.log("vault: ", vault.toBase58());

    const [userPool, _user_bump] = PublicKey.findProgramAddressSync(
        [userAddress.toBuffer(), Buffer.from(USER_POOL_SEED)],
        program.programId);
    console.log("userPool: ", userPool.toBase58());
    console.log("nftmint addr", nftMint);
    const nftEdition = await getMasterEdition(nftMint);
    console.log("nftEdition: ", nftEdition.toBase58());

    let tokenAccount = await getAssociatedTokenAccount(userAddress, nftMint);
    console.log("tokenAccount: ", tokenAccount.toBase58());

    const mintMetadata = await getMetadata(nftMint);
    console.log("mintMetadata: ", mintMetadata);

    const holaTrait = await getTraitInfo(nftMint, connection);
    console.log("holaTrait: ", holaTrait);
    // const dataSchema = borsh.struct([
    //     borsh.bool('trait'),
    // ])

    // const buffer = Buffer.alloc(1000)
    // dataSchema.encode({ trait: holaTrait }, buffer)
    // const instructionBuffer = buffer.slice(0, dataSchema.getSpan(buffer))
    
    const tokenMintRecord = findTokenRecordPda(nftMint, tokenAccount);
    console.log("tokenMintRecord: ", tokenMintRecord.toBase58());


    const tx = new Transaction();

    let poolAccount = await connection.getAccountInfo(userPool);
    if (poolAccount === null || poolAccount.data === null) {
        console.log("init User Pool");
        const tx_initUserPool = await createInitUserTx(userAddress, program);
        tx.add(tx_initUserPool);
    }

    const txId = await program.methods
        .lockPnft(holaTrait)
        .accounts({
            globalPool,
            // vault,
            userPool,
            user: userAddress,
            tokenAccount,
            tokenMint: nftMint,

            tokenMintEdition: nftEdition,
            tokenMintRecord,
            mintMetadata,
            authRules: MPL_DEFAULT_RULE_SET,
            sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,

            loyaltyWallet: new PublicKey("68TfXibBR7D6oPfvFxU1soZe7ndAVrmBsoQbxN6EPchA"),
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: METAPLEX,
            authRulesProgram: TOKEN_AUTH_RULES_ID,
            systemProgram: SystemProgram.programId
        })
        .transaction();

    tx.add(txId);

    return tx;
}

export const createUnlockPnftTx = async (
    connection: Connection,
    userAddress: PublicKey,
    nftMint: PublicKey,
    program: anchor.Program,
) => {
    const [globalPool, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalPool.toBase58());

    const [vault, vault_bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_AUTHORITY_SEED)],
        program.programId);
    console.log("vault: ", vault.toBase58());

    const [userPool, _user_bump] = PublicKey.findProgramAddressSync(
        [userAddress.toBuffer(), Buffer.from(USER_POOL_SEED)],
        program.programId);
    console.log("userPool: ", userPool.toBase58());

    const nftEdition = await getMasterEdition(nftMint);
    console.log("nftEdition: ", nftEdition.toBase58());

    let tokenAccount = await getAssociatedTokenAccount(userAddress, nftMint);
    console.log("tokenAccount: ", tokenAccount.toBase58());

    const mintMetadata = await getMetadata(nftMint);
    console.log("mintMetadata: ", mintMetadata.toBase58());

    const tokenMintRecord = findTokenRecordPda(nftMint, tokenAccount);
    console.log("tokenMintRecord: ", tokenMintRecord.toBase58());

    let {instructions, destinationAccounts} = await getATokenAccountsNeedCreate(connection, userAddress, userAddress, [ELMNT_ADDRESS]);
    const elmntUser = destinationAccounts[0];
    console.log("soulUser: ", elmntUser.toBase58());

    let elmntVault = await getAssociatedTokenAccount(vault, ELMNT_ADDRESS);
    console.log("soulVault: ", elmntVault.toBase58());

    const tx = new Transaction();

    const txId = await program.methods
        .unlockPnft()
        .accounts({
            globalPool,
            vault,
            userPool,
            user: userAddress,
            tokenAccount,
            tokenMint: nftMint,
            tokenMintEdition: nftEdition,
            tokenMintRecord,
            mintMetadata,
            authRules: MPL_DEFAULT_RULE_SET,
            sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
            elmntUser,
            elmntVault,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: METAPLEX,
            authRulesProgram: TOKEN_AUTH_RULES_ID,
            systemProgram: SystemProgram.programId
        })
        .preInstructions(instructions)
        .transaction();

    tx.add(txId);

    return tx;
}

export const createClaimTx = async (
    userAddress: PublicKey,
    program: anchor.Program,
) => {
    const [globalPool, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalPool.toBase58());

    const [vault, vault_bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_AUTHORITY_SEED)],
        program.programId);
    console.log("vault: ", vault.toBase58());

    const [userPool, _user_bump] = PublicKey.findProgramAddressSync(
        [userAddress.toBuffer(), Buffer.from(USER_POOL_SEED)],
        program.programId);
    console.log("userPool: ", userPool.toBase58());

    let elmntUser = await getAssociatedTokenAccount(userAddress, ELMNT_ADDRESS);
    console.log("soulUser: ", elmntUser.toBase58());

    let elmntVault = await getAssociatedTokenAccount(vault, ELMNT_ADDRESS);
    console.log("soulVault: ", elmntVault.toBase58());

    const tx = new Transaction();

    const txId = await program.methods
        .claim()
        .accounts({
            globalPool,
            vault,
            userPool,
            user: userAddress,
            elmntUser,
            elmntVault,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId
        })
        .transaction();

    tx.add(txId);

    return tx;
}
