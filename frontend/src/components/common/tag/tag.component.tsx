import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TagInterface {
    tagname: string
}
function TagComponent(props: TagInterface) {
    return (
        <>
            <div className="flex items-center bg-gray-300 px-4 py-2 rounded-lg w-full">
                <FontAwesomeIcon className="text-amber-700" icon={faTag} size="lg" />&ensp;
                <h3 className="text-sm text-gray-500 dark:text-gray-400 flex-1">{props.tagname}</h3>
            </div>

        </>
    )
}
export default TagComponent