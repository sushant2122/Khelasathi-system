import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

export interface TitleComponentProps {
    title: string;
    link?: string;
}

const TitleComponent = (props: TitleComponentProps) => {
    return (
        <>
            <div className="mt-1  bg-white p-3 rounded-2xl flex justify-between ">
                <h1 className="text-2xl font-medium text-amber-700  pointer-events-none">{props.title}</h1>
                {(props.link) ? <>  <NavLink to={props.link} className="font-light text-gray-900 hover:bg-amber-700 hover:text-white rounded-xl p-1"> View all  &ensp;


                    <FontAwesomeIcon icon={faArrowRight} />
                </NavLink></> : <></>}


            </div>
        </>
    )
}


export default TitleComponent
