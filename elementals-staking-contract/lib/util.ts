
import * as anchor from "@project-serum/anchor";
import {
    Connection,
    PublicKey,
} from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    Metadata,
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import fetch from 'node-fetch';

export const METAPLEX = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const MPL_DEFAULT_RULE_SET = new PublicKey(
    "H6mX25exrJBXk86zGMX6Dd4WJoR6ZbjnzqUVT8d3NjAT"
);

const getAssociatedTokenAccount = async (
    ownerPubkey: PublicKey,
    mintPk: PublicKey
): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (PublicKey.findProgramAddressSync(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];

    return associatedTokenAccountPubkey;
}

const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}

const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        if (walletAddress != owner) {
            const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
            response = await connection.getAccountInfo(userAccount);
            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

/** Get metaplex mint metadata account address */
const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
    return (
        await PublicKey.findProgramAddress([Buffer.from('metadata'), METAPLEX.toBuffer(), mint.toBuffer()], METAPLEX)
    )[0];
};

const getMasterEdition = async (
    mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
    return (
        await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                METAPLEX.toBuffer(),
                mint.toBuffer(),
                Buffer.from("edition"),
            ],
            METAPLEX
        )
    )[0];
};

const getTraitInfo = async (
    mint: anchor.web3.PublicKey,
    connection: Connection
) => {

    const [metadataPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );

    const Metaplex_Metadata = await Metadata.fromAccountAddress(connection, metadataPDA);

    const metadataResponse = await fetch(Metaplex_Metadata.data.uri);
    if (!metadataResponse.ok) {
        throw new Error('Failed to fetch metadata');
    }

    const metadata: any = await metadataResponse.json();

    const isHolyOrHellfire =
        metadata?.attributes[9]?.value === "Holy" || metadata?.attributes[9]?.value === "Hellfire";
    // const isHolyOrHellfire =
    //     metadata?.attributes[2]?.value === "1235" || metadata?.attributes[2]?.value === "1235";

    return !!isHolyOrHellfire;
};


export function findTokenRecordPda(
    mint: PublicKey,
    token: PublicKey
): PublicKey {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            METAPLEX.toBuffer(),
            mint.toBuffer(),
            Buffer.from("token_record"),
            token.toBuffer(),
        ],
        METAPLEX
    )[0];
}

export {
    getAssociatedTokenAccount,
    getATokenAccountsNeedCreate,
    getMetadata,
    getMasterEdition,
    getTraitInfo
}
