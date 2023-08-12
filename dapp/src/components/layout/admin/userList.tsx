import { defaultProps } from 'react-select/dist/declarations/src/Select';
import UserTable from './table/userTable';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils';
const UserList = (props: any) => {
    const [userData, setUserData] = useState();

    const fetchUser = async () => {
        const resp = await axios.get(`${API_BASE_URL}/v1/users`);

        if (resp.data.status === 200) {
            setUserData(resp.data.data);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div>
            <UserTable userData={userData} />
        </div>
    );
};

export default UserList;
