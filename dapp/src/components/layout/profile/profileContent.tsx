import React from 'react';
import { useState } from 'react';
import MainProfile from './mainProfile';
import CampaignList from './campaignList';
import HistoryTransaction from './historyTransaction';
import AccountSetting from './accountSetting';
import CreateCampaign from './createCampaign';
import DetailCampaign from './detailCampaign';

interface ProfileContentProps {
    page: string;
}
const ProfileContent: React.FC<ProfileContentProps> = (props) => {
    const generatePage = () => {
        switch (props.page) {
            case 'Profil':
                return <MainProfile />;
            case 'Campaign Anda':
                return <CampaignList />;
            case 'Buat Campaign':
                return <CreateCampaign />;
            case 'Detail Campaign':
                return <DetailCampaign status={' '} />;
            case 'Riwayat Transaksi':
                return <HistoryTransaction />;
            case 'Pengaturan Akun':
                return <AccountSetting />;
            default:
                return <MainProfile />;
        }
    };
    return <div className="min-h-[70vh]">{generatePage()}</div>;
};
export default ProfileContent;
