import { useContext, useEffect, useState } from "react";
import LoadingComponents, { LoadingSize } from "../components/loading/loading.components";
import AuthContext from "../context/auth.context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PermissionChecker = ({
    children,
    allowedBy,
    requireLoginOnly = false
}: {
    children: any,
    allowedBy: string,
    requireLoginOnly?: boolean
}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const Navigate = useNavigate();
    const auth: any = useContext(AuthContext);

    const checkPermission = () => {
        if (auth.loggedInUser) {
            if (requireLoginOnly || auth.loggedInUser.role_title === allowedBy) {
                setLoading(false);
            } else {
                toast.warn("You do not have permission to access this panel.");
                const role = auth.loggedInUser.role_title;
                Navigate(role === 'Player' ? '/' : '/' + role);
            }
        } else {
            setLoading(false);
            Navigate('/signin');
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("access") || null;
        if (token) {
            if (auth) {
                checkPermission();
            }
        } else {
            if (requireLoginOnly) {
                // For login-only routes, we might handle differently if needed
                toast.error("Please login to access this page.");
                Navigate('/signin');
            } else {
                toast.error("You have not logged in. Please login.");
                Navigate('/signin');
            }
        }
    }, [auth]);

    if (loading) {
        return <LoadingComponents size={LoadingSize.LG} />;
    } else {
        return children;
    }
}

export default PermissionChecker;