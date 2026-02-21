import { useContext, useEffect } from "react";
import logo from "../../assets/images/logo copy.png";
import AuthContext from "../../context/auth.context";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import authSvc from "../auth/auth.service";

export type ResetType = {
    password: string,
    confirmpassword: string
};

function ResetPasswordPage() {
    const navigate = useNavigate();
    const auth: any = useContext(AuthContext);
    const Params = useParams();
    const token: any = Params.token;
    const resetDTO = Yup.object({
        password: Yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
            )
            .required("Password is required"),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetType>({
        resolver: yupResolver(resetDTO)
    });

    const submitEvent = async (data: ResetType) => {
        try {
            const res = await authSvc.resetPassword(data, token);
            console.log("resp", res);
            toast.success("Your password has been successfully reset.");
            navigate('/signin');
        } catch (exception: any) {
            toast.error(exception.message || "Failed to  reset password");
            navigate('/');
        }
    };

    const loginCheck = async () => {
        try {
            if (auth.loggedInUser) {
                const role = auth.loggedInUser.role_title;
                console.log(role);
                navigate(role === 'Player' ? '/' : '/' + role);
            }
        } catch (exception) {
            // console.log(exception);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access') || null;
        if (token) {
            loginCheck();
        }
    }, [auth]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                    <div className="font-extrabold mb-5 text-center">
                        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img
                                src={logo}
                                className="h-10"
                                alt="Khelasathi Logo"
                            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Khela<span className="text-amber-700">Sathi</span>
                            </span>
                        </a>
                    </div>

                    <h1 className="mb-1 text-xl font-medium leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Change Password
                    </h1>
                    {/* <p className="font-light text-gray-500 dark:text-gray-400">
                     
                    </p> */}

                    <form onSubmit={handleSubmit(submitEvent)} className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="password"
                                {...register("password")}
                                id="floating_password"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-amber-500 focus:outline-none focus:ring-0 focus:border-amber-600 peer"
                                placeholder=" "
                            />
                            <label
                                htmlFor="floating_password"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-amber-600 peer-focus:dark:text-amber-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                New  Password
                            </label>
                            {errors.password && (
                                <span className="text-red-700 text-sm mt-1">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="password"
                                {...register("confirmpassword")}
                                id="floating_confirmpassword"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-amber-500 focus:outline-none focus:ring-0 focus:border-amber-600 peer"
                                placeholder=" "
                            />
                            <label
                                htmlFor="floating_confirmpassword"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-amber-600 peer-focus:dark:text-amber-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Confirm Password
                            </label>
                            {errors.confirmpassword && (
                                <span className="text-red-700 text-sm mt-1">
                                    {errors.confirmpassword.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800"
                        >
                            Done
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default ResetPasswordPage;