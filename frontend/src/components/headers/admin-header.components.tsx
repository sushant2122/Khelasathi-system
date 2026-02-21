import { faBars, faSignOut } from "@fortawesome/free-solid-svg-icons"
import logo from "../../assets/images/logo copy.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink, useNavigate } from "react-router-dom"
import { useContext } from "react";
import AuthContext from "../../context/auth.context";


interface HeaderProps {
    toggleSidebar: () => void;
}
// const Navigate = useNavigate();
const AdminHeaderComponent: React.FC<HeaderProps> = ({ toggleSidebar }) => {

    const Navigate = useNavigate();
    const auth: any = useContext(AuthContext);
    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        Navigate('/signin')
    };

    const profiletoggleDropdown = () => {
        document.getElementById("dropdown")?.classList.toggle("hidden");
    };

    return (
        <>
            <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="flex justify-start items-center">
                        <button onClick={toggleSidebar} aria-controls="drawer-navigation" className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <FontAwesomeIcon icon={faBars} />
                            <span className="sr-only">Toggle sidebar</span>
                        </button>
                        <a href="https://flowbite.com" className="flex items-center justify-between mr-4">
                            <img src={logo} className="mr-3 h-8" alt="Flowbite Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Khela<span className="text-amber-700">Sathi</span></span>
                        </a>

                    </div>
                    <div className="flex items-center lg:order-2 ">






                        <div className="relative">
                            <button type="button" className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" onClick={profiletoggleDropdown} >
                                <span className="sr-only">Open user menu</span>
                                <img className="w-8 h-8 rounded-full" src={auth.loggedInUser.profile_img} alt="user photo" />
                            </button>
                            {/* Dropdown menu */}
                            <div className=" absolute right-0 hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 " id="dropdown">
                                <div className="py-3 px-4">
                                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">{auth.loggedInUser.full_name}</span>

                                </div>
                                <ul className="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">

                                    <li>
                                        <NavLink to="setting" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">Account settings</NavLink>
                                    </li>
                                </ul>

                                <ul className="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
                                    <li>
                                        <button onClick={logout} className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out &ensp;
                                            <FontAwesomeIcon icon={faSignOut} />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>


        </>
    )
}

export default AdminHeaderComponent
