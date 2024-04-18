import { program } from 'commander';
import {
    PublicKey
} from '@solana/web3.js';
import { claim, getGlobalInfo, getUserInfo, initProject, initializeUserPool, lockPnft, setClusterConfig, unlockPnft } from './scripts';

program.version('0.0.1');

programCommand('status')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
        const { env, keypair, rpc } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);
        await setClusterConfig(env, keypair, rpc);

        console.log(await getGlobalInfo());
    });

programCommand('user-status')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-a, --address <string>', 'user pubkey')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, address } = cmd.opts();
        console.log("user", address);
        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);
        await setClusterConfig(env, keypair, rpc);

        if (address === undefined) {
            console.log("Error User Address input");
            return;
        }
        console.log(await getUserInfo(new PublicKey(address)));
    });

programCommand('init')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
        const { env, keypair, rpc } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);

        await initProject();
    });

programCommand('init-user')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
        const { env, keypair, rpc } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);

        await initializeUserPool();
    });

programCommand('lock')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-m, --mint <number>')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, mint } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);
        if (mint === undefined) {
            console.log("Error token amount Input");
            return;
        }

        await lockPnft(new PublicKey(mint));
    });

programCommand('unlock')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-m, --mint <number>')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, mint } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);
        if (mint === undefined) {
            console.log("Error token amount Input");
            return;
        }

        await unlockPnft(new PublicKey(mint));
    });

programCommand('claim')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
        const { env, keypair, rpc } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);

        await claim();
    });

function programCommand(name: string) {
    return program
        .command(name)
        .option('-e, --env <string>', 'Solana cluster env name', 'mainnet-beta') //mainnet-beta, testnet, devnet
        .option('-r, --rpc <string>', 'Solana cluster RPC name', 'https://omniscient-solemn-resonance.solana-mainnet.quiknode.pro/a26d3fdf5601a435b5f98193b3125d2aad7737b5')
        .option('-k, --keypair <string>', 'Solana wallet Keypair Path', '../key/G1.json')
}

program.parse(process.argv);

/*

yarn script init

yarn script init-user -k ../key/dc8.json

yarn script lock -m 3xVwPory1mcY5TmpmCtPC2ezgpHuzLeMLbdGY1DeQLxY -k ../key/dc8.json

yarn script unlock -m 3xVwPory1mcY5TmpmCtPC2ezgpHuzLeMLbdGY1DeQLxY -k ../key/dc8.json

yarn script claim -k ../key/dc8.json

yarn script user-status -a EwUTcnP6nu3rckUCWVut4bu82k8bGuZ1DGnpQt5VsU7m

yarn script status

*/
