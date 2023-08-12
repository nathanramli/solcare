export enum ActionType {
    IsAdmin = 'IS_ADMIN',
    NotAdmin = 'NOT_ADMIN',
}

export type Actions =
    | { type: ActionType.IsAdmin }
    | { type: ActionType.NotAdmin };

export const isAdminReducer = (state: boolean, action: Actions) => {
    switch (action.type) {
        case ActionType.IsAdmin:
            return true;
        case ActionType.NotAdmin:
            return false;
        default:
            return state;
    }
};
