import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faMapPin, faPhone } from "@fortawesome/free-solid-svg-icons";
//import { faMoneyBill } from "@fortawesome/free-solid-svg-icons/faMoneyBill";
import { NavLink } from "react-router-dom";
interface FutsalCardElement {
    discount?: string,
    name: string,
    image: string,

    // amount: string,
    link: string,
    location: string,
    contact: string

}

function FutsalCardComponent(props: FutsalCardElement) {

    return (
        <>



            <div className="rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="h-56 w-full">
                    <a href="#">
                        <img className="mx-auto rounded-lg h-full dark:hidden" src={props.image} />
                    </a>
                </div>
                <div className="pt-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        {(props.discount) ? <>
                            <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> Up to {props.discount} off </span>
                        </> : <>  </>}

                    </div>
                    <NavLink to={props.link} className="text-lg font-medium leading-tight text-gray-900 hover:text-amber-700 hover:underline dark:text-white">{props.name}</NavLink>

                    {/* for the tags */}
                    <ul className="mt-2 flex items-center gap-4">
                        {(props.contact) ? <>
                            <li className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faPhone} />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{props.contact}</p>
                            </li>
                        </> : <>  </>}
                    </ul>
                    <ul className="mt-2 flex items-center gap-4">
                        {(props.location) ? <>
                            <li className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapPin} />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400"> {props.location}</p>
                            </li>
                        </> : <>  </>}
                    </ul>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        {/* <p className="text-2xl font-edium leading-tight text-gray-900 dark:text-white">रु&ensp;{props.amount}</p> */}
                        <NavLink to={props.link} type="button" className="w-full inline-flex items-center justify-center rounded-lg bg-gray-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:bg-amber-700">

                            Book Now&ensp;
                            <FontAwesomeIcon icon={faArrowRight} />
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FutsalCardComponent

