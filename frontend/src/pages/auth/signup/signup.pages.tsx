import logo from "../../../assets/images/logo copy.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, ChangeEvent, useContext, useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import authSvc from "../auth.service";
import { useForm, SubmitHandler } from "react-hook-form";
import { setErrorMessages } from "../../../config/helpers.config";
import AuthContext from "../../../context/auth.context";

export type RegisterType = {
    email: string;
    password: string;
    confirmpassword: string;
    full_name: string;
    contact_number: string;
    role_title: "Player" | "Venue";
    address: string;
    profile_img: FileList;
};

function SignupPage() {

    const auth: any = useContext(AuthContext);
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
            )
            .required("Password is required"),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
        full_name: Yup.string().required("Full name is required"),
        contact_number: Yup.string()
            .matches(/^[0-9]{10}$/, "Must be a valid 10-digit phone number")
            .required("Contact number is required"),
        role_title: Yup.string()
            .oneOf(["Player", "Venue"], "Invalid role")
            .required("Role is required"),
        address: Yup.string().required("Address is required"),
        profile_img: Yup.mixed<FileList>()
            .test("fileRequired", "Profile image is required", (value) => {
                return !!value && value.length > 0;
            })
            .test("fileSize", "File too large", (value) => {
                return !!value && value[0] && value[0].size <= 2000000;
            })
            .test("fileType", "Unsupported file format", (value) => {
                return !!value && value[0] && ["image/jpeg", "image/png", "image/gif"].includes(value[0].type);
            })
            .optional()

    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<RegisterType>({
        resolver: yupResolver(validationSchema) as any,
    });
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setImagePreview(reader.result);
                }
            };
            reader.readAsDataURL(file);


        } else {

            setImagePreview(null);
        }
    };
    const handleImageClick = () => {
        fileInputRef.current?.click();

    };

    const submitEvent: SubmitHandler<RegisterType> = async (data) => {
        try {
            setLoading(true);
            await authSvc.register(data);

            toast.success("Registration successful. Please check you email for further process.");
            Navigate('/', { replace: true });
            //  window.location.reload();
        } catch (exception: any) {
            setErrorMessages(exception, setError);
            toast.error(exception.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow-md">
                <form className="max-w-md mx-auto" onSubmit={handleSubmit(submitEvent)}>
                    <div className="font-extrabold mb-5 text-center">
                        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src={logo} className="h-10" alt="Khelasathi Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Khela<span className="text-amber-700">Sathi</span>
                            </span>
                        </a>
                    </div>
                    <div className="font-extrabold mb-5 text-center">
                        <h2 className="text-2xl font-medium">Sign up</h2>
                    </div>




                    {/* Profile Image Uploader */}
                    <div className="w-full flex justify-center mb-5">
                        <div className="flex flex-col items-center">
                            {/* Clickable preview area */}
                            <div
                                className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-none pointer-events-none overflow-hidden"
                                onClick={handleImageClick}
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback if the image fails to load
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,...'; // Your fallback SVG
                                            setImagePreview(null);
                                        }}
                                    />
                                ) : (
                                    <svg
                                        className="w-10 h-10 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        ></path>
                                    </svg>
                                )}
                            </div>

                            {/* Hidden file input with proper validation */}
                            <input
                                type="file"
                                {...register("profile_img")}
                                ref={(e) => {
                                    register("profile_img").ref(e);
                                    if (e) fileInputRef.current = e;
                                }}
                                onChange={handleImageChange}
                                accept="image/jpeg, image/png, image/gif"
                                className=""
                            />

                            {/* File information display */}
                            <div className="text-center mt-2">
                                {fileInputRef.current?.files?.[0] ? (
                                    <div className="text-sm">

                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Click to upload profile photo
                                    </p>
                                )}
                                {errors.profile_img && (
                                    <p className="mt-1 text-sm text-red-600">{errors.profile_img.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="email"
                            {...register("email")}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-amber-600 peer"
                            placeholder=" "
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Email address
                        </label>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Full Name Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            {...register("full_name")}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-amber-600 peer"
                            placeholder=" "
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Full name
                        </label>
                        {errors.full_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                        )}
                    </div>

                    {/* Address Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            {...register("address")}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-amber-600 peer"
                            placeholder=" "
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Address
                        </label>
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Password Fields */}
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="password"
                                {...register("password")}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-amber-600 peer"
                                placeholder=" "
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Password
                            </label>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="password"
                                {...register("confirmpassword")}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-amber-600 peer"
                                placeholder=" "
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Confirm password
                            </label>
                            {errors.confirmpassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmpassword.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact and Role Fields */}
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="tel"
                                {...register("contact_number")}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-amber-600 peer"
                                placeholder=" "
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Phone number
                            </label>
                            {errors.contact_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.contact_number.message}</p>
                            )}
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <select
                                {...register("role_title")}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                defaultValue=""
                            >
                                <option value="" disabled className="text-gray-500">
                                    Select role
                                </option>
                                <option value="Player">Player</option>
                                <option value="Venue">Venue</option>
                            </select>
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Role
                            </label>
                            {errors.role_title && (
                                <p className="mt-1 text-sm text-red-600">{errors.role_title.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        {loading ? (
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="w-full text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Sign up
                            </button>
                        )}
                    </div>

                    <div className="mt-5 mb-0">
                        <NavLink
                            to="/signin"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Already have account? Sign in.
                        </NavLink>
                    </div>
                </form>


            </div>
        </div>
    );
}

export default SignupPage;