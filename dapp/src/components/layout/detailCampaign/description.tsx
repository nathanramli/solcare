import { useEffect, useState } from 'react';

const Description = (props: any) => {
    const campaign = props.campaign;

    const [currentText, setCurrentText] = useState('line-clamp-none');
    const [currentLabel, setCurrentLabel] = useState('Tutup deskripsi');
    const [currentDisplay, setCurrentDisplay] = useState(true);

    const showText = () => {
        if (currentLabel === 'Baca selengkapnya') {
            setCurrentText('line-clamp-none');
            setCurrentLabel('Tutup deskripsi');
        } else {
            setCurrentText('line-clamp-6');
            setCurrentLabel('Baca selengkapnya');
        }
    };

    const countLine = () => {
        let doc = document.getElementById('desc');
        let fontSize = window.innerWidth < 768 ? 8 : 15;
        let divHeight = doc!!.offsetHeight;
        let lineHeight = fontSize * 1.5;
        let lines = divHeight / lineHeight;
        return lines;
    };

    useEffect(() => {
        if (countLine() > 6) {
            setCurrentDisplay(false);
            setCurrentLabel('Baca selengkapnya');
            setCurrentText('line-clamp-6');
        }
    }, []);

    return (
        <div className="mt-2 text-[8px] text-right md:mt-6 md:text-[15px]">
            <h2 className="text-xs font-bold text-left mb-1 md:text-xl md:mb-2">
                Deskripsi
            </h2>
            <p id="desc" className={`text-justify ${currentText}`}>
                {campaign.description}
            </p>
            <button
                className="font-bold hover:underline hover:decoration-[#007BC7]"
                onClick={() => showText()}
                hidden={currentDisplay}
            >
                {currentLabel}
            </button>
        </div>
    );
};

export default Description;
