import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PointHistoryTitleComponent from "../../components/common/title/point-history.title.component"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import PointHistoryComponent from "../../components/common/history/point-history.component"
import { useEffect, useState } from "react"
import creditSvc from "../../services/credit_point.service"

function MyPointPages() {
    const [points, setPoints] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string>('All');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const listPoint = async (page = 1, type = 'All') => {
        try {
            setLoading(true);
            const response = await creditSvc.listPoints(page, pagination.limit, type);
            setPoints(response.data.result || []);
            const meta = response.data.meta;

            setPagination({
                currentPage: meta.page,
                totalPages: meta.totalPages,
                limit: meta.limit,
                total: meta.total,
                hasNextPage: meta.page < meta.totalPages,
                hasPreviousPage: meta.page > 1
            });
        } catch (err) {
            setError('Failed to fetch points history');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            listPoint(newPage, filterType);
        }
    };

    const handleTypeChange = (type: string) => {
        setFilterType(type);
        // Reset to first page when filter changes
        listPoint(1, type);
    };

    useEffect(() => {
        listPoint(1, filterType);
    }, []);
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

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



    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-8">{error}</div>;
    }

    return (
        <>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mx-auto max-w-5xl">
                        <PointHistoryTitleComponent onTypeChange={handleTypeChange} />



                        <div className="mt-6 flow-root sm:mt-7">
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                <div className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="col-span-2 content-center sm:col-span-4 lg:col-span-1 lg:block hidden">
                                        <h2 className="font-medium text-xl text-amber-700">ID</h2>
                                    </div>
                                    <div className="content-center lg:block hidden">
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-medium text-xl text-amber-700">Date</h2>
                                        </div>
                                    </div>
                                    <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto lg:block hidden">
                                        <h2 className="font-medium text-xl text-amber-700">Point</h2>
                                    </div>
                                    <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto lg:block hidden">
                                        <h2 className="font-medium text-xl text-amber-700">Type</h2>
                                    </div>
                                </div>

                                {points.length > 0 ? (
                                    points.map((point) => (
                                        <PointHistoryComponent
                                            key={point.credit_id}
                                            id={`#${point.credit_session_id}`}
                                            date={formatDate(point.transaction_date)}
                                            point={point.credit_amount}
                                            type={point.transaction_type}
                                        />
                                    ))
                                ) : (
                                    <div className="py-6 text-center">
                                        <p>No points history found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {pagination.totalPages > 1 && renderPagination()}
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyPointPages