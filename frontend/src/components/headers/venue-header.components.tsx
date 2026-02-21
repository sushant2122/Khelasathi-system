import { faChartBar, faCog, faFutbol, faHome, faImage, faInbox, faMoneyBill, faSignOut, faTag } from "@fortawesome/free-solid-svg-icons"
import logo from "../../assets/images/logo copy.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import AuthContext from "../../context/auth.context"
import userplaceholder from "../../assets/images/placeholder-user.png"
import futsalSvc from "../../services/futsal.service"
const VenueHeaderComponent = () => {
    const auth: any = useContext(AuthContext);
    console.log(auth.loggedInUser);
    const Navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        Navigate('/signin')
    };
    const apptoggleDropdown = () => {
        document.getElementById("apps-dropdown")?.classList.toggle("hidden");
    };
    const profiletoggleDropdown = () => {
        document.getElementById("dropdown")?.classList.toggle("hidden");
    };
    const [futsaldetail, setFutsalDetail] = useState<any>();

    //extract the futsalid only if role title is Venue 
    const checkFutsal = async () => {
        try {
            const response = await futsalSvc.getUserFutsalDetail()
            setFutsalDetail(response.data.result);
        } catch (exception) {
            console.log(exception);
        }
    }
    useEffect(() => {
        checkFutsal()
    }, [])

    return (
        <>
            <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="flex justify-start items-center">

                        <NavLink to="/" className="flex items-center justify-between mr-4">
                            <img src={logo} className="mr-3 h-8" alt="Flowbite Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Khela<span className="text-amber-700">Sathi</span></span>
                        </NavLink>

                    </div>
                    <div className="flex items-center lg:order-2 ">



                        {/* Apps */}
                        <div className="relative">
                            <button type="button" onClick={apptoggleDropdown} className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                                <span className="sr-only">Apps</span>
                                {/* Icon */}
                                <FontAwesomeIcon icon={faHome} />
                            </button>
                            {/* Dropdown menu */}
                            <div className="absolute right-0 w-96 hidden overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white rounded divide-y divide-gray-100 shadow-lg dark:bg-gray-700 dark:divide-gray-600 " id="apps-dropdown">
                                <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-300">
                                    Apps
                                </div>
                                <div className="grid grid-cols-3 gap-4 p-4">

                                    <NavLink to="" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                                        <FontAwesomeIcon icon={faChartBar} />
                                        <div className="text-sm text-gray-900 dark:text-white">Overview</div>
                                    </NavLink>

                                    {futsaldetail ? <>
                                        <NavLink to="booking-history" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                                            <FontAwesomeIcon icon={faInbox} />
                                            <div className="text-sm text-gray-900 dark:text-white">Bookings</div>
                                        </NavLink>

                                        <NavLink to="venue-setting" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                                            <FontAwesomeIcon icon={faCog} />
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                Futsal Settings
                                            </div>
                                        </NavLink>


                                        <NavLink to="venue-transaction" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                                            <FontAwesomeIcon icon={faMoneyBill} />
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                Transaction
                                            </div>
                                        </NavLink>

                                        <NavLink to="tag" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                                            <FontAwesomeIcon icon={faTag} />
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                Tag
                                            </div>
                                        </NavLink>

                                        <NavLink to="futsal-image" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                                            <FontAwesomeIcon icon={faImage} />
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                Futsal Images
                                            </div>
                                        </NavLink>

                                    </> : <>
                                        <NavLink to="futsal" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                                            <FontAwesomeIcon icon={faFutbol} />
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                Futsal
                                            </div>
                                        </NavLink></>}


                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <button type="button" className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" onClick={profiletoggleDropdown} >
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="w-8 h-8 rounded-full object-cover"
                                    src={auth.loggedInUser.profile_img || userplaceholder}
                                    alt="user photo"
                                />

                            </button>
                            {/* Dropdown menu */}
                            <div className=" absolute right-0 hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 " id="dropdown">
                                <div className="py-3 px-4">
                                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">{auth.loggedInUser.full_name}</span>

                                </div>
                                <ul className="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">


                                    <li>
                                        <NavLink to="venueowner-profile" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">User profile</NavLink>
                                    </li>

                                    {futsaldetail ? <>
                                        <li>
                                            <NavLink to="venue-profile" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">Futsal profile</NavLink>
                                        </li>
                                    </> : <></>}

                                    <li>
                                        <NavLink to="venue-account-setting" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">Account settings</NavLink>
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

export default VenueHeaderComponent
