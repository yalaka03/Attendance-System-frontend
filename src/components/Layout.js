import { Outlet, useLocation } from "react-router-dom"
import PersistentDrawerLeft from "./Navbar"
// import Paper from 'material-ui/Paper';
import '../css/index.jpeg';
import GlobalLoader from "./GlobalLoader";

const Layout = () => {
    const location = useLocation();
    const hideNav = location.pathname === '/login';
    return (


        // <Paper style={styles.paperContainer}>
            <div>
                <GlobalLoader />
                {hideNav ? null : <PersistentDrawerLeft />}
                <main className={hideNav ? "App login-page" : "App"}>
                    <Outlet />
                </main>
            </div>
        // </Paper>
        

    )
}

export default Layout
