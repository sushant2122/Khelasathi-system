import { Outlet } from "react-router-dom"
import FooterComponent from "../../components/footers/footer.component"
import HeaderComponent from "../../components/headers/header.components"

function HomeLayout() {
    return (
        <>
            <HeaderComponent />
            <Outlet />
            <FooterComponent />

        </>
    )
}

export default HomeLayout
