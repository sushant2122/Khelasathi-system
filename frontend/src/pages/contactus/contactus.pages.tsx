import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import img from "../../assets/images/conimg.jpg"
import { faEnvelope, faMapPin, faPhone } from "@fortawesome/free-solid-svg-icons"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import contactSvc from "../../services/contact.service";
export type ContactType = {
    email: string,
    message: string,
    subject: string
}
function ContactusPage() {
    const messageDTO = Yup.object({
        email: Yup.string().email().required(),
        message: Yup.string().required(),
        subject: Yup.string().required()
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(messageDTO)
    })
    const submitEvent = async (credentials: ContactType) => {
        try {
            //api call
            await contactSvc.sendMail(credentials);
            toast.success("You will be contacted soon.")
            // toast.success(response.data.message)

        } catch (exception: any) {
            toast.error(exception.data.message);

        }


    }
    return (
        <>
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-medium text-amber-700 mb-4">Contact Us</h1>
                </div>
                <div className='text-center mb-12'>
                    <p className="text-lg text-gray-600">
                        Get in touch with us for any questions or support.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side - Image */}
                    <div className="flex justify-center items-center">
                        <img
                            src={img} // Replace with your desired image URL
                            alt="Contact Us"
                            className="w-full h-full md:h-[750px] object-cover rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Right Side - Form and Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-medium text-gray-900 mb-6">Send us a message</h2>
                            <form className="space-y-4" onSubmit={handleSubmit(submitEvent)}>
                                <div>
                                    <label className="block text-sm font-medium text-amber-600">Email</label>
                                    <input
                                        type="text"
                                        {...register("email")}
                                        name="email"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="text-red-700">
                                        {
                                            errors?.email?.message
                                        }
                                    </span>
                                </div>

                                <div>
                                    <label className="block font-medium text-sm  text-amber-600">Subject</label>
                                    <input
                                        type="subject"
                                        {...register("subject")}
                                        name="subject"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="text-red-700">
                                        {
                                            errors?.subject?.message
                                        }
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-amber-600">Message</label>
                                    <textarea
                                        rows={4}
                                        {...register("message")}
                                        name="message"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="text-red-700">
                                        {
                                            errors?.message?.message
                                        }
                                    </span>
                                </div>
                                <button type="submit" className="w-full text-white bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800">Send Message</button>

                            </form>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-medium text-gray-900 mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    {/* <MapPin className="w-5 h-5 text-amber-600 mt-1 mr-3" /> */}
                                    <FontAwesomeIcon icon={faMapPin} />&ensp;
                                    <div>
                                        <h3 className="font-medium text-gray-900">Address</h3>
                                        <p className="text-gray-600">123 Futsal Street, Bhaktapur City, 1123</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    {/* <Phone className="w-5 h-5 text-amber-600 mt-1 mr-3" /> */}
                                    <FontAwesomeIcon icon={faPhone} />&ensp;
                                    <div>
                                        <h3 className="font-medium text-gray-900">Phone</h3>
                                        <p className="text-gray-600">+977 9861200112 </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    {/* <Mail className="w-5 h-5 text-amber-600 mt-1 mr-3" /> */}
                                    <FontAwesomeIcon icon={faEnvelope} />&ensp;
                                    <div>
                                        <h3 className="font-medium text-gray-900">Email</h3>
                                        <p className="text-gray-600">contact@khelasathi.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ContactusPage
