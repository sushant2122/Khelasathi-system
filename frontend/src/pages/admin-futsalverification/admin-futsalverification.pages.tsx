import { useEffect, useState } from 'react';
import {
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    Image as ImageIcon,
    Clock,
    Tag,
} from 'lucide-react';
import Swal from 'sweetalert2';
import futsalSvc from '../../services/futsal.service';
import { toast } from 'react-toastify';

interface Futsal {
    futsal_id: number;
    name: string;
    description: string;
    slug: string;
    location: string;
    maplink: string;
    contact_number: string;
    verification_status: 'pending' | 'approved' | 'rejected';
    is_active: boolean;
    courts: Court[];
    image_url: string;
    images: VenueImage[];
    tags: Tag[];
}

interface Court {
    court_id: number;
    title: string;
    type: string;
    slots: Slot[] | null;
}

interface Slot {
    slot_id: number;
    title: string;
    start_time: string;
    end_time: string;
    price: number;
    is_active: boolean;
}

interface VenueImage {
    image_id: number;
    image_url: string;
    caption: string;
    is_active: boolean;
}

interface Tag {
    tag_id: number;
    tagname: string;
    is_available: boolean;
}

interface Pagination {
    current_page: number;
    per_page: number;
    total_items: string;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
}

function AdminFutsalVerificationPages() {
    const [selectedFutsal, setSelectedFutsal] = useState<Futsal | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [futsals, setFutsals] = useState<Futsal[]>([]);
    const [_pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isActive, setIsActive] = useState(true);
    console.log(futsals);
    useEffect(() => {
        document.body.style.overflow = isViewModalOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isViewModalOpen]);

    const fetchFutsalDetails = async () => {
        setIsLoading(true);
        try {
            const resp = await futsalSvc.listFutsalVerificationDetail();
            setFutsals(resp.data.data);
            setPagination(resp.data.pagination);
        } catch (exception: any) {
            toast.error(exception.message);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyFutsal = async (id: number, status: 'approved' | 'rejected' | 'pending') => {
        setIsVerifying(true);
        try {
            const data = {
                is_active: isActive.toString(),
                verification_status: status
            };

            await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to ${status} this futsal and set it as ${isActive ? 'active' : 'inactive'}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes, ${status} it!`
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await futsalSvc.verifyFutsal(id, data);
                    toast.success(`Futsal ${status} successfully`);
                    fetchFutsalDetails();
                    setIsViewModalOpen(false);
                }
            });
        } catch (exception: any) {
            toast.error(exception.message);
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        fetchFutsalDetails();
    }, []);

    const handleView = (futsal: Futsal) => {
        setSelectedFutsal(futsal);
        setIsActive(futsal.is_active);
        setIsViewModalOpen(true);
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">
                Futsal Verification
            </h1>

            <div className="mt-8">
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                        Futsal Name
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Location
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Contact
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : futsals.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center">
                                            No futsals found
                                        </td>
                                    </tr>
                                ) : (
                                    futsals.map((futsal) => (
                                        <tr key={futsal.futsal_id}>
                                            <td className="py-4 pl-4 pr-3 text-sm">
                                                <div className="font-medium text-gray-900">
                                                    {futsal.name}
                                                </div>
                                                <div className="text-gray-500">{futsal.slug}</div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                {futsal.location}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                {futsal.contact_number}
                                            </td>
                                            <td className="px-3 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${futsal.verification_status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : futsal.verification_status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {futsal.verification_status.charAt(0).toUpperCase() +
                                                        futsal.verification_status.slice(1)}
                                                </span>
                                                <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${futsal.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {futsal.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-right space-x-2">
                                                <button
                                                    onClick={() => handleView(futsal)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {isViewModalOpen && selectedFutsal && (
                <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {selectedFutsal.name}
                            </h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm font-medium text-gray-700">Active Status</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isActive}
                                            onChange={() => setIsActive(!isActive)}
                                            disabled={isVerifying}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            {isVerifying ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-500">Processing...</span>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => verifyFutsal(selectedFutsal.futsal_id, 'approved')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                        disabled={isVerifying}
                                    >
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => verifyFutsal(selectedFutsal.futsal_id, 'pending')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                                        disabled={isVerifying}
                                    >
                                        <Clock className="h-5 w-5 mr-2" />
                                        Set Pending
                                    </button>
                                    <button
                                        onClick={() => verifyFutsal(selectedFutsal.futsal_id, 'rejected')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                        disabled={isVerifying}
                                    >
                                        <XCircle className="h-5 w-5 mr-2" />
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div>

                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Basic Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                Location
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {selectedFutsal.location}
                                            </p>
                                            <a
                                                href={selectedFutsal.maplink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                View on Map
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Phone className="h-5 w-5 text-gray-400 mt-1" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                Contact Number
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {selectedFutsal.contact_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">
                                    Description
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {selectedFutsal.description}
                                </p>

                                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">
                                    Courts
                                </h3>
                                <div className="space-y-4">
                                    {selectedFutsal.courts.length > 0 ? (
                                        selectedFutsal.courts.map((court) => (
                                            <div key={court.court_id} className="border rounded-lg p-4">
                                                <h4 className="font-medium">{court.title}</h4>
                                                <p className="text-sm text-gray-500 capitalize">{court.type}</p>

                                                {court.slots && court.slots.length > 0 && (
                                                    <div className="mt-2">
                                                        <h5 className="text-sm font-medium flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            Slots
                                                        </h5>
                                                        <ul className="mt-1 space-y-1">
                                                            {court.slots.map((slot) => (
                                                                <li key={slot.slot_id} className="text-sm text-gray-500">
                                                                    {slot.title}: {slot.start_time} - {slot.end_time} (Rs. {slot.price})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No courts available</p>
                                    )}
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFutsal.tags.length > 0 ? (
                                        selectedFutsal.tags.map((tag) => (
                                            <span key={tag.tag_id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag.tagname}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No tags available</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Futsal Images
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <img
                                        src={selectedFutsal.image_url}
                                        alt={selectedFutsal.name}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    {selectedFutsal.images.length > 0 ? (

                                        selectedFutsal.images.map((image) => (
                                            <div key={image.image_id} className="relative">
                                                <img
                                                    src={image.image_url}
                                                    alt={image.caption}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <div className="mt-2 flex items-center">
                                                    <ImageIcon className="h-4 w-4 text-gray-400" />
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {image.caption}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No images available</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                disabled={isVerifying}
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

export default AdminFutsalVerificationPages;