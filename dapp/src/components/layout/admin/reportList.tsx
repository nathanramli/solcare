import ReportTable from './table/reportTable';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils';
const ReportList = (props: any) => {
    const [reportData, setReportData] = useState();

    const fetchReports = async () => {
        const resp = await axios.get(`${API_BASE_URL}/v1/report/group`);

        if (resp.data.status === 200) {
            setReportData(resp.data.data);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);
    return (
        <div>
            <ReportTable reportData={reportData} />
        </div>
    );
};

export default ReportList;
