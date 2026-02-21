
function TagTitileComponent() {
    return (
        <>
            <div className="gap-4 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My Tags</h2>
                <div className="mt-6 gap-4 space-y-4 sm:flex sm:items-center sm:space-y-0 lg:mt-0 lg:justify-end">
                    <div>
                        <label htmlFor="order-type" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <select id="order-type" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:w-[144px]">
                            <option selected>All</option>
                            <option value="ongoing">Active</option>
                            <option value="completed">Inactive</option>
                        </select>
                    </div>
                    <span className="inline-block text-gray-500 dark:text-gray-400"> from </span>
                    <button type="button" className="w-full rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300   dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">Add Tag</button>


                </div>
            </div>

        </>
    )
}

export default TagTitileComponent
