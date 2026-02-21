import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Eye, Trash2, Calendar, Clock } from 'lucide-react';
import { CourtModal } from '../../components/venue-setting-modals/courtmodal';
import { SlotModal } from '../../components/venue-setting-modals/slotmodal';
import { ClosingDayModal } from '../../components/venue-setting-modals/clsoingdaymodal';
import settingSvc from '../../services/setting.service';
import { toast } from 'react-toastify';
import slotSvc from '../../services/slot.service';
import Swal from 'sweetalert2';

interface Court {
    court_id?: string;
    type: 'indoor' | 'outdoor';
    title: string;

}

interface Slot {
    slot_id?: string;
    court_id: string;
    title: string;
    start_time: string;
    end_time: string;
    price: number;
    credit_point: number;
    is_active: string;
}

interface ClosingDay {
    closing_day_id?: string;
    court_id: string;
    date: string;
    reason: string;
}

function VenueSettingPages() {
    const [courts, setCourts] = React.useState<Court[]>([

    ]);

    const [slots, setSlots] = React.useState<Slot[]>([

    ]);

    const [closingDays, setClosingDays] = React.useState<ClosingDay[]>([

    ]);


    const [selectedCourtFilter, setSelectedCourtFilter] = useState<string>('all');
    const [_filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
    const [_filteredClosingDays, setFilteredClosingDays] = useState<ClosingDay[]>([]);

    const fetchCourt = async () => {
        try {
            const courtdetails = await settingSvc.listCourt();
            setCourts(courtdetails.data.result);
        } catch (exception: any) {
            toast.error("Error fetching court details.");
        }
    };
    const fetchSlots = async (courtId: number) => {
        try {
            const slotDetails = await slotSvc.listSlots(courtId);
            setSlots(slotDetails.data.result);
        } catch (exception: any) {
            toast.error("Error fetching slot details.");
        }
    };

    // Add this fetch function for closing days
    const fetchClosingDays = async (courtId: number) => {
        try {
            const closingDayDetails = await settingSvc.listCLosing(courtId);
            setClosingDays(closingDayDetails.data.result);
        } catch (exception: any) {
            toast.error("Error fetching closing day details.");
        }
    };
    useEffect(() => {
        fetchCourt();
    }, [])

    useEffect(() => {
        if (selectedCourtFilter === 'all') {
            setFilteredSlots(slots);
        } else {
            setFilteredSlots(slots.filter(slot => slot.court_id === selectedCourtFilter));
        }
    }, [selectedCourtFilter, slots]);

    useEffect(() => {
        if (selectedCourtFilter === 'all') {
            setFilteredClosingDays(closingDays);
        } else {
            setFilteredClosingDays(closingDays.filter(day => day.court_id === selectedCourtFilter));
        }
    }, [selectedCourtFilter, closingDays]);


    const [courtModal, setCourtModal] = React.useState<{
        isOpen: boolean;
        mode: 'create' | 'edit' | 'view';
        data?: Court;
    }>({ isOpen: false, mode: 'create' });

    const [slotModal, setSlotModal] = React.useState<{
        isOpen: boolean;
        mode: 'create' | 'edit' | 'view';
        data?: Slot;
        courtId: string;
    }>({ isOpen: false, mode: 'create', courtId: '' });

    const [closingDayModal, setClosingDayModal] = React.useState<{
        isOpen: boolean;
        mode: 'create' | 'edit' | 'view';
        data?: ClosingDay;
        courtId: string;
    }>({ isOpen: false, mode: 'create', courtId: '' });

    const handleCourtSubmit = async (data: Court) => {
        if (courtModal.mode === 'create') {
            try {
                const response = await settingSvc.createCourt(data);
                toast.success(response.data.message || "Court created successfully.")
                await fetchCourt();
            } catch (exception: any) {
                toast.error(exception.data.message || "Court creation failed.")
            }

        } else if (courtModal.mode === 'edit' && courtModal.data?.court_id) {
            const courtId = courtModal.data.court_id;
            console.log(courtId)
        }
        setCourtModal({ isOpen: false, mode: 'create' });
    };

    const handleDeleteCourt = async (id: number) => {
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
                    await settingSvc.deleteCourt(id);
                    toast.success("Court deleted successfully");
                    await fetchCourt();
                } catch (error: any) {
                    toast.error("Court can't be deleted.");
                } finally {

                }
            }
        });
    };

    const handleDeleteSlot = async (slot: any) => {
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
                    await settingSvc.deleteSlot(parseInt(slot.slot_id));
                    toast.success("Slot deleted successfully");
                    await fetchSlots(parseInt(slot.court_id));
                } catch (error: any) {
                    toast.error("Slot can't be deleted update it.");
                } finally {

                }
            }
        });
    };
    const handleDeleteClosing = async (day: any) => {
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
                    await settingSvc.deleteClosing(parseInt(day.closing_day_id));
                    toast.success("Closing day removed successfully");
                    await fetchClosingDays(parseInt(day.closing_day_id));
                } catch (error: any) {
                    toast.error(error.data.message || "Failed to remove closing day.");
                } finally {

                }
            }
        });
    };


    const handleSlotSubmit = async (data: Slot) => {
        if (slotModal.mode === 'create') {
            // Include court_id from the modal state in the new slot
            try {
                const newSlot = { ...data, court_id: slotModal.courtId };
                console.log("slot create", newSlot);
                const response = await settingSvc.createSlot(newSlot);
                toast.success(response.data.message || "Slot created successfully.")
                await fetchSlots(parseInt(slotModal.courtId));
            } catch (exception: any) {
                toast.error(exception.data.message || "Slot creation failed.")
            }
        } else if (slotModal.mode === 'edit' && slotModal.data?.slot_id) {
            try {
                // For edit mode, we need to include the slot_id in the data
                const updatedSlot = {
                    ...data,
                    slot_id: slotModal.data.slot_id,
                    court_id: slotModal.courtId,
                    // Use the new time values if provided, otherwise keep the original ones
                    start_time: data.start_time,
                    end_time: data.end_time
                };
                console.log("slot update", updatedSlot);


                const response = await slotSvc.updateSlotDetail(parseInt(updatedSlot.slot_id), updatedSlot);
                toast.success(response.data.message || "Slot updated successfully.");
                await fetchSlots(parseInt(data.court_id));
            } catch (exception: any) {
                toast.error(exception.data.message || "Slot update failed.");
            }
        }
        setSlotModal({ isOpen: false, mode: 'create', courtId: '' });
    };

    const handleClosingDaySubmit = async (data: ClosingDay) => {
        if (closingDayModal.mode === 'create') {
            // Include court_id from the modal state in the new closing day

            try {
                const newClosingDay = { ...data, court_id: closingDayModal.courtId };

                const response = await settingSvc.createClosing(newClosingDay);
                toast.success(response.data.message || "Closing day  successfully scheduled.")
                await fetchClosingDays(parseInt(closingDayModal.courtId));
            } catch (exception: any) {
                toast.error(exception.data.message || "Closing day scheduling failed.")
            }
        } else if (closingDayModal.mode === 'edit' && closingDayModal.data?.closing_day_id) {
            const closingDayId = closingDayModal.data.closing_day_id;
            console.log(closingDayId)
        }
        setClosingDayModal({ isOpen: false, mode: 'create', courtId: '' });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">

                {/* COURTS */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Courts</h1>
                        <button
                            onClick={() => setCourtModal({ isOpen: true, mode: 'create' })}
                            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Court
                        </button>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>

                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {courts.map((court) => (
                                    <tr key={court.court_id}>
                                        <td className="px-6 py-4">{court.title}</td>
                                        <td className="px-6 py-4 capitalize">{court.type}</td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setSlotModal({ isOpen: true, mode: 'create', courtId: court.court_id! })}
                                                    className="text-amber-600 hover:text-amber-900"
                                                    title="Add Slot"
                                                >
                                                    <Clock size={20} />
                                                </button>
                                                <button
                                                    onClick={() => setClosingDayModal({ isOpen: true, mode: 'create', courtId: court.court_id! })}
                                                    className="text-amber-600 hover:text-amber-900"
                                                    title="Add Closing Day"
                                                >
                                                    <Calendar size={20} />
                                                </button>


                                                <button
                                                    onClick={() => {
                                                        if (court.court_id) {
                                                            handleDeleteCourt(parseInt(court.court_id));
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 size={20} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/**Filter */}
                <div className="mb-4 flex items-center">
                    <label htmlFor="court-filter" className="mr-2 text-sm font-medium text-gray-700">
                        Filter by Court:
                    </label>
                    <select
                        id="court-filter"
                        value={selectedCourtFilter}
                        onChange={(e: any) => {
                            setSelectedCourtFilter(e.target.value);
                            // Fetch filtered data when court is selected
                            if (e.target.value === '') {

                            } else {
                                fetchSlots(e.target.value);
                                fetchClosingDays(e.target.value);
                            }
                        }}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10 text-base"
                    >
                        <option value="">Choose Court</option>
                        {courts.map(court => (
                            <option key={court.court_id} value={court.court_id}>
                                {court.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* SLOTS */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Slots</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {slots.map((slot) => (
                                    <tr key={slot.slot_id}>
                                        <td className="px-6 py-4">{slot.title}</td>
                                        <td className="px-6 py-4">{slot.start_time} - {slot.end_time}</td>
                                        <td className="px-6 py-4">${slot.price}</td>
                                        <td className="px-6 py-4">{slot.credit_point}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${slot.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {slot.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setSlotModal({ isOpen: true, mode: 'view', data: slot, courtId: slot.court_id })}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                                <button
                                                    onClick={() => setSlotModal({ isOpen: true, mode: 'edit', data: slot, courtId: slot.court_id })}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                >
                                                    <Edit2 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (slot) {
                                                            handleDeleteSlot(slot);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >

                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CLOSING DAYS */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Closing Days</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {closingDays.map((day) => (
                                    <tr key={day.closing_day_id}>
                                        <td className="px-6 py-4">{day.date}</td>
                                        <td className="px-6 py-4">{day.reason}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">

                                                <button

                                                    onClick={() => {
                                                        if (day) {
                                                            handleDeleteClosing(day);
                                                        }
                                                    }}

                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODALS */}
                <CourtModal
                    isOpen={courtModal.isOpen}
                    onClose={() => setCourtModal({ isOpen: false, mode: 'create' })}
                    onSubmit={handleCourtSubmit}
                    initialData={courtModal.data}
                    mode={courtModal.mode}
                />

                <SlotModal
                    isOpen={slotModal.isOpen}
                    onClose={() => setSlotModal({ isOpen: false, mode: 'create', courtId: '' })}
                    onSubmit={handleSlotSubmit}
                    initialData={slotModal.data}
                    mode={slotModal.mode}
                    courtId={slotModal.courtId}
                />

                <ClosingDayModal
                    isOpen={closingDayModal.isOpen}
                    onClose={() => setClosingDayModal({ isOpen: false, mode: 'create', courtId: '' })}
                    onSubmit={handleClosingDaySubmit}
                    initialData={closingDayModal.data}
                    mode={closingDayModal.mode}
                    courtId={closingDayModal.courtId}
                />
            </div>
        </div>
    );
}

export default VenueSettingPages;