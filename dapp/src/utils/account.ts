import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

interface ToBytes {
    toBytes(): Uint8Array;
}

interface havePublicKey {
    publicKey: PublicKey;
}

type DerivedAccountSeed = havePublicKey | ToBytes | Uint8Array | string;

export class DerivedAccount {
    public publicKey: PublicKey;
    public bump: number;

    constructor(publicKey: PublicKey, bump: number) {
        this.publicKey = publicKey;
        this.bump = bump;
    }
}

/**
 * Find a PDA
 *
 * @param seeds
 * @returns
 */
export const getDerivedAccount = (
    seeds: DerivedAccountSeed[],
    programId: PublicKey
): DerivedAccount => {
    const seedBytes = seeds.map((seed) => {
        if (typeof seed == 'string') {
            return anchor.utils.bytes.utf8.encode(seed);
        } else if ('publicKey' in seed) {
            return seed.publicKey.toBytes();
        } else if ('toBytes' in seed) {
            return seed.toBytes();
        } else {
            return seed;
        }
    });
    const [publicKey, bumpSeed] = PublicKey.findProgramAddressSync(
        seedBytes,
        programId
    );

    return new DerivedAccount(publicKey, bumpSeed);
};
