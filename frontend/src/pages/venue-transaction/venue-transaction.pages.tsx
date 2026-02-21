import React, { useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import transactionSvc from '../../services/transaction.service';

interface Slot {
    court_title: string;
    slot_title: string;
    start_time: string;
    end_time: string;
    price: number;
}

interface Booking {
    user_id: number;
    booking_date: string;
    status: string;
}

interface Transaction {
    transaction_id: number;
    transaction_date: string;
    total_payment: string;
    payment_session_id: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'refund-failed';
    payment_type: string;
    booking: Booking;
    slot: Slot;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    total: string;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

const VenueTransactionPages: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        total: "0",
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false
    });
    const [viewTransactionDetails, setViewTransactionDetails] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const listVenueTransaction = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const response = await transactionSvc.listVenueTransactions(page);
            setTransactions(response.data.result.list || []);
            setPagination(response.data.result.pagination || {
                currentPage: 1,
                totalPages: 1,
                total: "0",
                limit: 10,
                hasNextPage: false,
                hasPreviousPage: false
            });
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        listVenueTransaction();
    }, []);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            listVenueTransaction(page);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatBookingDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
            case 'refund-failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading && (
                    <div className="p-4 text-center">Loading...</div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Court
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Type
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
                            {!isLoading && transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{transaction.payment_session_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.slot.court_title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatBookingDate(transaction.booking.booking_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(transaction.transaction_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${parseFloat(transaction.total_payment).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {transaction.payment_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.payment_status)}`}>
                                                {transaction.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setViewTransactionDetails(transaction)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="View Details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.currentPage * pagination.limit, parseInt(pagination.total))}
                                    </span>{' '}
                                    of <span className="font-medium">{pagination.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPreviousPage}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.currentPage === pageNum
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
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

            {/* Transaction Details Modal */}
            {viewTransactionDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setViewTransactionDetails(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-gray-800">Transaction #{viewTransactionDetails.transaction_id}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Transaction Information</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    Date: {formatDate(viewTransactionDetails.transaction_date)}
                                </p>
                                <p className="text-sm text-gray-900">
                                    Total: ${parseFloat(viewTransactionDetails.total_payment).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-900 capitalize">
                                    Payment Type: {viewTransactionDetails.payment_type}
                                </p>
                                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(viewTransactionDetails.payment_status)}`}>
                                    {viewTransactionDetails.payment_status}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Booking Information</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    Booking Date: {formatBookingDate(viewTransactionDetails.booking.booking_date)}
                                </p>
                                <p className="text-sm text-gray-900">
                                    Status: {viewTransactionDetails.booking.status}
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-md font-semibold mb-3 text-gray-700">Slot Details</h3>
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-800">{viewTransactionDetails.slot.slot_title}</h4>
                                        <p className="text-sm text-gray-600">{viewTransactionDetails.slot.court_title}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            {viewTransactionDetails.slot.start_time} - {viewTransactionDetails.slot.end_time}
                                        </p>
                                        <p className="font-medium text-gray-800">${viewTransactionDetails.slot.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenueTransactionPages;