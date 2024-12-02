import { Outlet } from "react-router-dom"
import Header from "./header"
import Footer from "./footer"
import './layout.css'

const Layout = () => {
    return (
        <div className="app-layout">
            <Header />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Layout
