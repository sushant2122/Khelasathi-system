import { useEffect, useState } from "react";
import creditSvc from "../../../services/credit_point.service";
import LoadingComponents, { LoadingSize } from "../../loading/loading.components";

interface PointHistoryTitleProps {
    onTypeChange: (type: string) => void;
}

function PointHistoryTitleComponent({ onTypeChange }: PointHistoryTitleProps) {
    const [point, setPoint] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedType, setSelectedType] = useState<string>('All');

    const calculatePoint = async () => {
        try {
            setLoading(true);
            const response = await creditSvc.calculatePoints();
            setPoint(response.data.result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        setSelectedType(type);
        onTypeChange(type);
    };

    useEffect(() => {
        calculatePoint();
    }, []);

    return (
        <div className="gap-4 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-xl font-medium text-amber-700 dark:text-white sm:text-2xl">Point History</h2>
            <div className="mt-6 gap-4 space-y-4 sm:flex sm:items-center sm:space-y-0 lg:mt-0 lg:justify-end">
                <span className="inline-block text-gray-500 dark:text-gray-400">Select type</span>
                <div>
                    <label htmlFor="order-type" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Select type
                    </label>
                    <select
                        id="order-type"
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-700 focus:ring-amber-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-amber-700 dark:focus:ring-primary-500 sm:w-[144px]"
                    >
                        <option value="All">All</option>
                        <option value="redeemed">Redeemed</option>
                        <option value="earned">Earned</option>
                    </select>
                </div>
                <h2 className="w-full bg-amber-700 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">
                    Balance: {
                        loading ? <>
                            <LoadingComponents size={LoadingSize.SM} />
                        </> : <>
                            {point}</>
                    }

                </h2>
            </div>
        </div>
    );
}

export default PointHistoryTitleComponent;