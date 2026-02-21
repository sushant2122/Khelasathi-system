import { Outlet } from "react-router-dom"
import VenueHeaderComponent from "../../components/headers/venue-header.components";
import FooterComponent from "../../components/footers/footer.component";

function VenueLayout() {
    return (
        <>
            <div className="antialiased bg-gray-50 dark:bg-gray-900">
                <VenueHeaderComponent />
                <main className=" h-auto pt-20">
                    <Outlet />
                </main>
                <FooterComponent />
            </div>
        </>
    )
}
export default VenueLayout
