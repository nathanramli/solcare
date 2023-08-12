import Intro from '../components/layout/home/intro';
import ConnectWallet from '../components/layout/home/connectWallet';
import Campaigns from '../components/layout/home/campaigns';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSmartContract } from '../context/connection';
import { useContext, useEffect, useState } from 'react';
import { ACCOUNT_DISCRIMINATOR_SIZE, BN, utils } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import {
    API_BASE_URL,
    PROPOSAL_SEED,
    USDC_DECIMALS,
    getDerivedAccount,
    now,
} from '../utils';
import axios from 'axios';
import { AdminContext } from '../utils/state';

const Home = () => {
    const { connected, publicKey } = useWallet();
    const { smartContract } = useSmartContract();

    const [initializing, setInitializing] = useState(false);

    const [donatedCampaigns, setDonatedCampaigns] = useState(new Array<any>());
    const [ongoingProposal, setOngoingProposal] = useState(new Array<any>());

    const { state } = useContext(AdminContext);
    const { isAdmin } = state;

    const fetchDonatedCampaign = async () => {
        setInitializing(true);

        if (connected && publicKey) {
            const newDonatedCampaigns: any[] = [];
            const newOngoingProposal: any[] = [];

            const donors = await smartContract.account.donor.all([
                {
                    memcmp: {
                        offset: ACCOUNT_DISCRIMINATOR_SIZE,
                        bytes: utils.bytes.bs58.encode(publicKey.toBuffer()),
                    },
                },
            ]);

            const proposalPubkeys = new Array<PublicKey>();

            await Promise.all(
                donors.map(async (e) => {
                    try {
                        const campaignData =
                            await smartContract.account.campaign.fetch(
                                e.account.campaign
                            );

                        const response = await axios.get(
                            API_BASE_URL + '/v1/campaign/' + e.account.campaign
                        );
                        const responseData = response.data.data;

                        newDonatedCampaigns.push({
                            ...campaignData,
                            campaign: e.account.campaign,
                            collected: campaignData.fundedAmount
                                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                                .toNumber(),
                            target: campaignData.targetAmount
                                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                                .toNumber(),
                            duration: campaignData.heldDuration,
                            title: responseData.title,
                            banner: responseData.banner,
                        });

                        proposalPubkeys.push(
                            getDerivedAccount(
                                [PROPOSAL_SEED, e.account.campaign],
                                smartContract.programId
                            ).publicKey
                        );
                    } catch (e) {}
                })
            );
            setDonatedCampaigns(newDonatedCampaigns);

            const proposals =
                await smartContract.account.proposal.fetchMultiple(
                    proposalPubkeys
                );
            await Promise.all(
                proposals.map(async (e) => {
                    if (e !== null) {
                        const acc = e as any;
                        if (
                            now() <
                            acc.createdAt.toNumber() + acc.duration.toNumber()
                        ) {
                            try {
                                const response = await axios.get(
                                    API_BASE_URL +
                                        '/v1/campaign/' +
                                        acc.campaign
                                );
                                const responseData = response.data.data;
                                newOngoingProposal.push({
                                    ...acc,
                                    title: responseData.title,
                                    banner: responseData.banner,
                                });
                            } catch (e) {}
                        }
                    }
                })
            );
            setOngoingProposal(newOngoingProposal);
        }
        setInitializing(false);
    };

    useEffect(() => {
        if (connected && publicKey) {
            fetchDonatedCampaign();
        }

        return () => setInitializing(false);
    }, [connected, publicKey]);

    if (initializing) {
        return (
            <main className="flex flex-col items-center">
                <Intro />
                <progress className="progress w-[90%] flex mx-auto my-20" />
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center">
            <Intro />
            {connected ? (
                isAdmin ? (
                    <></>
                ) : (
                    <>
                        <Campaigns type="Voting" data={ongoingProposal} />
                        <Campaigns type="Helped" data={donatedCampaigns} />
                    </>
                )
            ) : (
                <ConnectWallet />
            )}
            {/*<BestCampaigns />*/}
        </main>
    );
};

export default Home;
