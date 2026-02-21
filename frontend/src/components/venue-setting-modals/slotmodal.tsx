import React from 'react';
import { X } from 'lucide-react';
import * as yup from 'yup';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Slot) => void;
    initialData?: Slot;
    mode: 'create' | 'edit' | 'view';
    courtId: string;
}

interface Slot {
    id?: string;
    court_id: string;
    title: string;
    start_time: string;
    end_time: string;
    price: number;
    credit_point: number;
    is_active: string;
}

// Generate time options in 24-hour format (whole hours)
const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        options.push(`${hour}:00`);
    }
    return options;
};

const timeOptions = generateTimeOptions();

export function SlotModal({ isOpen, onClose, onSubmit, initialData, mode, courtId }: Props) {
    // Create validation schema based on mode
    const validationSchema = React.useMemo(() => {
        const baseSchema = {
            title: yup.string().required('Title is required'),
            price: yup.number()
                .required('Price is required')
                .min(100, 'Price must be more than 100.'),
            credit_point: yup.number()
                .required('Credit points are required')
                .min(10, 'Credit redeem point must be more than 10.'),
            is_active: yup.string().required(),
            court_id: yup.string().required()
        };

        return yup.object().shape({
            ...baseSchema,
            ...(mode === 'create' ? {
                start_time: yup.string()
                    .required('Start time is required')
                    .test('is-valid-time', 'Invalid time format', value =>
                        /^([01]?[0-9]|2[0-3]):00$/.test(value)
                    ),
                end_time: yup.string()
                    .required('End time is required')
                    .test('is-valid-time', 'Invalid time format', value =>
                        /^([01]?[0-9]|2[0-3]):00$/.test(value)
                    )
                    .test('is-after-start', 'End time must be after start time', function (value) {
                        const { start_time } = this.parent;
                        if (!start_time || !value) return true;
                        return value > start_time;
                    })
            } : {})
        });
    }, [mode]);

    const [formData, setFormData] = React.useState<Slot>({
        court_id: courtId,
        title: '',
        start_time: '',
        end_time: '',
        price: 0,
        credit_point: 0,
        is_active: "true",
        ...initialData,
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                court_id: courtId
            });
        } else {
            setFormData({
                court_id: courtId,
                title: '',
                start_time: '',
                end_time: '',
                price: 0,
                credit_point: 0,
                is_active: "true"
            });
        }
    }, [initialData, courtId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'credit_point' ? Number(value) : value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleTimeChange = (name: 'start_time' | 'end_time', value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const toggleActive = () => {
        if (mode !== 'view') {
            setFormData(prev => ({
                ...prev,
                is_active: prev.is_active === "true" ? "false" : "true"
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await validationSchema.validate(formData, { abortEarly: false });

            // For edit mode, keep the original time values
            const submitData = mode === 'edit' ? {
                ...formData,
                start_time: initialData?.start_time || '',
                end_time: initialData?.end_time || ''
            } : formData;

            onSubmit(submitData);
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
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {isCreateMode ? 'Add New Slot' : isEditMode ? 'Edit Slot' : 'View Slot'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title*</label>
                            <input
                                type="text"
                                name="title"
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.title ? 'border-red-500' : ''} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                value={formData.title}
                                onChange={handleChange}
                                disabled={isViewMode}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Only show time fields in create mode */}
                        {isCreateMode && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Start Time*
                                    </label>
                                    <select
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.start_time ? 'border-red-500' : ''} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        value={formData.start_time}
                                        onChange={(e) => handleTimeChange('start_time', e.target.value)}
                                        disabled={isViewMode}
                                    >
                                        <option value="">Select start time</option>
                                        {timeOptions.map(time => (
                                            <option key={`start-${time}`} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        End Time*
                                    </label>
                                    <select
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.end_time ? 'border-red-500' : ''} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        value={formData.end_time}
                                        onChange={(e) => handleTimeChange('end_time', e.target.value)}
                                        disabled={isViewMode}
                                    >
                                        <option value="">Select end time</option>
                                        {timeOptions.map(time => (
                                            <option key={`end-${time}`} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price*</label>
                            <input
                                type="number"
                                name="price"
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.price ? 'border-red-500' : ''} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                disabled={isViewMode}
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Credit Points*</label>
                            <input
                                type="number"
                                name="credit_point"
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.credit_point ? 'border-red-500' : ''} ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                value={formData.credit_point}
                                onChange={handleChange}
                                min="0"
                                disabled={isViewMode}
                            />
                            {errors.credit_point && <p className="mt-1 text-sm text-red-600">{errors.credit_point}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <button
                                type="button"
                                onClick={toggleActive}
                                disabled={isViewMode}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.is_active === "true" ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active === "true" ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>

                    {!isViewMode && (
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : isCreateMode ? 'Create' : 'Update'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}