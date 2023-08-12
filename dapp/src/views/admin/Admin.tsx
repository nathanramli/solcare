import AdminDrawer from '../../components/layout/admin/adminDrawer';
const Admin = (props: any) => {
    return (
        <main className="max-w-screen-xl mx-auto">
            <AdminDrawer page={props.page}>{props.children}</AdminDrawer>
        </main>
    );
};

export default Admin;
