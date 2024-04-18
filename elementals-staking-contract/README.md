# Nft-Staking-Contract

## Install Dependencies

- Install `node` and `yarn`
- Install `script` as global command
- Confirm the solana wallet preparation. ex: `wallet.json`

## Usage

- Main script source for all functionality is here: `/lib/script.ts`
- Program account types are declared here: `/lib/types.ts`

Able to test the script functions working in this way.

- Change commands properly in the main functions of the `script.ts` file to call the other functions
- Run `yarn script` with parameters

# Features

## How to deploy this program?

First of all, you have to git clone in your PC.
In the folder `nft_staking-staking`, in the terminal

1. `yarn`

2. `anchor build`
   In the last sentence you can see:

```
To deploy this program:
  $ solana program deploy ./target/deploy/nft_staking.so
The program address will default to this keypair (override with --program-id):
  ./target/deploy/nft_staking-keypair.json
```

3. `solana-keygen pubkey ./target/deploy/nft_staking.json`
4. You can get the pubkey of the `program ID : ex."5N...x6k"`
5. Please add this pubkey to the lib.rs
   `declare_id!("5N...x6k");`
6. Please add this pubkey to the Anchor.toml
   `nft_staking = "5N...x6k"`
7. `anchor build` again
8. `solana program deploy ./target/deploy/nft_staking.so`

<p align = "center">
Then, you can enjoy this program 
</p>
</br>

## How to use?

### A Project Owner

First of all, open the directory and `yarn`

#### Initialize project

```js
   yarn script init
```

### A Player

#### Stake NFT

```js
   yarn script stake -m <MINT ADDRESS>
```

#### Unstake NFT

```js
   yarn script unstake -m <MINT ADDRESS>
```

#### Get user status

```js
   yarn script user-status -a <USER_ADDRESS>
```

Get status of user <USER_ADDRESS>.

#### Get all users

```js
   yarn script get-users
```

Get all users stake info
