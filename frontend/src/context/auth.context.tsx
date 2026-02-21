import { createContext, useEffect, useState } from "react";
import authSvc from "../pages/auth/auth.service";
import LoadingComponents, { LoadingSize } from "../components/loading/loading.components";

const AuthContext = createContext({})
export type AuthData = {
    loggedInUser: any,
    setLoggedInUser: any
}
export const AuthProvider = ({ children }: { children: any }) => {
    const [loading, setLoading] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<any>();
    const loginCheck = async () => {
        try {
            const authUser = await authSvc.getLoggedInUser()
            setLoggedInUser(authUser.data.result);
        } catch (exception) {
            console.log(exception);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loginCheck()
    }, [])
    return (
        <>
            {loading ? <><LoadingComponents size={LoadingSize.MD} /></>
                : <>
                    <AuthContext.Provider value={{
                        loggedInUser: loggedInUser,
                        setLoggedInUser: setLoggedInUser
                    } as AuthData}>
                        {children}
                    </AuthContext.Provider>

                </>}

        </>
    )
}
export default AuthContext