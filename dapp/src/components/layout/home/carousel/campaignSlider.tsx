import Slider from 'react-slick';
import '../../../../../src/slick.css';
import '../../../../../src/slick-theme.css';
import CampaignCard from '../card/campaignCard';

const CampaignSlider = (props: any) => {
    const settings = {
        arrows: false,
        dots: true,
        infinite: props.data.length < 3 ? false : true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: true,
                    infinite: props.data.length < 2 ? false : true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="w-full">
            <Slider {...settings}>
                {props.data.map((e: any) => {
                    return (
                        <CampaignCard
                            key={e.campaign.toBase58()}
                            type={props.type}
                            data={e}
                        />
                    );
                })}
            </Slider>
        </div>
    );
};

export default CampaignSlider;
