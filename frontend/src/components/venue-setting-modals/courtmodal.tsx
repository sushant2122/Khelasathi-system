import React from 'react';
import { X } from 'lucide-react';
import * as yup from 'yup';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Court) => void;
    initialData?: Court;
    mode: 'create' | 'edit' | 'view';
}

interface Court {
    id?: string;
    type: 'indoor' | 'outdoor';
    title: string;

}

// Define validation schema
const courtSchema = yup.object().shape({
    type: yup.string().oneOf(['indoor', 'outdoor'], 'Invalid court type').required('Court type is required'),
    title: yup.string().required('Court name is required').min(3, 'Court name must be at least 3 characters'),

});

export function CourtModal({ isOpen, onClose, onSubmit, initialData, mode }: Props) {
    const [formData, setFormData] = React.useState<Court>({
        type: 'indoor',
        title: '',

        ...initialData,
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await courtSchema.validate(formData, { abortEarly: false });
            onSubmit(formData);
            setErrors({});
        } catch (validationErrors) {
            const newErrors: Record<string, string> = {};
            if (validationErrors instanceof yup.ValidationError) {
                validationErrors.inner.forEach(error => {
                    if (error.path) {
                        newErrors[error.path] = error.message;
                    }
                });
            }
            setErrors(newErrors);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isViewMode = mode === 'view';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {mode === 'create' ? 'Add New Court' : mode === 'edit' ? 'Edit Court' : 'Court Details'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Court Type</label>
                            <select
                                name="type"
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.type ? 'border-red-500' : ''} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                value={formData.type}
                                onChange={handleChange}
                                disabled={isViewMode}
                                required
                            >
                                <option value="indoor">Indoor</option>
                                <option value="outdoor">Outdoor</option>
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Court Name</label>
                            <input
                                type="text"
                                name="title"
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.title ? 'border-red-500' : ''} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Court 1, Main Court, etc."
                                disabled={isViewMode}
                                required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>




                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {isViewMode ? 'Close' : 'Cancel'}
                        </button>
                        {!isViewMode && (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : mode === 'create' ? 'Create Court' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}