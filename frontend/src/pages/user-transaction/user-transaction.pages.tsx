import { useState, useEffect } from "react";

import transactionSvc from "../../services/transaction.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface Transaction {
    transaction_id: number;
    booking_id: number;
    transaction_date: string;
    total_payment: string;
    payment_session_id: string;
    payment_type: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'refund-failed';
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface ApiResponse {
    result: {
        list: Transaction[];
        pagination: Pagination;
    };
}

function UserTransactionPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchTransaction(newPage);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const fetchTransaction = async (page = 1) => {
        try {
            const resp = await transactionSvc.listUserTransaction(page);
            const data = resp.data as ApiResponse;
            setTransactions(data.result.list);
            setPagination(data.result.pagination);
        } catch (exception: any) {
            //  toast.error(exception.message || "Failed to fetch transactions");
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, []);

    const renderPagination = () => {
        const { currentPage, totalPages } = pagination;
        const pages = [];

        // Don't show pagination if there's only one page
        if (totalPages <= 1) return null;

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
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 ml-5 text-amber-700">Transactions</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">

                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <tr key={transaction.transaction_id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{transaction.booking_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{transaction.payment_session_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(transaction.transaction_date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">रु{transaction.total_payment}</td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.payment_type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                transaction.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    transaction.payment_status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {transaction.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (

                                <tr>
                                    <td colSpan={6} className="py-6 text-center">
                                        <div className="flex justify-center">
                                            <p>No Transaction history found</p>
                                        </div>
                                    </td>
                                </tr>


                            )}
                        </tbody>
                    </table>
                    <div className="mb-4">
                        {renderPagination()}

                    </div>

                </>

            </div>
        </div>
    );
}

export default UserTransactionPage;