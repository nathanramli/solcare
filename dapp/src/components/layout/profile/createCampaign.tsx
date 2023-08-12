import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
    API_BASE_URL,
    CAMPAIGN_AUTHORITY_SEED,
    CAMPAIGN_SEED,
    DerivedAccount,
    fromU32NumberToU8Bytes,
    getDerivedAccount,
    OPACITY,
    USDC_DECIMALS,
    USDC_MINT,
} from '../../../utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSmartContract } from '../../../context/connection';
import { Transaction } from '@solana/web3.js';
import { toast, Id } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
    const navigate = useNavigate();

    const { publicKey, connected, sendTransaction } = useWallet();
    const { smartContract } = useSmartContract();
    const toastId = useRef<Id | null>(null);

    const [uploadedPic, setUploadedPic] = useState();
    const [blob, setBlob] = useState('');

    const [input, setInput] = useState<{ [string: string]: any }>({
        title: '',
        description: '',
        targetAmount: 1,
        category: 1,
        banner: null,
    });

    const [categories, setCategories] = useState<any[]>();

    const fetchCategories = async () => {
        const categories = await axios.get(API_BASE_URL + '/v1/categories');
        setCategories(categories.data.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toastDone = () => {
        if (toastId.current) toast.done(toastId.current);
        toastId.current = null;
    };

    const resetForm = () => {
        setInput({
            title: '',
            description: '',
            targetAmount: 1,
            category: 1,
            banner: null,
        });
    };

    const handleInputChange = (e: any) => {
        const target = e.target;
        const name = target.name;

        setInput((state) => {
            const newState = {
                ...state,
            };
            newState[name] = name === 'banner' ? target.files[0] : target.value;
            return newState;
        });

        if (name === 'banner') {
            let file = target.files[0];

            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                setUploadedPic(file.name);
                setBlob(URL.createObjectURL(file));
                URL.revokeObjectURL(file);
            } else {
                toast.error('Format file invalid');
            }
        }
    };

    const submitForm = async () => {
        if (
            input.title === '' ||
            input.description === '' ||
            input.banner === null
        )
            return toast.error('Mohon isi seluruh informasi yang dibutuhkan!');

        if (!connected || !publicKey || toastId.current) return;

        toastId.current = toast('Memproses campaign baru kamu!', {
            progress: 0.1,
            autoClose: false,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
        });
        let i = 1;
        let campaignDerivedAccount: DerivedAccount;
        for (; i <= 1000; i++) {
            campaignDerivedAccount = getDerivedAccount(
                [CAMPAIGN_SEED, publicKey, fromU32NumberToU8Bytes(i)],
                smartContract.programId
            );
            const account =
                await smartContract.provider.connection.getAccountInfo(
                    campaignDerivedAccount.publicKey
                );
            if (!account) {
                break;
            }
        }

        toast.update(toastId.current, { progress: 0.3 });

        const campaignAuthorityDerivedAccount = getDerivedAccount(
            [CAMPAIGN_AUTHORITY_SEED, campaignDerivedAccount!.publicKey],
            smartContract.programId
        );

        const campaignVault = await spl.getAssociatedTokenAddress(
            USDC_MINT,
            campaignAuthorityDerivedAccount.publicKey,
            true
        );

        const formData = new FormData();
        formData.append(
            'address',
            campaignDerivedAccount!.publicKey.toBase58()
        );
        formData.append('ownerAddress', publicKey.toBase58());
        formData.append('title', input.title);
        formData.append('description', input.description);
        formData.append('categoryId', input.category);
        formData.append('banner', input.banner);

        // try {
        //     const resp = await axios.postForm(
        //         API_BASE_URL + '/v1/campaign',
        //         formData
        //     );

        //     if (resp.data.status !== 200) {
        //         toastDone();
        //         toast.error(`Campaign gagal dibuat!`);
        //         return;
        //     }
        //     toast.update(toastId.current, { progress: 0.5 });
        // } catch (e) {
        //     toastDone();
        //     console.log('Error: ', e);
        //     toast.error(`Campaign gagal dibuat!`);
        //     return;
        // }

        try {
            const ix = await smartContract.methods
                .initCampaign(
                    i,
                    new anchor.BN(10)
                        .pow(new anchor.BN(USDC_DECIMALS))
                        .imuln(Number.parseInt(input.targetAmount))
                )
                .accounts({
                    owner: publicKey,
                    campaign: campaignDerivedAccount!.publicKey,
                    campaignAuthority:
                        campaignAuthorityDerivedAccount.publicKey,
                    usdcMint: USDC_MINT,
                    campaignVault: campaignVault,
                    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                    associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
                    tokenProgram: spl.TOKEN_PROGRAM_ID,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .instruction();

            const tx = await sendTransaction(
                new Transaction().add(ix),
                smartContract.provider.connection
            );

            toast.update(toastId.current, { progress: 0.5 });
            toastDone();
            toast(`🚀 Campaign berhasil dibuat! Signature transaksi: ${tx}`);
            navigate(`/profile`);
        } catch (e) {
            toastDone();
            console.log('Error: ', e);
            toast.error(`Campaign gagal dibuat!`);
            return;
        }

        try {
            const resp = await axios.postForm(
                API_BASE_URL + '/v1/campaign',
                formData
            );

            if (resp.data.status !== 200) {
                toastDone();
                toast.error(`Campaign gagal dibuat!`);
                return;
            }
            toast.update(toastId.current, { progress: 1 });
        } catch (e) {
            toastDone();
            console.log('Error: ', e);
            toast.error(`Campaign gagal dibuat!`);
            return;
        }

        resetForm();
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col">
                <p className="font-bold text-xs md:text-lg">
                    Isi Informasi Campaign
                </p>
                <div className="mt-2">
                    <p className="text-xs md:text-lg">Judul</p>
                    <input
                        onChange={handleInputChange}
                        value={input.title}
                        name="title"
                        className="text-xs p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
                        focus:outline-none md:text-xl md:p-4 md:rounded-[10px]"
                        type="text"
                    />
                </div>
                <div className="mt-2">
                    <p className="text-xs md:text-lg">Deskripsi</p>
                    <textarea
                        onChange={handleInputChange}
                        value={input.description}
                        name="description"
                        className="text-xs p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
                        focus:outline-none md:text-xl md:p-4 md:rounded-[10px]"
                    />
                </div>
                <div className="mt-2">
                    <p className="text-xs md:text-lg">Kategori</p>
                    <select
                        className="select select-bordered w-full max-w-xs"
                        name="category"
                        onChange={handleInputChange}
                        value={input.category}
                        defaultValue={input.category}
                    >
                        {categories?.map((e) => {
                            return <option value={e.id}>{e.name}</option>;
                        })}
                    </select>
                </div>
                <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <div className="basis-1/2">
                        <div>
                            <p className="text-xs md:text-lg">
                                Target Pendanaan
                            </p>
                            <div className=" w-full flex flex-row items-center">
                                <input
                                    className="text-xs basis-11/12 text-center p-2 mr-2 min-w-[100px] rounded-[5px] border 
                                    border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none 
                                    md:text-xl md:p-4 md:mr-4 md:rounded-[10px]"
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    name="targetAmount"
                                    value={input.targetAmount}
                                    onChange={handleInputChange}
                                />
                                <p className="basis-1/12 text-xs font-bold text-center md:text-xl">
                                    USDC
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-xs md:text-lg">Upload Gambar</p>
                    <label
                        htmlFor="dropzone-file"
                        style={{
                            backgroundImage: `linear-gradient(
                            rgba(0, 0, 0, ${blob == '' ? 0 : OPACITY}), 
                            rgba(0, 0, 0, ${blob == '' ? 0 : OPACITY})
                          ),url(${blob})`,
                        }}
                        className={`hover:brightness-90 shrink-0 h-28 w-full bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-[10px] cursor-pointer`}
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
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                            <input
                                name="banner"
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                value={input.banner?.webkitRelativePath}
                                onChange={handleInputChange}
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    </label>
                    <p
                        id="address-tag"
                        className="text-xs md:text-base font-medium truncate"
                    >
                        {uploadedPic}
                    </p>
                </div>
                <button
                    className="mt-4 self-end bg-[#007BC7] text-xs w-full p-2 border border-[2px] border-[#007BC7] text-white 
                    font-bold rounded-[5px] md:text-xl md:p-4 md:rounded-[10px]"
                    onClick={submitForm}
                >
                    Buat Campaign
                </button>
            </div>
        </div>
    );
};

export default CreateCampaign;
