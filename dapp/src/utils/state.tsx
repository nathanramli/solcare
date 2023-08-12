import React, { createContext, useReducer, Dispatch } from 'react';
import { isAdminReducer, Actions } from './reducer';
type InitialStateType = {
    isAdmin: boolean | undefined;
};
const initialState = {
    isAdmin: false,
};

const AdminContext = createContext<{
    state: InitialStateType;
    dispatch: Dispatch<Actions>;
}>({
    state: initialState,
    dispatch: () => null,
});

const mainReducer = (isAdmin: any, action: Actions) => ({
    isAdmin: isAdminReducer(isAdmin, action),
});

// const AdminProvider: React.FC =({children} :any) => {
const AdminProvider = (props: any) => {
    const [state, dispatch] = useReducer(mainReducer, initialState);

    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AdminContext.Provider>
    );
};

export { AdminContext, AdminProvider };
