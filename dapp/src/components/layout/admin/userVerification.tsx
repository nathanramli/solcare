import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../utils';
import VerificationTable from './table/verificationTable';

const UserVerification = () => {
    const [userVerificationData, setUserVerificationData] = useState();

    const fetchUserVerification = async () => {
        let token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const resp = await axios.get(`${API_BASE_URL}/v1/admins/kyc`, {
            headers,
        });

        if (resp.data.status === 200) {
            setUserVerificationData(resp.data.data);
        }
    };

    useEffect(() => {
        fetchUserVerification();
    }, []);

    return (
        <div>
            <VerificationTable
                userVerificationData={userVerificationData}
                refetch={fetchUserVerification}
            />
        </div>
    );
};

export default UserVerification;
