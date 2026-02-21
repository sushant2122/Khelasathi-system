import { Outlet } from "react-router-dom"
import AdminHeaderComponent from "../../components/headers/admin-header.components"
import AdminSidebarComponent from "../../components/sidebar/admin-sidebar.components"
import { useState } from "react";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev: any) => !prev);
    };
    return (
        <>
            <div className="antialiased bg-gray-50 dark:bg-gray-900">
                <AdminHeaderComponent toggleSidebar={toggleSidebar} />
                <AdminSidebarComponent isOpen={isSidebarOpen} />
                <main className="p-4 md:ml-64 h-auto pt-20">
                    <Outlet />
                </main>
            </div>


        </>
    )
}

export default AdminLayout
