import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingComponents, { LoadingSize } from '../../components/loading/loading.components';
import bannerSvc from '../../services/banner.service';
import Swal from 'sweetalert2';

export type BannerType = {
    title: string;
    link: string;
    is_active: boolean;
    image_url: FileList;
};

export interface Banner {
    banner_id: number;
    title: string;
    link: string;
    is_active: boolean;
    image_url: string;
}

function AdminBannerPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(banners.length / itemsPerPage);
    const paginatedBanners = banners.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreate = () => {
        setIsCreateModalOpen(true);
    };

    const handleUpdate = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsUpdateModalOpen(true);
        reset({
            title: banner.title,
            link: banner.link,
            is_active: banner.is_active,
            // image_url is handled separately as it's a FileList
        });
    };

    const handleView = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsViewModalOpen(true);
    };

    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [updateImagePreview, setUpdateImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateFileInputRef = useRef<HTMLInputElement>(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        link: Yup.string().required("Link is required"),
        is_active: Yup.boolean().required(),
        image_url: Yup.mixed<FileList>()

    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<BannerType>({
        resolver: yupResolver(validationSchema) as any,
    });

    const listBanner = async () => {
        try {
            setLoading(true);
            const response = await bannerSvc.listBanner();
            setBanners(response.data.result);
        } catch (err) {
            // console.error(err);
            // toast.error("Failed to fetch banners");
        } finally {
            setLoading(false);
        }
    };

    const UpdateBannerDetail = async (data: BannerType) => {
        try {
            setLoading(true);
            if (!selectedBanner) return;
            console.log("selected id", selectedBanner)


            await bannerSvc.updateBannerDetail(selectedBanner.banner_id, data);
            toast.success("Banner updated successfully");
            setIsUpdateModalOpen(false);
            reset();
            setUpdateImagePreview(null);
            await listBanner();
        } catch (error: any) {
            toast.error(error.message || "Failed to update banner");
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteBanner = async (id: number) => {
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
                    await bannerSvc.deleteBanner(id);
                    toast.success("Banner deleted successfully");
                    await listBanner();
                } catch (error: any) {
                    toast.error(error.message || "Failed to delete banner");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    useEffect(() => {
        listBanner();
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

    const submitHandler: SubmitHandler<BannerType> = async (data) => {
        try {
            setLoading(true);


            await bannerSvc.createBanner(data);
            toast.success("Banner created successfully");
            setIsCreateModalOpen(false);
            reset();
            setImagePreview(null);
            await listBanner();
        } catch (error: any) {
            toast.error("Image file exceeded.,Failed to create banner");
        } finally {
            setLoading(false);
        }
    };

    const updateSubmitHandler: SubmitHandler<BannerType> = async (data) => {
        await UpdateBannerDetail(data);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Banner Management</h1>
                <button
                    onClick={handleCreate}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700"
                >
                    <Plus className="h-5 w-5" />
                    Create Banner
                </button>
            </div>

            <div className="mt-8">
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Title</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Link</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Image</th>
                                <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && !banners.length ? (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center">
                                        <LoadingComponents size={LoadingSize.MD} />
                                    </td>
                                </tr>
                            ) : paginatedBanners.length > 0 ? (
                                paginatedBanners.map((banner) => (
                                    <tr key={banner.banner_id}>
                                        <td className="py-4 pl-4 pr-3 text-sm text-gray-900">{banner.title}</td>
                                        <td className="px-3 py-4 text-sm text-gray-500">
                                            <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                                                {banner.link}
                                            </a>
                                        </td>
                                        <td className="px-3 py-4 text-sm">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {banner.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-sm">
                                            <img
                                                src={banner.image_url}
                                                alt={banner.title}
                                                className="h-10 w-10 rounded object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'path-to-default-image.png';
                                                }}
                                            />
                                        </td>
                                        <td className="px-3 py-4 text-sm text-right space-x-2">
                                            <button
                                                onClick={() => handleView(banner)}
                                                className="text-gray-400 hover:text-gray-500 inline-flex items-center"
                                                title="View"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(banner)}
                                                className="text-amber-400 hover:text-amber-500 inline-flex items-center"
                                                title="Edit"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBanner(banner.banner_id)}
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
                                        No banners found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {banners.length > 0 && (
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
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, banners.length)}</span> of{' '}
                                    <span className="font-medium">{banners.length}</span> results
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
                        <h2 className="text-lg font-medium mb-4">Create Banner</h2>
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
                                        {...register("image_url")}
                                        ref={(e) => {
                                            register("image_url").ref(e);
                                            if (e) fileInputRef.current = e;
                                        }}
                                        onChange={handleImageChange}
                                        accept="image/jpeg, image/png, image/gif"
                                        className=""
                                    />

                                    {errors.image_url && (
                                        <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Title Field */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    {...register("title")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Link Field */}
                            <div className="mb-4">
                                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                                    Link URL
                                </label>
                                <input
                                    type="url"
                                    id="link"
                                    {...register("link")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="https://example.com"
                                />
                                {errors.link && (
                                    <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
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
                                        "Create Banner"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {isUpdateModalOpen && selectedBanner && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-medium mb-4">Update Banner</h2>
                        <form onSubmit={handleSubmit(updateSubmitHandler)}>
                            {/* Banner Image Uploader */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
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
                                                src={selectedBanner.image_url}
                                                alt={selectedBanner.title}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        {...register("image_url")}
                                        ref={(e) => {
                                            register("image_url").ref(e);
                                            if (e) updateFileInputRef.current = e;
                                        }}
                                        onChange={handleUpdateImageChange}
                                        accept="image/jpeg, image/png, image/gif"
                                        className=""
                                    />

                                    {errors.image_url && (
                                        <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Title Field */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    {...register("title")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Link Field */}
                            <div className="mb-4">
                                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                                    Link URL
                                </label>
                                <input
                                    type="url"
                                    id="link"
                                    {...register("link")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="https://example.com"
                                />
                                {errors.link && (
                                    <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
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
                                        "Update Banner"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && selectedBanner && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-medium mb-4">View Banner</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedBanner.title}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Link</label>
                                <a
                                    href={selectedBanner.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 text-sm text-amber-600 hover:underline"
                                >
                                    {selectedBanner.link}
                                </a>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${selectedBanner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {selectedBanner.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <img
                                    src={selectedBanner.image_url}
                                    alt={selectedBanner.title}
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

export default AdminBannerPage;