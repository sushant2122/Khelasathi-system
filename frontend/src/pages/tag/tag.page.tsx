import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import LoadingComponents, { LoadingSize } from '../../components/loading/loading.components';
import tagSvc from '../../services/tag.service';
import Swal from 'sweetalert2';

export type TagType = {
    tagname: string;
    is_available: boolean;
};

export interface Tag {
    tag_id: number,
    tagname: string;
    is_available: boolean;
}

function TagPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [loading, setLoading] = useState(false);

    const tagSchema = Yup.object({
        tagname: Yup.string().min(3).max(50).required("Tag name is required"),
        is_available: Yup.boolean().default(true),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TagType>({
        resolver: yupResolver(tagSchema),
    });

    const listTags = async () => {
        try {
            setLoading(true);
            const response = await tagSvc.listTags();
            setTags(response.data.result || []);
        } catch (err) {
            //   toast.error("Failed to fetch tags");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setIsCreateModalOpen(true);
        reset({
            tagname: '',
            is_available: true,
        });
    };

    const handleUpdate = (tag: Tag) => {
        setSelectedTag(tag);
        setIsUpdateModalOpen(true);
        reset({
            tagname: tag.tagname,
            is_available: tag.is_available,
        });
    };



    const handleDeleteTag = async (tag_id: number) => {
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
                    await tagSvc.deleteTag(tag_id);
                    toast.success("Tag deleted successfully");
                    await listTags();
                } catch (error: any) {
                    toast.error(error.message || "Failed to delete tag");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    useEffect(() => {
        listTags();
    }, []);

    const submitHandler = async (data: TagType) => {
        try {
            setLoading(true);
            await tagSvc.createTag(data);
            toast.success("Tag created successfully");
            setIsCreateModalOpen(false);
            reset();
            await listTags();
        } catch (error: any) {
            toast.error(error.message || "Failed to create tag");
        } finally {
            setLoading(false);
        }
    };

    const updateSubmitHandler = async (data: TagType) => {
        try {
            setLoading(true);
            if (!selectedTag) return;

            await tagSvc.updateTagDetail(selectedTag.tag_id, data);
            toast.success("Tag updated successfully");
            setIsUpdateModalOpen(false);
            reset();
            await listTags();
        } catch (error: any) {
            toast.error(error.message || "Failed to update tag");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-4'>
            <div className="flex justify-between items-center">
                <h1 className=" ml-4 text-2xl font-semibold text-amber-700">Tag Management</h1>
                <button
                    onClick={handleCreate}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700"
                >
                    <Plus className="h-5 w-5" />
                    Create Tag
                </button>
            </div>

            <div className="mt-8">
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Tag Name</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && !tags.length ? (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center">
                                        <LoadingComponents size={LoadingSize.MD} />
                                    </td>
                                </tr>
                            ) : tags.length > 0 ? (
                                tags.map((tag) => (
                                    <tr key={tag.tagname}>
                                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{tag.tagname}</td>

                                        <td className="px-3 py-4 text-sm">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tag.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {tag.is_available ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-sm text-right space-x-2">

                                            <button
                                                onClick={() => handleUpdate(tag)}
                                                className="text-amber-400 hover:text-amber-500 inline-flex items-center"
                                                title="Edit"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTag(tag.tag_id)}
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
                                    <td colSpan={4} className="py-4 text-center text-gray-500">
                                        No tags found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-medium mb-4">Create Tag</h2>
                        <form onSubmit={handleSubmit(submitHandler)}>
                            {/* Tag Name Field */}
                            <div className="mb-4">
                                <label htmlFor="tagname" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tag Name
                                </label>
                                <input
                                    type="text"
                                    id="tagname"
                                    {...register("tagname")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.tagname && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tagname.message}</p>
                                )}
                            </div>



                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-700">Available</span>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        {...register("is_available")}
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
                                        "Create Tag"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {isUpdateModalOpen && selectedTag && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-lg font-medium mb-4">Update Tag</h2>
                        <form onSubmit={handleSubmit(updateSubmitHandler)}>
                            {/* Tag Name Field */}
                            <div className="mb-4">
                                <label htmlFor="tagname" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tag Name
                                </label>
                                <input
                                    type="text"
                                    id="tagname"
                                    {...register("tagname")}

                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {errors.tagname && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tagname.message}</p>
                                )}
                            </div>



                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-700">Available</span>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        {...register("is_available")}
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
                                        "Update Tag"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
export default TagPage;