import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../../utils';
import axios from 'axios';
interface ReportCardProps {
    data: any;
}

const ReportCard: React.FC<ReportCardProps> = (props) => {
    const [funderName, setFunderName] = useState('');
    const fetchUser = async () => {
        const resp = await axios.get(
            `${API_BASE_URL}/v1/users/info/${props.data.reporter}`
        );

        if (resp.data.status === 200) {
            setFunderName(
                resp.data.data.firstName + ' ' + resp.data.data.lastName
            );
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <div className="p-2 md:p-4 my-2 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,123,199,0.25)] hover:shadow-[0px_10px_10px_0px_rgba(0,123,199,0.5)]">
            <p className="text-xs md:text-lg font-bold">{funderName}</p>
            <p className="text-[8px] md:text-base">{props.data.reporter}</p>
            <br />
            <p className="text-[8px] md:text-base">{props.data.description}</p>
        </div>
    );
};

export default ReportCard;
