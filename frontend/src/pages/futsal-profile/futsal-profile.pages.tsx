import React, { useEffect, useState } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { Fragment } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import futsalSvc from '../../services/futsal.service';
import { toast } from 'react-toastify';
import LoadingComponents, { LoadingSize } from '../../components/loading/loading.components';

interface FutsalData {
    futsal_id: number;
    name: string;
    description: string;
    slug: string;
    location: string;
    maplink: string;
    is_active: boolean;
    contact_number: string;
    owner_id: number;
    citizenship_front_url: string;
    image_url: string;
    citizenship_back_url: string;
    pan_number: string;
    verification_status: string;
    verification_date: string;
    createdAt: string;
    updatedAt: string;
    User: {
        user_id: number;
        full_name: string;
        email: string;
        role_title: string;
    };
}

// Yup validation schema
const validationSchema = yup.object().shape({
    name: yup.string().required('Futsal name is required'),
    description: yup.string().required('Description is required'),
    location: yup.string().required('Location is required'),
    contact_number: yup
        .string()
        .matches(/^[0-9]{9,10}$/, 'Contact number must be 9 or 10 digits')
        .required('Contact number is required'),
    pan_number: yup
        .string()
        .matches(/^[0-9]{1,50}$/, 'PAN number must be up to 50 digits')
        .required('PAN number is required'),
    is_active: yup.boolean().required('Active status is required'),
    image_url: yup.mixed().nullable(),
    citizenship_front_url: yup.mixed().nullable(),
    citizenship_back_url: yup.mixed().nullable(),
    maplink: yup.string()
});

const FutsalDetailPage = () => {
    const [futsalData, setFutsalData] = useState<FutsalData | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewCitizenshipFront, setPreviewCitizenshipFront] = useState('');
    const [previewCitizenshipBack, setPreviewCitizenshipBack] = useState('');
    const [isLoading, setisLoading] = useState<boolean>(false);
    const ViewFutsalDetail = async () => {
        try {

            const response = await futsalSvc.FutsalProfileDetail();
            setFutsalData(response.data.result);
            // Set initial preview images
            setPreviewImage(response.data.result.image_url);
            setPreviewCitizenshipFront(response.data.result.citizenship_front_url);
            setPreviewCitizenshipBack(response.data.result.citizenship_back_url);
        } catch (exception) {

            console.error("Error fetching futsal details:", exception);

        }
    };

    useEffect(() => {
        ViewFutsalDetail();
    }, []);

    // Formik form handling
    const formik = useFormik({
        initialValues: {
            name: futsalData?.name || '',
            description: futsalData?.description || '',
            location: futsalData?.location || '',
            contact_number: futsalData?.contact_number || '',
            pan_number: futsalData?.pan_number || '',
            maplink: futsalData?.maplink || '',
            is_active: futsalData?.is_active || false,
            image_url: null as File | null,
            citizenship_front_url: null as File | null,
            citizenship_back_url: null as File | null,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values: any) => {
            console.log('Form submitted with values:', values);
            try {
                setisLoading(true);
                await futsalSvc.updateFutsalDetail(values);
                toast.success("Futsal profile updated successfully.");
                ViewFutsalDetail();
            } catch (e: any) {
                setisLoading(true);
                toast.error(e.data.message || "Failed to update Profile.");
            } finally {
                setisLoading(false);
            }
            setIsOpen(false);
        },
    });
    // Handle image upload and preview
    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'futsal' | 'citizenshipFront' | 'citizenshipBack'
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    switch (type) {
                        case 'futsal':
                            setPreviewImage(reader.result);
                            formik.setFieldValue('image_url', file);
                            break;
                        case 'citizenshipFront':
                            setPreviewCitizenshipFront(reader.result);
                            formik.setFieldValue('citizenship_front_url', file);
                            break;
                        case 'citizenshipBack':
                            setPreviewCitizenshipBack(reader.result);
                            formik.setFieldValue('citizenship_back_url', file);
                            break;
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    if (!futsalData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Futsal Details Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    {/* Futsal Image */}
                    <div className="md:w-1/2">
                        <img
                            src={futsalData.image_url}
                            alt={futsalData.name}
                            className="w-full h-56 md:h-64 object-cover"
                        />
                        {/* Map Embed */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">Location</h3>
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    src={futsalData.maplink}
                                    width="100%"
                                    height="250"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Futsal Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Futsal Info */}
                    <div className="md:w-1/2 p-6">
                        <span
                            className={`inline-flex w-full mb-4 justify-center py-4 items-center rounded-full px-2.5 text-xs font-semibold ${futsalData.is_active ? 'bg-green-100 text-green-800 ' : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {futsalData.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{futsalData.name}</h1>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Update Profile
                            </button>
                        </div>

                        <p className="text-gray-600 mb-4">{futsalData.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold">Contact Information</h3>
                                <p className="text-gray-700">
                                    <span className="font-medium">Phone:</span> {futsalData.contact_number}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Location:</span> {futsalData.location}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Owner Details</h3>
                                <p className="text-gray-700">
                                    <span className="font-medium">Name:</span> {futsalData.User.full_name}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Email:</span> {futsalData.User.email}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">PAN:</span> {futsalData.pan_number}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Verification Status</h3>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${futsalData.verification_status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {futsalData.verification_status.charAt(0).toUpperCase() +
                                    futsalData.verification_status.slice(1)}
                            </span>
                            {futsalData.verification_status === 'approved' && (
                                <p className="text-gray-600 mt-1">
                                    Verified on: {new Date(futsalData.verification_date).toLocaleDateString()}
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Citizenship Documents</h3>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <p className="text-gray-700 mb-1">Front Side</p>
                                    <img
                                        src={futsalData.citizenship_front_url}
                                        alt="Citizenship Front"
                                        className="w-full h-24 object-contain border rounded"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <p className="text-gray-700 mb-1">Back Side</p>
                                    <img
                                        src={futsalData.citizenship_back_url}
                                        alt="Citizenship Back"
                                        className="w-full h-24 object-contain border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Profile Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Update Futsal Profile
                                    </Dialog.Title>

                                    <form onSubmit={formik.handleSubmit} className="mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Left Column */}
                                            <div>
                                                {/* Futsal Name */}
                                                <div className="mb-4">
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                        Futsal Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={formik.values.name}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                    />
                                                    {formik.touched.name && formik.errors.name && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.name === 'string' ? formik.errors.name : ''}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                <div className="mb-4">
                                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows={3}
                                                        value={formik.values.description}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                    />
                                                    {formik.touched.description && formik.errors.description && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.description === 'string' ? formik.errors.description : ''}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Active Status Toggle */}
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between">
                                                        <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">
                                                            Active Status
                                                        </label>
                                                        <Switch
                                                            checked={formik.values.is_active}
                                                            onChange={(value) => formik.setFieldValue('is_active', value)}
                                                            className={`${formik.values.is_active ? 'bg-green-600' : 'bg-gray-300'
                                                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                        >
                                                            <span className="sr-only">Active Status</span>
                                                            <span
                                                                className={`${formik.values.is_active ? 'translate-x-6' : 'translate-x-1'
                                                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                                            />
                                                        </Switch>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {formik.values.is_active ? 'Futsal is active and visible to users' : 'Futsal is inactive and hidden from users'}
                                                    </p>
                                                </div>

                                                {/* Location */}
                                                <div className="mb-4">
                                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                                        Location
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="location"
                                                        name="location"
                                                        value={formik.values.location}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                    />
                                                    {formik.touched.location && formik.errors.location && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.location === 'string' ? formik.errors.location : ''}
                                                        </p>
                                                    )}
                                                </div>
                                                {/* maplink */}
                                                <div className="mb-4">
                                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                                        MapLink
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="maplink"
                                                        name="maplink"
                                                        value={formik.values.maplink}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                    />
                                                    {formik.touched.maplink && formik.errors.maplink && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.maplink === 'string' ? formik.errors.maplink : ''}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Contact Number */}
                                                <div className="mb-4">
                                                    <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
                                                        Contact Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="contact_number"
                                                        name="contact_number"
                                                        value={formik.values.contact_number}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                    />
                                                    {formik.touched.contact_number && formik.errors.contact_number && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.contact_number === 'string' ? formik.errors.contact_number : ''}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* PAN Number */}
                                                <div className="mb-4">
                                                    <label htmlFor="pan_number" className="block text-sm font-medium text-gray-700">
                                                        PAN Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="pan_number"
                                                        name="pan_number"
                                                        value={formik.values.pan_number}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                    />
                                                    {formik.touched.pan_number && formik.errors.pan_number && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.pan_number === 'string' ? formik.errors.pan_number : ''}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div>
                                                {/* Futsal Image Upload */}
                                                <div className="mb-4">
                                                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                                                        Futsal Image
                                                    </label>
                                                    <div className="mt-1 flex items-center">
                                                        <img
                                                            src={previewImage || futsalData.image_url}
                                                            alt="Futsal Preview"
                                                            className="w-24 h-24 object-cover rounded-md mr-4"
                                                        />
                                                        <input
                                                            type="file"
                                                            id="image_url"
                                                            name="image_url"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(e, 'futsal')}
                                                        />
                                                    </div>
                                                    {formik.touched.image_url && formik.errors.image_url && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.image_url === 'string' ? formik.errors.image_url : ''}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Citizenship Front Upload */}
                                                {/* Citizenship Front Upload */}
                                                <div className="mb-4">
                                                    <label htmlFor="citizenship_front_url" className="block text-sm font-medium text-gray-700">
                                                        Citizenship Front
                                                    </label>
                                                    <div className="mt-1 flex items-center">
                                                        <img
                                                            src={previewCitizenshipFront || futsalData.citizenship_front_url}
                                                            alt="Citizenship Front Preview"
                                                            className="w-24 h-24 object-contain rounded-md mr-4 border"
                                                        />
                                                        <input
                                                            type="file"
                                                            id="citizenship_front_url"
                                                            name="citizenship_front_url"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(e, 'citizenshipFront')}
                                                        />
                                                    </div>
                                                    {formik.touched.citizenship_front_url && formik.errors.citizenship_front_url && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.citizenship_front_url === 'string' ? formik.errors.citizenship_front_url : ''}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Citizenship Back Upload */}
                                                <div className="mb-4">
                                                    <label htmlFor="citizenship_back_url" className="block text-sm font-medium text-gray-700">
                                                        Citizenship Back
                                                    </label>
                                                    <div className="mt-1 flex items-center">
                                                        <img
                                                            src={previewCitizenshipBack || futsalData.citizenship_back_url}
                                                            alt="Citizenship Back Preview"
                                                            className="w-24 h-24 object-contain rounded-md mr-4 border"
                                                        />
                                                        <input
                                                            type="file"
                                                            id="citizenship_back_url"
                                                            name="citizenship_back_url"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(e, 'citizenshipBack')}
                                                        />
                                                    </div>
                                                    {formik.touched.citizenship_back_url && formik.errors.citizenship_back_url && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {typeof formik.errors.citizenship_back_url === 'string' ? formik.errors.citizenship_back_url : ''}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Cancel
                                            </button>
                                            {isLoading ? <>


                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >

                                                    <LoadingComponents size={LoadingSize.MD} />
                                                </button>
                                            </> : <>    <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >

                                                Save Changes
                                            </button> </>}




                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div >
    );
};

export default FutsalDetailPage;