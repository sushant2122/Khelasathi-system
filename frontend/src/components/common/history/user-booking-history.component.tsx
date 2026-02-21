import { faCalendar, faCheck, faMinus, faPlus, faRepeat, faWallet, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink } from "react-router-dom"
interface BookingHistoryComponentInterface {
    name: string,
    link: string,
    date: string,
    type: string,
    paymenttype: string,
    point: string

}

function UserBookingHistoryComponent(props: BookingHistoryComponentInterface) {
    return (
        <>
            <div className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-4 lg:grid-cols-5">
                <div className="col-span-2 content-center sm:col-span-4 lg:col-span-1">
                    <NavLink to="/futsal" className="text-base font-semibold text-gray-900 hover:underline dark:text-white">{props.name}</NavLink>
                </div>
                <div className="content-center">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{props.date}</p>
                    </div>
                </div>

                <div className="content-center">

                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faWallet} />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{props.paymenttype}</p>
                    </div>
                </div>


                <div className="absolute right-0 top-14 content-center sm:relative sm:right-auto sm:top-auto">
                    <span className="inline-flex items-center rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        <FontAwesomeIcon icon={props.paymenttype === "point" ? faMinus : faPlus} />
                        &ensp;{props.point}
                    </span>
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
                {/* <div className="col-span-2 content-center sm:col-span-1 sm:justify-self-end">

                    <div className="relative">
                        <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button"><FontAwesomeIcon icon={faPenToSquare} />&ensp;Edit  &ensp; <FontAwesomeIcon icon={faAngleDown} />
                        </button>
                        {/* Dropdown menu */}
                {/* <div id="dropdownHover" className="absolute z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                                <li>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                                </li>
                            </ul>
                        </div> */}
                {/* </div> */}


                {/* </div> */}
            </div>
        </>
    )
}

export default UserBookingHistoryComponent
