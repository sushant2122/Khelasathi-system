
import { useForm } from "react-hook-form";
import logo from "../../../assets/images/logo copy.png";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import authSvc from "../auth.service";
import { useContext, useEffect } from "react";
import AuthContext from "../../../context/auth.context";
export type CredentialType = {
    email: string,
    password: string
}

function SigninPage() {
    const Navigate = useNavigate();
    const auth: any = useContext(AuthContext);
    const signinDTO = Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required()
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signinDTO)
    })
    const submitEvent = async (credentials: CredentialType) => {
        try {
            //api call
            await authSvc.login(credentials);
            const userResponse = await authSvc.getLoggedInUser();

            auth.setLoggedInUser(userResponse.data.result);
            toast.success("User successfully logged in.")



        } catch (exception: any) {
            toast.error(exception.data.message);

        }


    }
    const loginCheck = async () => {
        try {
            if (auth.loggedInUser) {
                // toast.info("You are already loggedIn.")
                const role = auth.loggedInUser.role_title;
                console.log(role);
                Navigate(role === 'Player' ? '/' : '/' + role);

            }
        } catch (exception) {
            console.log(exception);
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('access') || null
        if (token) {
            loginCheck()
        }
    }, [auth])


    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100"> {/* Full viewport height with center alignment */}
                <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow-md"> {/* Form container */}
                    <form onSubmit={handleSubmit(submitEvent)}>
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
                        <div className="font-extrabold mb-5 text-center">
                            <h2 className="text-2xl font-medium">Sign in</h2>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="email"
                                {...register("email")}
                                id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-amber-500 focus:outline-none focus:ring-0 focus:border-amber-600 peer" placeholder=" " />
                            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-amber-600 peer-focus:dark:text-amber-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>

                            <span className="text-red-700">
                                {
                                    errors?.email?.message
                                }
                            </span>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="password"
                                {...register("password")}
                                id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-amber-500 focus:outline-none focus:ring-0 focus:border-amber-600 peer" placeholder=" " />
                            <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-amber-600 peer-focus:dark:text-amber-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>

                            <span className="text-red-700">
                                {
                                    errors?.password?.message
                                }
                            </span>
                        </div>


                        <div className="flex items-start mb-3">

                            <NavLink to="/forgot-password" className="text-sm text-blue-600 hover:underline dark:text-blue-500">Forgot your password?</NavLink>


                        </div>
                        <div className="flex items-center justify-center ">
                            <button type="submit" className="w-full text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800">Sign in</button>
                        </div>

                        <div className="mt-5 mb-0">
                            <NavLink to="/signup" className="text-sm text-blue-600 hover:underline dark:text-blue-500"> Not Registered? Create Account.</NavLink>
                        </div>



                    </form>
                </div>
            </div>
        </>
    )
}

export default SigninPage
