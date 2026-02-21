import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingComponents, { LoadingSize } from '../../components/loading/loading.components';
import Swal from 'sweetalert2';
import futsalSvc from '../../services/futsal.service';

export type FutsalImageType = {
    caption: string;
    is_active: boolean;
    image: FileList;
};

export interface FutsalImage {
    image_id: number;
    caption: string;
    is_active: boolean;
    image: string;
}

function FutsalImagePage() {
    const [futsalImages, setFutsalImages] = useState<FutsalImage[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFutsalImage, setSelectedFutsalImage] = useState<FutsalImage | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(futsalImages.length / itemsPerPage);
    const paginatedFutsalImage = futsalImages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreate = () => {
        setIsCreateModalOpen(true);
    };

    const handleUpdate = (futsalimage: FutsalImage) => {
        setSelectedFutsalImage(futsalimage);
        setIsUpdateModalOpen(true);
        reset({
            caption: futsalimage.caption,
            is_active: futsalimage.is_active,
            // image_url is handled separately as it's a FileList
        });
    };

    const handleView = (futsalimage: FutsalImage) => {
        setSelectedFutsalImage(futsalimage);
        setIsViewModalOpen(true);
    };

    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [updateImagePreview, setUpdateImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateFileInputRef = useRef<HTMLInputElement>(null);

    const validationSchema = Yup.object().shape({
        caption: Yup.string().required("Caption is required"),
        is_active: Yup.boolean().required(),
        image_url: Yup.mixed<FileList>()
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FutsalImageType>({
        resolver: yupResolver(validationSchema) as any,
    });

    const listFutsalImages = async () => {
        try {
            setLoading(true);
            const response = await futsalSvc.listFutsalImagesForVenue();
            setFutsalImages(response.data.result);
        } catch (err) {
            console.error(err);
            // toast.error("Failed to fetch images");
        } finally {
            setLoading(false);
        }
    };

    // const ViewBannerDetail = async (id: number) => {
    //     try {
    //         setLoading(true);
    //         const response = await bannerSvc.showBannerDetail(id);
    //         setSelectedBanner(response.data.result);
    //     } catch (err) {
    //         console.error(err);
    //         toast.error("Failed to fetch banner details");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const UpdateFutsalImageDetail = async (data: FutsalImageType) => {
        try {
            setLoading(true);
            if (!selectedFutsalImage) return;



            await futsalSvc.updateFutsalImageDetail(selectedFutsalImage.image_id, data);
            toast.success("Futsal Image updated successfully");
            setIsUpdateModalOpen(false);
            reset();
            setUpdateImagePreview(null);
            await listFutsalImages();
        } catch (error: any) {
            toast.error(error.message || "Failed to update futsal image.");
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteFutsalImage = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    await futsalSvc.deleteFutsalImage(id);
                    toast.success("Futsal Image deleted successfully");
                    await listFutsalImages();
                } catch (error: any) {
                    //toast.error(error.message || "Failed to delete futsal image.");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    useEffect(() => {
        listFutsalImages();
    }, []);

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

    const handleUpdateImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setUpdateImagePreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setUpdateImagePreview(null);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpdateImageClick = () => {
        updateFileInputRef.current?.click();
    };

    const submitHandler: SubmitHandler<FutsalImageType> = async (data) => {
        try {
            setLoading(true);


            await futsalSvc.createFutsalImage(data);
            toast.success("Futsal image added successfully");
            setIsCreateModalOpen(false);
            reset();
            setImagePreview(null);
            await listFutsalImages();
        } catch (error: any) {
            toast.error(error.message || "Failed to create futsal");
        } finally {
            setLoading(false);
        }
    };

    const updateSubmitHandler: SubmitHandler<FutsalImageType> = async (data) => {
        await UpdateFutsalImageDetail(data);
    };

    return (
        <div className='p-4'>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-amber-700">Futsal Image Management</h1>
                <button
                    onClick={handleCreate}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700"
                >
                    <Plus className="h-5 w-5" />
                    Add Image
                </button>
            </div>

            <div className="mt-8">
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Caption</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Image</th>
                                <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && !futsalImages.length ? (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center">
                                        <LoadingComponents size={LoadingSize.MD} />
                                    </td>
                                </tr>
                            ) : paginatedFutsalImage.length > 0 ? (
                                paginatedFutsalImage.map((futsalimage) => (
                                    <tr key={futsalimage.image_id}>
                                        <td className="py-4 pl-4 pr-3 text-sm text-gray-900">{futsalimage.caption}</td>

                                        <td className="px-3 py-4 text-sm">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${futsalimage.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {futsalimage.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-sm">
                                            <img
                                                src={futsalimage.image}
                                                alt={futsalimage.caption}
                                                className="h-10 w-10 rounded object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'path-to-default-image.png';
                                                }}
                                            />
                                        </td>
                                        <td className="px-3 py-4 text-sm text-right space-x-2">
                                            <button
                                                onClick={() => handleView(futsalimage)}
                                                className="text-gray-400 hover:text-gray-500 inline-flex items-center"
                                                title="View"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(futsalimage)}
                                                className="text-amber-400 hover:text-amber-500 inline-flex items-center"
                                                title="Edit"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFutsalImage(futsalimage.image_id)}
                                                className="text-red-400 hover:text-red-500 inline-flex items-center"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-500">
                                        No Images found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {futsalImages.length > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, futsalImages.length)}</span> of{' '}
                                    <span className="font-medium">{futsalImages.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        &lt;
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                                                ? 'z-10 bg-amber-600 text-white border-amber-600'
                                                : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        &gt;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-medium mb-4">Add Futsal Image</h2>
                        <form onSubmit={handleSubmit(submitHandler)}>
                            {/* Banner Image Uploader */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-full h-40 bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden rounded-md"
                                        onClick={handleImageClick}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Banner Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <svg
                                                    className="w-12 h-12 text-gray-400 mx-auto"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    ></path>
                                                </svg>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Click to upload banner image
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        {...register("image")}
                                        ref={(e) => {
                                            register("image").ref(e);
                                            if (e) fileInputRef.current = e;
                                        }}
                                        onChange={handleImageChange}
                                        accept="image/jpeg, image/png, image/gif"
                                        className=""
                                    />

                                    {errors.image && (
                                        <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Title Field */}
                            <div className="mb-4">
                                <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                                    Caption
                                </label>
                                <input
                                    type="text"
                                    id="caption"
                                    {...register("caption")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.caption && (
                                    <p className="mt-1 text-sm text-red-600">{errors.caption.message}</p>
                                )}
                            </div>



                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-700">Active</span>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        {...register("is_active")}
                                        className="sr-only peer"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-amber-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        reset();
                                        setImagePreview(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <LoadingComponents size={LoadingSize.MD} />
                                    ) : (
                                        "Add Image"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {isUpdateModalOpen && selectedFutsalImage && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-medium mb-4">Update Banner</h2>
                        <form onSubmit={handleSubmit(updateSubmitHandler)}>
                            {/* Banner Image Uploader */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Futsal Image</label>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-full h-40 bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden rounded-md"
                                        onClick={handleUpdateImageClick}
                                    >
                                        {updateImagePreview ? (
                                            <img
                                                src={updateImagePreview}
                                                alt="Banner Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={selectedFutsalImage.image}
                                                alt={selectedFutsalImage.caption}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        {...register("image")}
                                        ref={(e) => {
                                            register("image").ref(e);
                                            if (e) updateFileInputRef.current = e;
                                        }}
                                        onChange={handleUpdateImageChange}
                                        accept="image/jpeg, image/png, image/gif"
                                        className=""
                                    />

                                    {errors.image && (
                                        <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Title Field */}
                            <div className="mb-4">
                                <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                                    Caption
                                </label>
                                <input
                                    type="text"
                                    id="caption"
                                    {...register("caption")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.caption && (
                                    <p className="mt-1 text-sm text-red-600">{errors.caption.message}</p>
                                )}
                            </div>



                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-700">Active</span>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        {...register("is_active")}
                                        className="sr-only peer"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-amber-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsUpdateModalOpen(false);
                                        reset();
                                        setUpdateImagePreview(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <LoadingComponents size={LoadingSize.MD} />
                                    ) : (
                                        "Update Image"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && selectedFutsalImage && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-medium mb-4">View Futsal Image</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedFutsalImage.caption}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${selectedFutsalImage.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {selectedFutsalImage.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <img
                                    src={selectedFutsalImage.image}
                                    alt={selectedFutsalImage.caption}
                                    className="mt-1 w-full h-48 object-contain rounded border border-gray-200"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FutsalImagePage;