import UserVerification from './userVerification';
import UserList from './userList';
import ReportList from './reportList';
import CampaignValidation from './campaignValidation';
import ReportDetail from './reportDetail';
import UserDetail from './userDetail';
import Dashboard from './dashboard';
interface AdminContentProps {
    page: string;
}
const AdminContent: React.FC<AdminContentProps> = (props) => {
    const generatePage = () => {
        switch (props.page) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Verifikasi User':
                return <UserVerification />;
            case 'Manajemen User':
                return <UserList />;
            case 'Detail User':
                return <UserDetail />;
            case 'Verifikasi Kesuksesan Campaign':
                return <CampaignValidation />;
            case 'Pengaduan':
                return <ReportList />;
            case 'Detail Pengaduan':
                return <ReportDetail />;
            default:
                return <Dashboard />;
        }
    };
    return <div className="min-h-[70vh]">{generatePage()}</div>;
};
export default AdminContent;
