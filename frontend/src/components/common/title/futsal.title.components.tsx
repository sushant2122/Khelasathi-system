
function FutsalTitleComponent() {
    const sorttoggleDropdown = () => {
        document.getElementById("dropdownSort1")?.classList.toggle("hidden");
    };
    return (
        <>
            <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
                <div>

                    <h2 className="mt-3 text-2xl  font-medium text-amber-700 rounded-lg px-4  p-2 dark:text-white sm:text-2xl">Futsals</h2>
                </div>
                <div className="flex items-center space-x-4">
                    {/* 
                    <div className="relative">
                        <button id="sortDropdownButton1" onClick={sorttoggleDropdown} data-dropdown-toggle="dropdownSort1" type="button" className=" flex w-full items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-white bg-gray-400  hover:bg-amber-700 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
                            <FontAwesomeIcon icon={faSort} /> &ensp;
                            Sort &ensp;
                            <FontAwesomeIcon icon={faAngleDown} />
                        </button>
                        <div id="dropdownSort1" className="absolute z-50 hidden w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700" data-popper-placement="bottom">
                            <ul className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400" aria-labelledby="sortDropdownButton">
                                <li>
                                    <a href="#" className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-amber-700  hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> The most popular </a>
                                </li>
                                <li>
                                    <a href="#" className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-amber-700  hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Newest </a>
                                </li>
                                <li>
                                    <a href="#" className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-amber-700  hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Increasing price </a>
                                </li>
                                <li>
                                    <a href="#" className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-amber-700  hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Decreasing price </a>
                                </li>

                                <li>
                                    <a href="#" className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-amber-700  hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"> Discount % </a>
                                </li>
                            </ul>
                        </div>
                    </div> */}

                </div>
            </div>
        </>
    )
}

export default FutsalTitleComponent