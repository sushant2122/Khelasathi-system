import { useContext, useEffect, useState, useCallback } from "react";
import { Carousel } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCalendar, faImage } from "@fortawesome/free-solid-svg-icons";
import TagComponent from "../../components/common/tag/tag.component";
import AuthContext from "../../context/auth.context";
import { useNavigate, useParams } from "react-router-dom";
import futsalSvc from "../../services/futsal.service";
import tagSvc from "../../services/tag.service";
import { toast } from "react-toastify";
import courtSvc from "../../services/court.service";
import slotSvc from "../../services/slot.service";
import Swal from "sweetalert2";
import bookingSvc from "../../services/booking.service";
import client from "../../config/socket.config";

export interface Futsal {
    futsal_id: number;
    name: string;
    location: string;
    description: string;
    contact_number: string;
    is_active: boolean;
    verification_status: string;
    image_url?: string;
    slug: string;
    maplink: string;
}

export interface Tag {
    tag_id: number;
    tagname: string;
    futsal_id: number;
    is_available: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    image_id: number;
    image: string;
    caption: string;
}

export interface Court {
    court_id: number;
    title: string;
    type: string;
}

export interface Slot {
    slot_id: number;
    title: string;
    start_time: string;
    end_time: string;
    price: number;
    credit_point: number;
    is_available: boolean;
}

export interface BookingFormData {
    booking_date: string;
    remarks: string;
    is_paid: boolean;
    slots: {
        slot_id: number;
        price: number;
        credit_point: number;
    }[];
}

const FutsalDetailPage = () => {
    const auth: any = useContext(AuthContext);
    const [futsal, setFutsal] = useState<Futsal | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const { slug } = useParams();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState<BookingFormData>({
        booking_date: '',
        remarks: '',
        is_paid: false,
        slots: [],
    });
    const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showLocation, setShowLocation] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);

    const handleSlotSelection = (slot: Slot) => {
        setSelectedSlots(prev => {
            const existingIndex = prev.findIndex(s => s.slot_id === slot.slot_id);

            if (existingIndex >= 0) {
                return prev.filter(s => s.slot_id !== slot.slot_id);
            } else {
                if (prev.length >= 3) {
                    toast.error("You can only select up to 3 slots");
                    return prev;
                }
                return [...prev, slot];
            }
        });
    };

    const handleCourtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourt(Number(e.target.value));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        setBookingData(prev => ({
            ...prev,
            booking_date: date
        }));
        setSelectedSlots([]);
    };

    const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBookingData(prev => ({
            ...prev,
            remarks: e.target.value
        }));
    };

    const fetchFutsalDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!slug) {
                throw new Error("No slug provided");
            }
            const response = await futsalSvc.FutsalDetail(slug);
            setFutsal(response.data.result);
            if (response.data.result?.futsal_id) {
                await Promise.all([
                    fetchTags(response.data.result.futsal_id),
                    fetchCourts(response.data.result.futsal_id),
                    fetchImages(response.data.result.futsal_id)
                ]);
            }
        } catch (err) {
            setError("Failed to load futsal details");
            toast.error('Failed to fetch futsal details');
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async (futsalId: number) => {
        try {
            const response = await tagSvc.listFutsalTags(futsalId);
            setTags(response.data.result.list);
        } catch (err) {
            toast.error('Failed to fetch tags');
        }
    };

    const fetchImages = async (futsalId: number) => {
        try {
            const response = await futsalSvc.futsalImages(futsalId);
            setImages(response.data.result.list);
        } catch (err) {
            toast.error('Failed to fetch images');
        }
    };

    const fetchCourts = async (futsalId: number) => {
        try {
            const response = await courtSvc.listFutsalCourts(futsalId);
            setCourts(response.data.result);
            if (response.data.result.length > 0) {
                setSelectedCourt(response.data.result[0].court_id);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                toast.error('Please login to view court details');
                navigate('/signin');
            } else {
                // toast.error('Failed to fetch courts');
            }
        }
    };

    const fetchAvailableSlots = async (courtId: number, date: string) => {
        try {
            setSlotsLoading(true);
            const dateObj = new Date(date);
            const response = await slotSvc.listFutsalSlots(courtId, dateObj);
            setAvailableSlots(response.data.result || []);
        } catch (err: any) {
            toast.error(err.message);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const reloadSlot = useCallback((data: any) => {
        if (!data || !data.booking_date || !data.court_id) return;

        const receivedDate = new Date(data.booking_date).toISOString().split('T')[0];
        const currentDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : null;

        if (selectedCourt === data.court_id && currentDate === receivedDate) {
            fetchAvailableSlots(data.court_id, data.booking_date);

            if (data.updated_slots && Array.isArray(data.updated_slots)) {
                setSelectedSlots(prev => {
                    const updatedSlots = prev.filter(selectedSlot =>
                        data.updated_slots.some((updated: any) =>
                            updated.slot_id === selectedSlot.slot_id && updated.is_available
                        )
                    );

                    if (updatedSlots.length !== prev.length) {
                        toast.info("Some selected slots are no longer available");
                    }

                    return updatedSlots;
                });
            }
        }
    }, [selectedCourt, selectedDate]);

    useEffect(() => {
        const handleConnect = () => {
            console.log("Connected to socket server");
        };

        const handleDisconnect = () => {
            console.log("Disconnected from socket server");
        };

        client.on('connect', handleConnect);
        client.on('disconnect', handleDisconnect);
        client.on('recievedslotdatacash', reloadSlot);
        client.on('recievedslotdatapoint', reloadSlot);

        return () => {
            client.off('connect', handleConnect);
            client.off('disconnect', handleDisconnect);
            client.off('recievedslotdatacash', reloadSlot);
            client.off('recievedslotdatapoint', reloadSlot);
        };
    }, [reloadSlot]);

    useEffect(() => {
        fetchFutsalDetail();
    }, [slug]);

    useEffect(() => {
        if (selectedCourt && selectedDate) {
            fetchAvailableSlots(selectedCourt, selectedDate);
        } else {
            setAvailableSlots([]);
        }
    }, [selectedCourt, selectedDate]);

    const navigateToLogin = () => {
        navigate('/signin');
    };

    const calculateTotalAmount = () => {
        return selectedSlots.reduce((total, slot) => total + slot.price, 0);
    };

    const calculateTotalCreditPoints = () => {
        return selectedSlots.reduce((total, slot) => total + slot.credit_point, 0);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        if (!showModal) {
            setSelectedDate('');
            setSelectedSlots([]);
        }
    };

    const formatTimeSlot = (slot: Slot) => {
        return `${slot.start_time}-${slot.end_time}`;
    };

    const handleSubmitBooking = async () => {
        try {
            if (!selectedCourt || selectedSlots.length === 0) {
                toast.error("Please select at least one slot");
                return;
            }
            if (!bookingData.remarks) {
                toast.error("Please add remarks");
                return;
            }

            const bookingPayload = {
                booking_date: selectedDate,
                remarks: bookingData.remarks,
                is_paid: false,
                slots: selectedSlots.map(slot => ({
                    slot_id: slot.slot_id,
                    price: slot.price,
                    credit_point: slot.credit_point
                })),
            };

            const result = await Swal.fire({
                title: "Select Payment Method",
                text: "How would you like to pay for your booking?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Khalti",
                denyButtonText: "Redeem Points",
                cancelButtonText: "Cancel",
                icon: "question"
            });

            if (result.isConfirmed) {
                try {
                    const resp = await bookingSvc.createBookingKhalti(bookingPayload);
                    client.emit("NewBookingthroughcash", {
                        ...bookingPayload,
                        court_id: selectedCourt,
                        updated_slots: selectedSlots.map(s => ({
                            slot_id: s.slot_id,
                            is_available: false
                        }))
                    });

                    toast.success("Redirecting to khalti...");
                    window.location.href = resp.data.result.payment_link.data.payment_url;
                    toggleModal();
                } catch (exception: any) {
                    toast.error(exception.data?.message || "Payment failed");
                }
            } else if (result.isDenied) {
                try {
                    await bookingSvc.createBookingPoint(bookingPayload);
                    client.emit("NewBookingthroughpoint", {
                        ...bookingPayload,
                        court_id: selectedCourt,
                        updated_slots: selectedSlots.map(s => ({
                            slot_id: s.slot_id,
                            is_available: false
                        }))
                    });

                    toast.success("Booking created successfully with points redemption!");
                    toggleModal();
                } catch (exception: any) {
                    toast.error(exception.data?.message || "Booking failed");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create booking");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!futsal) return <div>Futsal not found</div>;

    return (
        <>
            <div className="flex flex-col md:flex-row py-12 2xl:px-20 md:px-6 gap-8">
                <div className="w-full md:w-1/2">
                    <div className="h-56 sm:h-64 xl:h-80 2xl:h-full mb-4">
                        {(futsal?.image_url) || (Array.isArray(images) && images.length > 0) ? (
                            <Carousel className="w-full">
                                {futsal?.image_url && (
                                    <div key="main-image" className="w-full h-[400px]">
                                        <img
                                            src={futsal.image_url}
                                            alt="Main futsal image"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                {Array.isArray(images) && images.map((image) => (
                                    image?.image && (
                                        <div key={`image-${image.image_id}`} className="w-full h-[400px]">
                                            <img
                                                src={image.image}
                                                alt={image.caption || `Futsal image ${image.image_id}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )
                                ))}
                            </Carousel>
                        ) : (
                            <div className="text-center p-8 text-gray-600">
                                <FontAwesomeIcon
                                    icon={faImage}
                                    className="text-gray-300 mb-4 text-4xl"
                                />
                                <p>No images available for this futsal</p>
                            </div>
                        )
                        }
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                        {tags.map((tag) => (
                            <TagComponent
                                key={tag.tag_id}
                                tagname={tag.tagname}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2 min-h-[300px]">
                    <div className="py-4 border-b border-gray-200 flex items-center justify-between">
                        <h1 className="font-medium text-3xl text-amber-700">{futsal.name}</h1>
                    </div>

                    <div>
                        <p className="xl:pr-4 text-base text-gray-600 mt-7">{futsal.description}</p>
                        <p className="text-base leading-4 mt-4 text-gray-600">
                            Location: <span className="text-amber-700 font-medium">{futsal.location}</span>
                        </p>
                        <p className="text-base leading-4 mt-4 text-gray-600">
                            Contact no: <a className="text-amber-700 font-medium">{futsal.contact_number}</a>
                        </p>
                    </div>

                    {auth.loggedInUser ? (
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="my-3 w-full hover:text-white bg-gray-300 text-gray-900 hover:bg-amber-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            <FontAwesomeIcon icon={faCalendar} />&ensp;Book now
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={navigateToLogin}
                            className="my-3 w-full hover:text-white bg-gray-300 text-gray-900 hover:bg-amber-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            <FontAwesomeIcon icon={faCalendar} />&ensp;Book now
                        </button>
                    )}

                    <div>
                        <div className="border-b py-4 border-gray-200">
                            <div onClick={() => setShowContact(!showContact)} className="flex justify-between items-center cursor-pointer">
                                <p className="text-base leading-4 text-gray-800">Contact us</p>
                                <button className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded">
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </button>
                            </div>
                            <div className={`pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 ${showContact ? "block" : "hidden"}`}>
                                If you have any questions on how to refund after cancellation, contact us.
                            </div>
                        </div>

                        <div className="border-b py-4 border-gray-200">
                            <div onClick={() => setShowLocation(!showLocation)} className="flex justify-between items-center cursor-pointer">
                                <p className="text-base leading-4 text-gray-800">View Location</p>
                                <button className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded">
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </button>
                            </div>
                            <div className={`pt-4 text-base leading-normal pr-12 m-4 text-amber-700 ${showLocation ? "block" : "hidden"}`}>
                                <p className="text-base leading-4 m-4 text-amber-700">{futsal.location}</p>
                                <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[450px]">
                                    <iframe
                                        src={futsal.maplink}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Futsal Location"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div
                    id="accountInformationModal2"
                    tabIndex={-1}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-6"
                    onClick={toggleModal}
                >
                    <div
                        className="relative w-full max-w-md md:max-w-lg lg:max-w-xl p-4 md:p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4">
                            <h3 className="text-lg font-semibold text-gray-900">Book Futsal</h3>
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200"
                            >
                                <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="bg-white p-4 md:p-6 rounded-lg">
                            <div className="mb-4">
                                <label className="block text-lg font-medium text-amber-600 mb-2">Select Court</label>
                                <select
                                    name="court"
                                    id="court"
                                    value={selectedCourt || ''}
                                    onChange={handleCourtChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                >
                                    {courts.map((court) => (
                                        <option key={court.court_id} value={court.court_id}>
                                            {court.title} ({court.type})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-medium text-amber-600 mb-2">Select Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                />
                            </div>

                            <div className="mb-4">
                                <h2 className="text-lg font-medium text-amber-600 mb-2">Select Time</h2>
                                {slotsLoading ? (
                                    <div className="text-center py-4">Loading available slots...</div>
                                ) : availableSlots.length === 0 && selectedDate ? (
                                    <div className="text-center py-4">No available slots for this date</div>
                                ) : !selectedDate ? (
                                    <div className="text-center py-4">Please select a date to see available slots</div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {availableSlots.map((slot) => {
                                            const timeSlot = formatTimeSlot(slot);
                                            const isSelected = selectedSlots.some(s => s.slot_id === slot.slot_id);

                                            return (
                                                <button
                                                    key={slot.slot_id}
                                                    onClick={() => handleSlotSelection(slot)}
                                                    className={`p-2 text-sm rounded-md transition 
                                                        ${isSelected ? 'bg-amber-600 text-white' :
                                                            'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
                                                >
                                                    {timeSlot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white rounded-lg shadow mb-4">
                                <h2 className="text-lg font-medium text-amber-600 mb-2">Additional Details</h2>
                                <label className="block text-sm font-medium text-amber-600">Special Requests</label>
                                <textarea
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    onChange={handleRemarksChange}
                                    value={bookingData.remarks}
                                />
                            </div>

                            <div className="p-4 bg-amber-50 rounded-lg shadow-md">
                                <h3 className="text-xl font-medium text-amber-600 mb-2">Booking Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <p className="font-medium text-gray-700">Date:</p>
                                        <p className="text-gray-900">{selectedDate || 'Not selected'}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-gray-700">Selected Times:</p>
                                        <p className="text-gray-900">
                                            {selectedSlots.length > 0
                                                ? selectedSlots.map(slot => formatTimeSlot(slot)).join(', ')
                                                : 'None'}
                                        </p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-gray-700">Total Hours:</p>
                                        <p className="text-gray-900">{selectedSlots.length}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-gray-700">Total Amount:</p>
                                        <p className="text-gray-900">Rs. {calculateTotalAmount()}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-gray-700">Credit Points:</p>
                                        <p className="text-gray-900">{calculateTotalCreditPoints()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    className={`w-full p-3 rounded-md shadow-md 
                                        ${selectedSlots.length > 0 ?
                                            'bg-amber-600 text-white hover:bg-amber-700' :
                                            'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    disabled={selectedSlots.length === 0}
                                    onClick={handleSubmitBooking}
                                >
                                    Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FutsalDetailPage;