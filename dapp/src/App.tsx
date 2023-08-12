import { WalletProvider } from '@solana/wallet-adapter-react';
import { ConnectionProvider } from './context/connection';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { createContext, useMemo } from 'react';
import Footer from './components/layout/footer';
import Header from './components/layout/header';
import { ToastContainer } from 'react-toastify';
import { AdminProvider } from './utils/state';

function App(props: any) {
    const wallets = useMemo(
        () => [new PhantomWalletAdapter()],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <>
            <ConnectionProvider>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <AdminProvider>
                            <Header />
                            {props.children}
                            <Footer />
                        </AdminProvider>
                    </WalletModalProvider>
                </WalletProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </ConnectionProvider>
        </>
    );
}

export default App;
