import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const ConnectWallet = () => {
    return (
        <article className="relative text-center my-24 xl:my-72 xl:mx-28 xl:static">
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 
                min-[512px]:static min-[512px]:top-0 min-[512px]:left-0 min-[512px]:-translate-x-0 
                min-[512px]:-translate-y-0"
            >
                <h1 className="font-bold text-l text-black mb-3 md:text-xl xl:text-5xl xl:mb-6">
                    Langsung akses saja seluruh fitur Solcare
                </h1>
                <WalletMultiButton
                    style={{ backgroundColor: '#007BC7' }}
                    className="btn !text-xs capitalize !bg-[#007BC7] !rounded-[5px] !h-12 xl:!h-16 !w-[11rem] xl:!rounded-[10px] xl:!w-[22rem] xl:!text-xl mx-auto"
                >
                    Select Wallet
                </WalletMultiButton>
            </div>
        </article>
    );
};

export default ConnectWallet;
