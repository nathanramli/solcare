import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfilePlaceholder from '../../../image/profilePic.png';
import { API_BASE_URL } from '../../../utils';

export interface FundraiserInfo {
    address: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string;

    isVerified: boolean;
    isWarned: boolean;
}

const FundraiserInfo = (props: any) => {
    const [initializing, setInitializing] = useState(true);

    const [fundraiserData, setFundraiserData] = useState<FundraiserInfo>();
    let campaign = props.campaign;

    const fetchFundraiser = async () => {
        const resp = await axios.get(
            `${API_BASE_URL}/v1/users/info/${campaign.ownerAddress}`
        );

        if (resp.data.status === 200) {
            setFundraiserData(resp.data.data);
        }
    };

    useEffect(() => {
        setInitializing(false);
        fetchFundraiser();
    }, []);

    if (initializing || fundraiserData === undefined) {
        return null;
    }
    return (
        <div className="mt-2 md:mt-4">
            <h2 className="mb-2 text-xs font-bold md:hidden">
                Info Fundraiser
            </h2>
            <div className="flex flex-row items-center md:flex-col">
                <div className="flex flex-col items-center mr-2 pr-1 md:mr-0 md:pr-0">
                    <img
                        className="w-8 h-8 rounded-full md:w-32 md:h-32 object-cover"
                        src={
                            fundraiserData.profilePicture === ''
                                ? ProfilePlaceholder
                                : `${API_BASE_URL}/resources/${fundraiserData.profilePicture}`
                        }
                        alt="placeholder"
                    />
                    <div className="text-[8px] md:text-[15px] mt-2">
                        {fundraiserData.isWarned ? (
                            <p className="text-red-600 text-bold">
                                Diperingati
                            </p>
                        ) : (
                            <> </>
                        )}
                    </div>
                    <div className="text-[8px] md:text-[15px]">
                        {fundraiserData.isVerified ? (
                            <p className="text-green-600 text-base">
                                Terverifikasi
                            </p>
                        ) : (
                            'Belum Terverifikasi'
                        )}
                    </div>
                </div>
                <div className="divider" />

                <div className="flex flex-col pl-1 md:pl-0 md:self-start">
                    <p
                        id="address-tag"
                        className="text-xs font-bold md:text-xl"
                    >
                        {/* Nama Fundraiser */}
                        {fundraiserData.firstName === '' ||
                        fundraiserData.lastName === ''
                            ? 'User'
                            : `${fundraiserData.firstName} ${fundraiserData.lastName}`}
                    </p>
                    <p className="text-[8px] md:text-[15px] mb-2">
                        {/* E-mail Fundraiser */}
                        {fundraiserData.email === '' ? (
                            <></>
                        ) : (
                            fundraiserData.email
                        )}
                    </p>
                    <p id="address-tag" className="text-[8px] md:text-[15px]">
                        {/* Wallet Fundraiser */}
                        {campaign.ownerAddress}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FundraiserInfo;
