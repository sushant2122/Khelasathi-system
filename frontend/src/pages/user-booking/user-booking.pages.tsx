import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import BookingTitleComponent from "../../components/common/title/booking-history.title.component";
import bookingSvc from "../../services/booking.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function UserBookingPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const Navigate = useNavigate();
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });
    console.log("selewcted", selectedBooking);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            listBookings(newPage);
        }
    };

    const listBookings = async (page = 1) => {
        try {
            setLoading(true);
            const response = await bookingSvc.listBookingUser(page);
            setBookings(response.data.result.list);
            console.log("booking detail", response.data.result.list);
            setPagination(response.data.result.pagination);
        } catch (err) {

            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openBookingDetails = (booking: any) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBooking(null);
    };
    const cancelBooking = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: "The booking amount will be refunded to your registered number after a 10% deduction.",
                text: "Do you want to continue?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            });

            if (result.isConfirmed) {
                const response = await bookingSvc.cancelBooking(id);
                toast.success(response.data.message);
                Navigate('/');
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Something went wrong");
        }
    };
    const isBeforeCancellationDeadline = (bookingDate: string) => {
        const today = new Date();
        const bookingDateObj = new Date(bookingDate);
        const cancellationDeadline = new Date(bookingDateObj);

        // Set deadline to 2 days before booking
        cancellationDeadline.setDate(bookingDateObj.getDate() - 2);

        // Normalize times to midnight for accurate comparison
        today.setHours(0, 0, 0, 0);
        cancellationDeadline.setHours(0, 0, 0, 0);

        // Only allow cancellation if today is before the deadline
        return today < cancellationDeadline;
    };

    // Function to format date from "2025-04-13T16:26:24.886Z" to "13 April 2025"
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    useEffect(() => {
        listBookings();
    }, [])
    // Function to format time from "10:00:00" to "10:00 AM"
    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>


        </div>;
    }

    // if (error) {
    //     return <div className="text-red-500 text-center p-8">{error}</div>;
    // }

    const renderPagination = () => {
        const { currentPage, totalPages } = pagination;
        const pages = [];

        // Always show first page
        pages.push(
            <li key={1}>
                <button
                    onClick={() => handlePageChange(1)}
                    className={`flex h-8 items-center justify-center border px-3 leading-tight ${currentPage === 1 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-gray-300'}`}
                >
                    1
                </button>
            </li>
        );

        // Show ellipsis if needed after first page
        if (currentPage > 3) {
            pages.push(
                <li key="ellipsis-start">
                    <span className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500">...</span>
                </li>
            );
        }

        // Show current page and adjacent pages
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(
                <li key={i}>
                    <button
                        onClick={() => handlePageChange(i)}
                        className={`flex h-8 items-center justify-center border px-3 leading-tight ${currentPage === i ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-gray-300'}`}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        // Show ellipsis if needed before last page
        if (currentPage < totalPages - 2) {
            pages.push(
                <li key="ellipsis-end">
                    <span className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500">...</span>
                </li>
            );
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pages.push(
                <li key={totalPages}>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`flex h-8 items-center justify-center border px-3 leading-tight ${currentPage === totalPages ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-gray-300'}`}
                    >
                        {totalPages}
                    </button>
                </li>
            );
        }

        return (
            <nav className="mt-2 flex items-center justify-center sm:mt-8" aria-label="Page navigation">
                <ul className="flex h-8 items-center -space-x-px text-sm">
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPreviousPage}
                            className={`ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 px-3 leading-tight ${pagination.hasPreviousPage ? 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700' : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                            <span className="sr-only">Previous</span>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>
                    </li>
                    {pages}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className={`flex h-8 items-center justify-center rounded-e-lg border px-3 leading-tight ${pagination.hasNextPage ? 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700' : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                            <span className="sr-only">Next</span>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    return (
        <>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mx-auto max-w-5xl">
                        <BookingTitleComponent />

                        <div className="mt-6 flow-root sm:mt-8">
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                <div className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-6">
                                    <div className="col-span-2 content-center sm:col-span-4 lg:col-span-2 lg:block">
                                        <h2 className="font-medium text-xl text-amber-700">Futsal</h2>
                                    </div>
                                    <div className="content-center lg:block">
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-medium text-xl text-amber-700">Date</h2>
                                        </div>
                                    </div>
                                    <div className="content-center lg:block">
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-medium text-xl text-amber-700">Payment</h2>
                                        </div>
                                    </div>
                                    <div className="content-center lg:block">
                                        <h2 className="font-medium text-xl text-amber-700">Points</h2>
                                    </div>
                                    <div className="content-center lg:block">
                                        <h2 className="font-medium text-xl text-amber-700">Status</h2>
                                    </div>
                                </div>

                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <div key={booking.booking_id} className="py-6">
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                                                <div className="col-span-2 sm:col-span-4 lg:col-span-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="min-w-12 min-h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {booking.futsal_name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {booking.futsal_location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="text-base font-medium text-gray-900 dark:text-white">
                                                        {formatDate(booking.booking_date)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="text-base font-medium text-gray-900 dark:text-white">
                                                        {booking.is_paid ? 'Paid' : 'Unpaid'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="text-base font-medium text-gray-900 dark:text-white">
                                                        {booking.total_points_collected}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={`px-3 py-1 text-sm rounded-full ${booking.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={() => openBookingDetails(booking)}
                                                        className="p-2 text-amber-600 hover:text-amber-800 dark:hover:text-amber-400"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))

                                ) : (
                                    <div className="py-6 text-center">
                                        <p>No Booking history found</p>
                                    </div>
                                )}



                            </div>
                        </div>

                        {/* //paginatiion */}
                        {renderPagination()}
                    </div>
                </div>
            </section>

            {/* Booking Details Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg leading-6 font-bold text-amber-700">
                                        Booking Details
                                    </h3>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <h4 className="font-semibold text-lg text-amber-700 mb-2">{selectedBooking.futsal_name}</h4>
                                        <p className="text-gray-600"><span className="font-medium">Location:</span> {selectedBooking.futsal_location}</p>
                                        <p className="text-gray-600"><span className="font-medium">Contact:</span> {selectedBooking.futsal_contact}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Booking Date</p>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.booking_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Booked On</p>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.booked_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Payment Status</p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {selectedBooking.is_paid ? (
                                                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Paid</span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Unpaid</span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                            <p className="mt-1 text-sm text-gray-900">Rs. {selectedBooking.total_amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Points Collected</p>
                                            <p className="mt-1 text-sm text-gray-900">{selectedBooking.total_points_collected}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Status</p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedBooking.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : selectedBooking.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h4 className="font-semibold text-lg text-amber-700 mb-3">Booked Slots</h4>
                                        {selectedBooking.slots.map((slot: any) => (
                                            <div key={slot.slot_id} className="bg-gray-50 p-4 rounded-lg mb-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Court</p>
                                                        <p className="mt-1 text-sm text-gray-900">{slot.court_title} ({slot.court_type})</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Slot</p>
                                                        <p className="mt-1 text-sm text-gray-900">{slot.title}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Time</p>
                                                        <p className="mt-1 text-sm text-gray-900">{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Price</p>
                                                        <p className="mt-1 text-sm text-gray-900">Rs. {slot.price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedBooking.remarks && (
                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="font-semibold text-lg text-amber-700 mb-2">Remarks</h4>
                                            <p className="text-gray-600">{selectedBooking.remarks}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                {isBeforeCancellationDeadline(selectedBooking.booking_date) &&
                                    selectedBooking.status !== 'cancelled' &&
                                    selectedBooking.status !== 'pending' &&
                                    selectedBooking.status !== 'confirmed' && (  // Added this condition
                                        <button
                                            type="button"
                                            onClick={() => cancelBooking(selectedBooking.booking_id)}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserBookingPage