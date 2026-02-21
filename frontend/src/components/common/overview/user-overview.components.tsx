import { faBan, faCalendar, faClock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
interface OverviewComponent {
    booking: number,
    slots: number,
    cancelled: number
}
function UserOverviewComponent(props: OverviewComponent) {
    return (
        <>
            <div className="grid grid-cols-2 gap-6 border-b border-t border-gray-200 py-4 dark:border-gray-700 md:py-8 lg:grid-cols-3 xl:gap-16">
                <div>
                    <FontAwesomeIcon className="text-amber-700" icon={faCalendar} size="2x" />
                    <h3 className="mb-2 text-gray-500 dark:text-gray-400">Bookings made</h3>
                    <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">{props.booking}
                    </span>

                </div>
                <div>
                    <FontAwesomeIcon className="text-amber-700" icon={faClock} size="2x" />
                    <h3 className="mb-2 text-gray-500 dark:text-gray-400">Total Booked Slots</h3>
                    <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">{props.slots}

                    </span>

                </div>
                <div>
                    <FontAwesomeIcon className="text-amber-700" icon={faBan} size="2x" />
                    <h3 className="mb-2 text-gray-500 dark:text-gray-400">Cancelled</h3>
                    <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">{props.cancelled}

                    </span>
                </div>
            </div>

        </>
    )
}

export default UserOverviewComponent
