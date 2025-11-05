import { useNavigate } from "react-router-dom"
import useLogout from "../hooks/useLogout";

import image from '../css/image.png'
import "../css/unauthorized.css"
import Grid from '@mui/material/Grid'
import { StylesProvider } from "@material-ui/core/styles";
import Box from '@mui/material/Box';
const Unauthorized = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    const goBack = () => navigate(-1);

    return (
        // <section>
        <StylesProvider injectFirst>
            {/* <section> */}
            <Grid container justifyContent={"center"}>
                <Box
                    className='boxes'
                    component="img"
                    src={image}
                />
                <Box
                    className='box'
                    sx={{ border: 1, borderColor: 'black' }}
                >
                    <Grid container justifyContent={"center"}>
                        <Grid item className='gu1' xs={12} sm={12} md={12} lg={12} xl={12} >
                            <span className='head1'>Unauthorized</span>
                        </Grid>
                        <Grid item className='gu1' xs={12} sm={12} md={12} lg={12} xl={12} >
                        <span className='texter'>You do not have access to the requested page.</span>
                        </Grid>
                        <Grid item className='gu5' xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="flexGrow">
                                <button className="buttons1" onClick={goBack}>Go Back</button>
                            </div>
                        </Grid>
                        <Grid item className='gu5' xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="flexGrow">
                                <button className="buttons1" onClick={signOut}>logout</button>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        {/* // </section> */}
        </StylesProvider>
    )
}

export default Unauthorized
