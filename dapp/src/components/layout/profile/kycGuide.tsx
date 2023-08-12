import GuideKTP from '../../../image/KYC_Guide_KTP.jpg';
import GuideFace from '../../../image/KYC_Guide_Face.jpg';
import GuideFaceKTP from '../../../image/KYC_Guide_FaceKTP.jpg';

const KYCGuide = () => {
    return (
        <div className="max-w-screen-xl mx-auto mt-2 md:mt-6 lg:min-h-[74vh]">
            <div className="flex flex-row items-center mb-2 md:mb-6 justify-between">
                <h1 className="text-md font-bold md:text-2xl">
                    Contoh Foto KYC
                </h1>
            </div>
            <div className="grid grid-cols-3 items-center align-center justify-items-center text-center">
                <img src={GuideKTP} className="h-[400px]" />
                <img src={GuideFace} className="h-[400px]" />
                <img src={GuideFaceKTP} className="h-[400px]" />
                <p className="text-lg">Contoh Foto KTP Yang Benar</p>
                <p className="text-lg">Contoh Foto Diri Yang Benar</p>
                <p className="text-lg">
                    Contoh Foto KTP & Foto Diri Yang Benar
                </p>
            </div>
        </div>
    );
};

export default KYCGuide;
