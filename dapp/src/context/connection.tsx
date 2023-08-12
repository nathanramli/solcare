import * as anchor from '@project-serum/anchor';
import { ConnectionProvider as WalletConnectionProvider } from '@solana/wallet-adapter-react';
import { Solcare } from '../resources/solcare';
import SolcareIdl from '../resources/solcare.json';
import { createContext, useContext } from 'react';
import { PROGRAM_ADDRESS, RPC_API_KEY } from '../utils';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

const scDefaultValue = () => {
    console.log(SolcareIdl);
    const connection = new anchor.web3.Connection(RPC_API_KEY, {
        commitment: 'processed',
    });

    const provider = new anchor.AnchorProvider(
        connection,
        new NodeWallet(anchor.web3.Keypair.generate()),
        {
            commitment: 'processed',
            preflightCommitment: 'processed',
        }
    );

    const program = new anchor.Program<Solcare>(
        SolcareIdl as any,
        new anchor.web3.PublicKey(PROGRAM_ADDRESS),
        provider
    );
    return program;
};

const smartContractContext = createContext({
    smartContract: scDefaultValue(),
});

export const useSmartContract = () => {
    return useContext(smartContractContext);
};

export const ConnectionProvider = (props: any) => {
    return (
        <WalletConnectionProvider endpoint={RPC_API_KEY}>
            {props.children}
        </WalletConnectionProvider>
    );
};
