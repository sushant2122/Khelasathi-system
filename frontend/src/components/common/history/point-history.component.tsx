import { faCalendar, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
interface PointHistoryComponentInterface {
    id: string,
    date: string,
    point: number,
    type: string,

}

function PointHistoryComponent(props: PointHistoryComponentInterface) {
    return (
        <>
            <div className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-4 lg:grid-cols-4">
                <div className="col-span-2 content-center sm:col-span-4 lg:col-span-1">
                    <p className="text-base font-semibold text-gray-900 hover:underline hover:text-amber-700 dark:text-white">{props.id}</p>
                </div>
                <div className="content-center">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{props.date}</p>
                    </div>
                </div>
                <div className="content-center">
                    <div className="flex items-center justify-end gap-2 sm:justify-start">
                        <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">
                            {props.type === "earned" && (
                                <span className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                    {props.point}
                                </span>
                            )}

                            {props.type === "redeemed" && (
                                <span className="inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                                    <FontAwesomeIcon icon={faMinus} className="mr-1" />
                                    {props.point}
                                </span>
                            )}
                        </span></p>
                    </div>
                </div>

                <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto">
                    {props.type === "earned" && (
                        <span className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            <FontAwesomeIcon icon={faPlus} className="mr-1" />
                            Credited
                        </span>
                    )}

                    {props.type === "redeemed" && (
                        <span className="inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                            <FontAwesomeIcon icon={faMinus} className="mr-1" />
                            Redeemed
                        </span>
                    )}
                </div>
                {/* <div className="col-span-2 content-center sm:col-span-1 sm:justify-self-end">
                    <button type="button" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-amber-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"><FontAwesomeIcon icon={faInfo} />&ensp;inquiry</button>
                </div> */}
            </div>
        </>
    )
}

export default PointHistoryComponent
