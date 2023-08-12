import { web3 } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Id, toast } from 'react-toastify';
import { useSmartContract } from '../../../../context/connection';
import {
    API_BASE_URL,
    getDerivedAccount,
    PROPOSAL_SEED,
} from '../../../../utils';

// const MoneyProposalButton = ({
//     campaignAddress,
// }: {
//     campaignAddress: string;
// }) => {
const MoneyProposalButton = (props: any) => {
    const campaignAddress = props.campaignAddress;
    const refetch = props.refetch;

    const { publicKey, connected, sendTransaction } = useWallet();
    const { smartContract } = useSmartContract();
    const toastId = useRef<Id | null>(null);
    const navigate = useNavigate();

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<String | null>(
        null
    );

    const toastDone = () => {
        if (toastId.current) toast.done(toastId.current);
        toastId.current = null;
    };

    const submitProposal = async () => {
        if (!connected || !publicKey || toastId.current) return;

        if (uploadedFile === null) {
            toast.error(
                'Kamu harus memilih file untuk diupload terlebih dahulu!'
            );
            return;
        } else if (uploadedFile.type !== 'application/pdf') {
            toast.error('Format file invalid');
            return;
        }

        toastId.current = toast('Memproses proposal kamu!', {
            progress: 0.1,
            autoClose: false,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
        });

        const campaignPubkey = new web3.PublicKey(campaignAddress);
        const proposalDerivedAccount = getDerivedAccount(
            [PROPOSAL_SEED, campaignPubkey],
            smartContract.programId
        );

        const formData = new FormData();
        formData.append('address', proposalDerivedAccount.publicKey.toBase58());
        formData.append('campaignAddress', campaignAddress);
        formData.append('attachment', uploadedFile);

        try {
            const resp = await axios.postForm(
                API_BASE_URL + '/v1/campaign/proposal',
                formData
            );

            if (resp.data.status !== 200) {
                toastDone();
                toast.error(`Proposal gagal dibuat!`);
                return;
            }
            toast.update(toastId.current, { progress: 0.5 });
        } catch (e) {
            toastDone();
            console.log('Error: ', e);
            toast.error(`Proposal gagal dibuat!`);
            return;
        }

        try {
            const ix = await smartContract.methods
                .initProposal()
                .accounts({
                    owner: publicKey,
                    campaign: campaignPubkey,
                    proposal: proposalDerivedAccount.publicKey,
                    clock: web3.SYSVAR_CLOCK_PUBKEY,
                    systemProgram: web3.SystemProgram.programId,
                })
                .instruction();

            const tx = await sendTransaction(
                new Transaction().add(ix),
                smartContract.provider.connection
            );

            toast.update(toastId.current, { progress: 1 });
            toastDone();
            toast(`🚀 Proposal berhasil dibuat! Signature transaksi: ${tx}`);
        } catch (e) {
            toastDone();
            console.log('Error: ', e);
            toast.error(`Proposal gagal dibuat!`);
        }

        setUploadedFile(null);
        setUploadedFileName(null);

        refetch();
    };

    const handleInputChange = (e: any) => {
        const target = e.target;
        let file = target.files[0];

        if (file.type !== 'application/pdf') {
            toast.error('Format file invalid');
            return;
        } else {
            setUploadedFileName(file.name);
            setUploadedFile(e.target.files?.item(0) || null);
            return;
        }
    };

    const resetFileName = () => {
        setUploadedFileName(null);
        setUploadedFile(null);
    };

    return (
        <div className="flex flex-col">
            <label
                htmlFor="my-modal-4"
                className="text-center mt-4 self-end bg-[#007BC7] w-full text-xs p-2 border border-[2px] border-[#007BC7] text-white font-bold rounded-[5px]
                    md:text-xl md:p-4 md:rounded-[10px]"
            >
                Ajukan Pencairan Dana
            </label>
            <div>
                <input
                    type="checkbox"
                    id="my-modal-4"
                    className="modal-toggle"
                />
                <label
                    htmlFor="my-modal-4"
                    className="modal max-[768px]:modal-bottom cursor-pointer px-0 md:px-12"
                >
                    <label className="modal-box relative rounded-t-[10px] md:rounded-[20px] w-[54rem] max-w-screen-2xl md:max-h-screen-2xl">
                        <h1 className="text-md font-bold md:text-3xl">
                            Pengajuan Pencairan
                        </h1>
                        <div className="divider" />
                        <p className="text-xs md:text-xl font-bold">
                            Upload Proposal
                        </p>
                        <label
                            htmlFor="dropzone-file"
                            className={`hover:brightness-90 shrink-0 h-28 w-full bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-[10px] cursor-pointer mb-2`}
                        >
                            <div className="w-full h-full flex flex-col items-center justify-center rounded-[10px]">
                                <svg
                                    aria-hidden="true"
                                    className="w-10 h-10 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    ></path>
                                </svg>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleInputChange}
                                />
                                <p
                                    id="address-tag"
                                    className="px-4 text-center text-xs md:text-base"
                                >
                                    {uploadedFileName}
                                </p>
                            </div>
                        </label>
                        <div className="flex flex-row justify-end font-bold text-white text-center">
                            <label
                                htmlFor="my-modal-4"
                                className="basis-6/12 md:basis-3/12 text-[#007BC7] border-solid border-2 border-white hover:border-[#007BC7] p-2 md:p-4 text-[8px] md:text-[15px] rounded-[5px] md:rounded-[10px]"
                                onClick={resetFileName}
                            >
                                Batal
                            </label>
                            <label
                                className="basis-6/12 md:basis-3/12 rounded-[5px] md:rounded-[10px] p-2 md:p-4 text-[8px] md:text-[15px] ml-1 md:ml-2 bg-[#007BC7] border border-2 border-white hover:bg-[#007BC7] hover:border-[#007BC7]"
                                onClick={submitProposal}
                            >
                                Kirim
                            </label>
                        </div>
                    </label>
                </label>
            </div>
        </div>
    );
};

export default MoneyProposalButton;
