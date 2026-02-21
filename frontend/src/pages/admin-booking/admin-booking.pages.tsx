import React, { useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import futsalSvc from '../../services/futsal.service';
import bookingSvc from '../../services/booking.service';

// Types
interface Booking {
    booking_id: number;
    booking_date: string;
    status: string;
    total_amount: string;
    customer_name: string;
    customer_email: string;
    booked_slots: BookedSlot[];
}

interface BookedSlot {
    slot_id: number;
    title: string;
    start_time: string;
    end_time: string;
    price: number;
    court_title: string;
}

interface Futsal {
    futsal_id: number;
    name: string;
}

interface Pagination {
    current_page: number;
    per_page: number;
    total_items: string;
    total_pages: number;
}

const AdminBookingPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [futsals, setFutsals] = useState<Futsal[]>([]);
    const [selectedFutsal, setSelectedFutsal] = useState<number | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        current_page: 1,
        per_page: 10,
        total_items: "0",
        total_pages: 1
    });
    const [viewBookingDetails, setViewBookingDetails] = useState<Booking | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const listFutsals = async () => {
        try {
            const response = await futsalSvc.listFutsal();
            setFutsals(response.data.result || []);
        } catch (error) {
            console.error("Error fetching futsals:", error);
        }
    };

    const listBookings = async (page: number = 1) => {
        try {
            const response = await bookingSvc.listBookingAccVenue(
                selectedFutsal || 0,
                page,
            );
            setBookings(response.data.data || []);
            setPagination(response.data.pagination || {
                current_page: 1,
                per_page: 10,
                total_items: "0",
                total_pages: 1
            });
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        listFutsals();
    }, []);

    useEffect(() => {
        listBookings();
    }, [selectedFutsal]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.total_pages) {
            listBookings(page);
        }
    };

    const resetFilters = () => {
        setSelectedFutsal(null);

        setShowFilters(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">All Bookings</h1>

                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Filter Bookings</h3>
                        <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="futsal" className="block text-sm font-medium text-gray-700 mb-1">
                                Futsal Venue
                            </label>

                            <select
                                id="futsal"
                                value={selectedFutsal || ''}
                                onChange={(e) => setSelectedFutsal(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option key='' value='' >Choose a Futsal</option>

                                {futsals.map((futsal) => (
                                    <option key={futsal.futsal_id} value={futsal.futsal_id}>
                                        {futsal.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking.booking_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{booking.booking_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{booking.customer_name}</div>
                                            <div className="text-sm text-gray-500">{booking.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(booking.booking_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${parseFloat(booking.total_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setViewBookingDetails(booking)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="View Details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {bookings.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.current_page * pagination.per_page, parseInt(pagination.total_items))}
                                    </span>{' '}
                                    of <span className="font-medium">{pagination.total_items}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.current_page === page
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.total_pages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Details Modal */}
            {viewBookingDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setViewBookingDetails(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-gray-800">Booking #{viewBookingDetails.booking_id}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                                <p className="mt-1 text-sm text-gray-900">{viewBookingDetails.customer_name}</p>
                                <p className="text-sm text-gray-500">{viewBookingDetails.customer_email}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Booking Information</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    Date: {formatDate(viewBookingDetails.booking_date)}
                                </p>
                                <p className="text-sm text-gray-900">
                                    Total: ${parseFloat(viewBookingDetails.total_amount).toFixed(2)}
                                </p>
                                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(viewBookingDetails.status)}`}>
                                    {viewBookingDetails.status}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-md font-semibold mb-3 text-gray-700">Booked Slots</h3>
                            <div className="space-y-3">
                                {viewBookingDetails.booked_slots.map((slot) => (
                                    <div key={slot.slot_id} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-800">{slot.title}</h4>
                                                <p className="text-sm text-gray-600">{slot.court_title}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">
                                                    {slot.start_time} - {slot.end_time}
                                                </p>
                                                <p className="font-medium text-gray-800">${slot.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookingPage;