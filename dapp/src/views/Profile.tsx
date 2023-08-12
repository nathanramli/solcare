import ProfileDrawer from '../components/layout/profile/profileDrawer';
const Profile = (props: any) => {
    return (
        <main className="max-w-screen-xl mx-auto">
            <ProfileDrawer page={props.page}>{props.children}</ProfileDrawer>
        </main>
    );
};

export default Profile;
