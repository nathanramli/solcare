import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { decodeJwt } from 'jose';
import { useEffect, useState, useContext } from 'react';
import { API_BASE_URL } from '../../utils';
import axios from 'axios';
import base58 from 'bs58';
import { now } from '../../utils';
import { LOGIN_MESSAGE } from '../../utils';
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import { AdminContext } from '../../utils/state';
const PrivateRoute = (props: any) => {
    const { state } = useContext(AdminContext);
    const { connected, publicKey, disconnecting } = useWallet();
    const { isAdmin } = state;
    return (
        <>
            {props.forAdmin ? (
                connected ? (
                    isAdmin ? (
                        props.children
                    ) : (
                        <div className="min-h-[70vh] flex flex-wrap flex-col content-center justify-center bg-gray-100">
                            <p className="text-xl text-center px-8">
                                Anda Tidak Punya Akses di Halaman Ini
                            </p>
                        </div>
                    )
                ) : (
                    <div className="min-h-[70vh] flex flex-wrap flex-col content-center justify-center bg-gray-100">
                        <p className="text-xl text-center px-8">
                            Silahkan Select Wallet Terlebih Dahulu
                        </p>
                        <WalletMultiButton
                            style={{ backgroundColor: '#007BC7' }}
                            className="btn !text-xs capitalize !bg-[#007BC7] !rounded-[5px] !h-12 xl:!h-16 !w-[11rem] xl:!rounded-[10px] xl:!w-[22rem] xl:!text-xl mx-auto mt-5"
                        >
                            Select Wallet
                        </WalletMultiButton>
                    </div>
                )
            ) : props.showsEvenDisconnected ? (
                props.children
            ) : connected ? (
                isAdmin ? (
                    <div className="min-h-[70vh] flex flex-wrap flex-col content-center justify-center bg-gray-100">
                        <p className="text-xl text-center px-8">
                            Anda Tidak Punya Akses di Halaman Ini
                        </p>
                    </div>
                ) : (
                    props.children
                )
            ) : (
                <div className="min-h-[70vh] flex flex-wrap flex-col content-center justify-center bg-gray-100">
                    <p className="text-xl text-center px-8">
                        Silahkan Select Wallet Terlebih Dahulu
                    </p>
                    <WalletMultiButton
                        style={{ backgroundColor: '#007BC7' }}
                        className="btn !text-xs capitalize !bg-[#007BC7] !rounded-[5px] !h-12 xl:!h-16 !w-[11rem] xl:!rounded-[10px] xl:!w-[22rem] xl:!text-xl mx-auto mt-5"
                    >
                        Select Wallet
                    </WalletMultiButton>
                </div>
            )}
        </>
    );
};

export default PrivateRoute;
