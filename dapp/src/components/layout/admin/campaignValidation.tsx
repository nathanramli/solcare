import CampaignValidationTable from './table/campaignValidationTable';
import { API_BASE_URL } from '../../../utils';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CampaignValidation = () => {
    const [campaignData, setCampaignData] = useState();
    const fetchCampaign = async () => {
        let token = localStorage.getItem('token');

        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const resp = await axios.get(`${API_BASE_URL}/v1/campaign/evidence`, {
            headers,
        });

        if (resp.data.status === 200) {
            setCampaignData(resp.data.data);
        }
    };

    useEffect(() => {
        fetchCampaign();
    }, []);
    return (
        <div>
            <CampaignValidationTable
                campaignData={campaignData}
                refetch={fetchCampaign}
            />
        </div>
    );
};

export default CampaignValidation;
