import React from "react";
import { toast } from "react-toastify";
import transactionSvc from "../../services/transaction.service";

interface Transaction {
    transaction_id: number;
    booking_id: number;
    transaction_date: string;
    total_payment: string;
    payment_session_id: string;
    payment_type: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'refund-failed';
}

interface PaginationMeta {
    limit: number;
    page: number;
    total: number;
    totalpages: number;
}

function AdminTransactionPage() {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [paginationMeta, setPaginationMeta] = React.useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchTransaction = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const resp = await transactionSvc.listTransactions(page);
            setTransactions(resp.data.result);
            setPaginationMeta(resp.data.meta);
        } catch (exception: any) {
            toast.error(exception.message);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTransaction(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page < 1 || (paginationMeta && page > paginationMeta.totalpages)) return;
        setCurrentPage(page);
    };

    return (
        <>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Transactions</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction.transaction_id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{transaction.payment_session_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{transaction.booking_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(transaction.transaction_date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${transaction.total_payment}</td>
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
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {paginationMeta && paginationMeta.totalpages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === paginationMeta.totalpages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(currentPage - 1) * paginationMeta.limit + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(currentPage * paginationMeta.limit, paginationMeta.total)}</span> of{' '}
                                        <span className="font-medium">{paginationMeta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">First</span>
                                            &laquo;
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            &lsaquo;
                                        </button>
                                        {Array.from({ length: Math.min(5, paginationMeta.totalpages) }, (_, i) => {
                                            let pageNum;
                                            if (paginationMeta.totalpages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= paginationMeta.totalpages - 2) {
                                                pageNum = paginationMeta.totalpages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === paginationMeta.totalpages}
                                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            &rsaquo;
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(paginationMeta.totalpages)}
                                            disabled={currentPage === paginationMeta.totalpages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Last</span>
                                            &raquo;
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminTransactionPage;