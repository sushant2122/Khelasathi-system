
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export interface Serviceelements {
    icon: any,
    title: string,

}
function ServicesCardComponent(props: Serviceelements) {
    return (
        <>
            <div className="p-4 px-7 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 rounded bg-gray-200 flex flex-col items-center justify-center">
                <FontAwesomeIcon size="5x" icon={props.icon} className="text-amber-700 mb-4" />
                <h2 className="text-gray-900 text-center text-xl font-semibold">{props.title}</h2>
            </div>

        </>
    )
}

export default ServicesCardComponent
