import { faCalendar, faCheck, faPenToSquare, faRepeat, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
interface BookingHistoryComponentInterface {
    id: string,
    date: string,
    type: string,

}

function BookingHistoryComponent(props: BookingHistoryComponentInterface) {
    return (
        <>
            <div className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-4 lg:grid-cols-5">
                <div className="col-span-2 content-center sm:col-span-4 lg:col-span-1">
                    <a href="#" className="text-base font-semibold text-gray-900 hover:underline dark:text-white">{props.id}</a>
                </div>
                <div className="content-center">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{props.date}</p>
                    </div>
                </div>

                <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto">
                    {props.type === "rescheduled" && (
                        <span className="inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                            <FontAwesomeIcon icon={faRepeat} className="mr-1" />
                            Rescheduled
                        </span>
                    )}

                    {props.type === "completed" && (
                        <span className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            <FontAwesomeIcon icon={faCheck} className="mr-1" />
                            Completed
                        </span>
                    )}

                    {props.type === "cancelled" && (
                        <span className="inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                            <FontAwesomeIcon icon={faXmark} className="mr-1" />
                            Cancelled
                        </span>
                    )}
                </div>
                <div className="col-span-2 content-center sm:col-span-1 sm:justify-self-end">
                    <button type="button" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-amber-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"><FontAwesomeIcon icon={faPenToSquare} />&ensp;Edit</button>
                </div>
            </div>
        </>
    )
}

export default BookingHistoryComponent
