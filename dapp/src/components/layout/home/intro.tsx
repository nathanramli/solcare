import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IntroPic1 from '../../../image/intro.jpg';
import IntroPic2 from '../../../image/intro2.jpg';
import IntroPic3 from '../../../image/intro3.jpg';

const images = [IntroPic1, IntroPic2, IntroPic3];
const transition = ['fade-in', 'fade-out'];

const Intro = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentFade, setCurrentFade] = useState('fade-in');

    useEffect(() => {
        const fadeTimeout = setInterval(() => {
            currentFade === 'fade-in'
                ? setCurrentFade('fade-out')
                : setCurrentFade('fade-in');
        }, 3500);

        return () => clearInterval(fadeTimeout);
    }, [currentFade]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            currentIndex === images.length - 1
                ? setCurrentIndex(0)
                : setCurrentIndex(currentIndex + 1);
        }, 7000);

        return () => clearInterval(intervalId);
    }, [currentIndex]);

    return (
        <article className="relative xl:static xl:flex xl:flex-row xl:items-end xl:max-w-screen-2xl xl:space-x-6">
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 
                xl:ml-28 xl:static xl:top-0 xl:left-0 xl:-translate-x-0 xl:-translate-y-0 xl:text-left"
            >
                <h1 className="font-black text-black text-2xl text-left xl:text-6xl">
                    SOLCARE
                </h1>
                <p className="font-light text-black text-lg mb-6 text-left xl:text-3xl xl:mb-12">
                    SOLANA BLOCKCHAIN CROWDFUNDING <br /> PLATFORM
                </p>
                <p className="text-justify text-black text-xs mb-3 xl:text-xl xl:mb-6">
                    Buatlah <i>campaign</i> dan kumpuli dana untuk projek anda,
                    dan jadilah <i>funder</i> untuk membantu mendanai{' '}
                    <i>campaign</i>. Dengan teknologi <i>blockchain</i>,
                    transaksi menjadi transparan dan aman.
                </p>
                <Link to={'/explore'}>
                    <button
                        className="bg-[#007BC7] text-xs w-[11rem] h-8 text-white font-bold rounded-[5px] xl:w-[22rem] xl:rounded-[10px] xl:h-16 xl:text-xl
                    "
                    >
                        Cari Campaign
                    </button>
                </Link>
            </div>
            <img
                className={`object-cover ${currentFade} h-[24rem] opacity-40 z-0 w-screen xl:w-[48rem] xl:h-[34rem] 
                xl:rounded-bl-[200px] xl:opacity-100`}
                src={images[currentIndex]}
            />
        </article>
    );
};

export default Intro;
