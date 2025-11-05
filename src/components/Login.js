import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';



import "../css/login.css"
import Grid from '@mui/material/Grid'
import { StylesProvider } from "@material-ui/core/styles";
import Box from '@mui/material/Box';
// import TextField, { TextFieldProps } from '@mui/material/TextField';
// import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';



// import image2 from '../css/image2.png'
const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            console.log(response)
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    return (
        <StylesProvider injectFirst>
            {/* <section> */}
            <Grid container justifyContent={"center"}>
                <Box
                    className='box'
                    sx={{ border: 1, borderColor: 'black' }}
                >
                    <Grid container>
                        <Grid item className='g0' xs={12} sm={12} md={12} lg={12} xl={12} >
                            <span className='errors'><p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p></span>
                        </Grid>
                        <Grid item className='g1' xs={12} sm={12} md={12} lg={12} xl={12} >
                            <span className='head'>SignIn</span>
                        </Grid>
                        {/* <h1>Sign In</h1> */}
                        <Grid item className='g2' xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container>
                                <form onSubmit={handleSubmit}>
                                    <Grid item className='g3' xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <label htmlFor="username">Username:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            ref={userRef}
                                            autoComplete="off"
                                            onChange={(e) => setUser(e.target.value)}
                                            value={user}
                                            required
                                        />
                                    </Grid>
                                    <Grid item  className='g4' xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <label htmlFor="password">Password:</label>
                                        <input
                                            type="password"
                                            id="password"
                                            onChange={(e) => setPwd(e.target.value)}
                                            value={pwd}
                                            required
                                        />
                                    </Grid>
                                    <Grid item className='g5' xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <button>Sign In</button>
                                        {/* <Button className='sub' variant="contained">Sign In</Button> */}
                                    </Grid>
                                    {/* Persist is forced to true; hide toggle */}
                                </form>
                            </Grid>
                        </Grid>
                        <Grid item className='g7' xs={12} sm={12} md={12} lg={12} xl={12}>
                            <p>
                                Need an Account? &nbsp;
                                <span className="line">
                                    <Link to="/register"><span className="sup">  Sign Up</span></Link>
                                </span>
                            </p>
                        </Grid>
                        {/* </section> */}
                    </Grid>
                </Box>
            </Grid>
        </StylesProvider >
    )
}

export default Login
