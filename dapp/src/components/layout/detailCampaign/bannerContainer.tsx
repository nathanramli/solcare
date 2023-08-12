import Thumbnail from '../../../image/placeholder.svg';
import { API_BASE_URL } from '../../../utils';

const BannerContainer = (props: any) => {
    return (
        <>
            {props.campaign.delisted ? (
                <button
                    className="w-full bg-red-600 text-white p-2 underline decoration-1"
                    onClick={() => {
                        window.open(
                            '/campaign/reports/' + props.campaign.address,
                            '_blank',
                            'noreferrer'
                        );
                    }}
                >
                    Campaign ini memiliki indikasi kecurangan, berikut laporan
                    dari para funder
                </button>
            ) : (
                <></>
            )}
            <img
                className="w-screen max-h-[250px] object-cover mb-1 md:max-h-[300px] lg:max-h-[350px] md:rounded-b-[20px] md:mb-4"
                src={`${API_BASE_URL}/${props.campaign.banner}`}
            />
        </>
    );
};

export default BannerContainer;
