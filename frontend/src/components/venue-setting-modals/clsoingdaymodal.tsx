import React from 'react';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ClosingDay) => void;
    initialData?: ClosingDay;
    mode: 'create' | 'edit' | 'view';
    courtId: string;
}

interface ClosingDay {
    id?: string;
    court_id: string;
    date: string;
    reason: string;
}

export function ClosingDayModal({ isOpen, onClose, onSubmit, initialData, mode, courtId }: Props) {
    const [formData, setFormData] = React.useState<ClosingDay>({
        court_id: courtId,
        date: '',
        reason: '',
        ...initialData,
    });

    if (!isOpen) return null;

    const isViewMode = mode === 'view';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {mode === 'create' ? 'Add Closing Day' : mode === 'edit' ? 'Edit Closing Day' : 'View Closing Day'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(formData);
                }}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                disabled={isViewMode}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reason</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                disabled={isViewMode}
                            />
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {mode === 'create' ? 'Create' : 'Update'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}