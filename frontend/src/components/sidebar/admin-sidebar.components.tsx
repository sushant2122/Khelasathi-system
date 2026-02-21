import { faAddressBook, faAngleDown, faChartBar, faFileLines, faInbox, faMoneyBill, faRectangleList } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
}
const AdminSidebarComponent: React.FC<SidebarProps> = ({ isOpen }) => {

    const pagestoggleDropdown = () => {
        document.getElementById("dropdown-pages")?.classList.toggle("hidden");
    };
    return (
        <>
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`} aria-label="Sidenav" id="drawer-navigation">
                <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                    <ul className="space-y-2">
                        <li>
                            <a href="/admin" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <FontAwesomeIcon icon={faChartBar} />
                                <span className="ml-3">Overview</span>
                            </a>
                        </li>
                        <li>
                            <button type="button" className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-pages" onClick={pagestoggleDropdown}>
                                <FontAwesomeIcon icon={faFileLines} />&ensp;
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">Manage Contents</span>&ensp;
                                <FontAwesomeIcon icon={faAngleDown} />
                            </button>
                            <ul id="dropdown-pages" className="hidden py-2 space-y-2">
                                <li>
                                    <NavLink to="banner" className="flex items-center p-2 pl-11 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"><FontAwesomeIcon icon={faRectangleList} />&ensp;Banner</NavLink>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <NavLink to="transaction" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <FontAwesomeIcon icon={faMoneyBill} />
                                <span className="flex-1 ml-3 whitespace-nowrap">Transactions</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="booking" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <FontAwesomeIcon icon={faInbox} />
                                <span className="flex-1 ml-3 whitespace-nowrap">Bookings</span>
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">

                        <li>
                            <NavLink to="futsal-verification" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                                <FontAwesomeIcon icon={faAddressBook} />
                                <span className="ml-3">Futsal Approvals</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

            </aside>

        </>
    )
}

export default AdminSidebarComponent
