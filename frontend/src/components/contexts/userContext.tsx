import React, { createContext, useMemo, useState } from "react"
import { Dispatch, SetStateAction } from "react"
import { User } from "../interfaces/user";

interface UserContextType {
    user: User | null,

    setUser: Dispatch<SetStateAction<User | null>>,
};

const UserContext = createContext<UserContextType>({
    user: null,

    setUser: (prevState: SetStateAction<User | null>) => prevState,
});

export function UserContextProvider (children: React.ReactNode) : JSX.Element {
    const [user, setUser] = useState<User | null>(null);

    const value = useMemo(() => ({ user, setUser }), [user, setUser]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserContext = () => React.useContext(UserContext);
