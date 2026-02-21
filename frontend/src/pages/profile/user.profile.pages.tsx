import { faMapPin, faPenToSquare, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import UserOverviewComponent from "../../components/common/overview/user-overview.components";
import bookingSvc from "../../services/booking.service";
import { useState, useRef, ChangeEvent, useEffect, useContext } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { setErrorMessages } from "../../config/helpers.config";
import authSvc from "../auth/auth.service";
import AuthContext from "../../context/auth.context";

export type UpdateType = {
    full_name?: string;
    contact_number?: string;
    address?: string;
    profile_img?: FileList;
};

function UserProfilePage() {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [details, setDetails] = useState<any>();
    const auth: any = useContext(AuthContext);

    const validationSchema = Yup.object().shape({
        full_name: Yup.string().required("Full name is required"),
        contact_number: Yup.string()
            .matches(/^[0-9]{10}$/, "Must be a valid 10-digit phone number")
            .required("Contact number is required"),
        address: Yup.string().required("Address is required"),
        profile_img: Yup.mixed<FileList>().optional()
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset
    } = useForm<UpdateType>({
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

    const submitEvent: SubmitHandler<UpdateType> = async (data) => {
        try {
            setLoading(true);
            const resp = await authSvc.update(data);
            // Update the auth context with new user data
            auth.setLoggedInUser(resp.data.result);
            // Update the form with new values
            reset({
                full_name: resp.data.result.full_name,
                contact_number: resp.data.result.contact_number,
                address: resp.data.result.address
            });
            setImagePreview(null); // Reset image preview after update
            toast.success("Profile updated successfully.");
            modaltoggleDropdown(); // Close the modal after successful update
        } catch (exception: any) {
            setErrorMessages(exception, setError);
            toast.error(exception.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const modaltoggleDropdown = () => {
        const modal = document.getElementById("accountInformationModal2");
        if (!modal) return;

        if (modal.classList.contains("hidden")) {
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        } else {
            modal.classList.remove("flex");
            modal.classList.add("hidden");
        }
    };

    const viewStats = async () => {
        try {
            const response = await bookingSvc.getBookngSats();
            setDetails(response.data.result);
        } catch (exception: any) {
            console.log("error", exception)
        }
    }

    useEffect(() => {
        viewStats();
    }, [])

    // Initialize form with user data when component mounts or when auth changes
    useEffect(() => {
        if (auth.loggedInUser) {
            reset({
                full_name: auth.loggedInUser.full_name,
                contact_number: auth.loggedInUser.contact_number,
                address: auth.loggedInUser.address
            });
            if (auth.loggedInUser.profile_img) {
                setImagePreview(auth.loggedInUser.profile_img);
            }
        }
    }, [auth.loggedInUser, reset]);

    return (
        <>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8">
                <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
                    <h2 className="mb-4 text-xl font-medium text-amber-700 dark:text-white sm:text-2xl md:mb-6">User Profile</h2>
                    {details ? (
                        <UserOverviewComponent booking={details.totalBookings} slots={details.totalSlotsBooked} cancelled={details.cancelledBookings} />
                    ) : (
                        <UserOverviewComponent booking={0} slots={0} cancelled={0} />
                    )}

                    <div className="py-4 md:py-8">
                        <div className="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
                            <div className="space-y-4">
                                <div className="flex space-x-4">
                                    <img
                                        className="h-16 w-16 rounded-lg"
                                        src={auth.loggedInUser.profile_img}
                                        alt="avatar"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'path/to/default/avatar.png';
                                        }}
                                    />
                                    <div>
                                        <h2 className="flex items-center text-xl font-bold leading-none text-gray-900 dark:text-white sm:text-2xl">
                                            {auth.loggedInUser.full_name}
                                        </h2>
                                    </div>
                                </div>
                                <dl>
                                    <dt className="font-semibold text-gray-900 dark:text-white">Email Address</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">{auth.loggedInUser.email}</dd>
                                </dl>
                            </div>
                            <div className="space-y-4">
                                <dl>
                                    <dt className="font-semibold text-gray-900 dark:text-white">Phone Number</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">+977 {auth.loggedInUser.contact_number} </dd>
                                </dl>
                                <dl>
                                    <dt className="font-semibold text-gray-900 dark:text-white">Role</dt>
                                    <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FontAwesomeIcon icon={faUser} /> &ensp;
                                        {auth.loggedInUser.role_title}
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className="font-semibold text-gray-900 dark:text-white">Address</dt>
                                    <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FontAwesomeIcon icon={faMapPin} /> &ensp;
                                        {auth.loggedInUser.address}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={modaltoggleDropdown}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-gray-200 text-gray-900 px-5 py-2.5 text-sm font-medium hover:text-white hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />&ensp;
                            Edit your data
                        </button>
                    </div>
                </div>

                <div
                    id="accountInformationModal2"
                    tabIndex={-1}
                    className="fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50 hidden"
                >
                    <div className="relative w-full max-w-lg p-4 bg-white rounded-lg shadow-lg">
                        <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
                                <button
                                    type="button"
                                    onClick={modaltoggleDropdown}
                                    className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form className="max-w-md mx-auto" onSubmit={handleSubmit(submitEvent)}>
                                <div className="font-extrabold mb-5 text-center"></div>

                                <div className="w-full flex justify-center mb-5">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                                            onClick={handleImageClick}
                                        >
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Profile Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : auth.loggedInUser.profile_img ? (
                                                <img
                                                    src={auth.loggedInUser.profile_img}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'path/to/default/avatar.png';
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

                                        <div className="text-center mt-2">
                                            {fileInputRef.current?.files?.[0] ? (
                                                <div className="text-sm">
                                                    {fileInputRef.current.files[0].name}
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

                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        {...register("full_name")}
                                        defaultValue={auth.loggedInUser?.full_name || ''}
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

                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input
                                            type="tel"
                                            {...register("contact_number")}
                                            defaultValue={auth.loggedInUser?.contact_number || ''}
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
                                        <input
                                            type="text"
                                            {...register("address")}
                                            defaultValue={auth.loggedInUser?.address || ''}
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
                                            Save
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default UserProfilePage