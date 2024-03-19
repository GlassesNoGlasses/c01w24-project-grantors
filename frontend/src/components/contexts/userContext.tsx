import React, { createContext, useEffect, useMemo, useState } from "react"
import { Dispatch, SetStateAction } from "react"
import { User } from "../../interfaces/User"
import { Cookies } from "react-cookie";
import UserController from "../../controllers/UserController";

interface UserContextType {
    user: User | null,

    setUser: Dispatch<SetStateAction<User | null>>,
};

const UserContext = createContext<UserContextType>({
    user: null,

    setUser: (prevState: SetStateAction<User | null>) => prevState,
});

async function checkUserCookie(setUser: Dispatch<SetStateAction<User | null>>) {
    const userToken = new Cookies().get('user-token');

    if (!userToken) return;

    // Fetch the user from the server
    const user = await UserController.fetchUser(userToken);

    user && setUser(user);
}

export function UserContextProvider (children: React.ReactNode) : JSX.Element {
    const [user, setUser] = useState<User | null>(null);

    const value = useMemo(() => ({ user, setUser }), [user, setUser]);

    useEffect(() => {
        checkUserCookie(setUser);
    }, []);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => React.useContext(UserContext);
