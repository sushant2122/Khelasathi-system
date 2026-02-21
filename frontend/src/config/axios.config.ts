import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 30000, //wait for 30 seconds for api response
        timeoutErrorMessage: "Server timed out...",
        //method:"get,post,put,patch,delete"
        headers: {
            "Content-Type": "application/json"
        },
        responseType: "json",
        responseEncoding: "utf-8"

    })

//400,422 validation error hadnled by component
//401,403,404 no permission accesed in 403 redirect to the pannel, 404 

axiosInstance.interceptors.response.use(
    (response) => {
        // For non-payment responses, return as normal
        return response;

    },
    (exception) => {
        if (exception.status === 401) {
            //redirect to login page with notification
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            toast.error("Please login first.");
            window.location.href = "/signin"
        } else if (exception.status === 403) {
            toast.error("You don't have permission to access.");
            window.location.href = "/"
        }
        else {
            throw exception?.response;
        }
    }
);
export default axiosInstance;