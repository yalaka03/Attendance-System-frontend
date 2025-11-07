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
            <Grid container className="login-wrapper" justifyContent="center" alignItems="center">
    {/* LEFT PANEL: demo info */}
    <Grid item xs={12} sm={5} md={5} lg={5} xl={5} className="login-info-panel">
        <Box className="info-content">
            <h2>Demo Login Info</h2>
            <p>You can log in with any of these roles:</p>
            <ul>
                <li><b>Admin</b> – Can add companies <br/> An Admin can add Company, whose designated person can login to see their employees </li>
                    <ul><li>Username: Admin , password : Admin</li></ul>
                <li><b>Company</b> – Manage employees, add employees and see their attendance</li>
                    <ul>
                        <li>Username: mark.zukerberg@facebook.com, password : A@b123456</li>
                        <li>Username: sundhar.pichai@google.com, password : A@b123456</li>
                        <li>Username: tim.cook@apple.com, password : A@b123456</li>
                </ul>
                <li><b>Employee</b> – View personal dashboard</li>
                <ul>
                        <li>Username: mark.zukerberg@facebook.com, password : A@b123456</li>
                        <li>Username: sundhar.pichai@google.com, password : A@b123456</li>
                        <li>Username: tim.cook@apple.com, password : A@b123456</li>
                </ul>
            </ul>
            <p>Everything is done by jwt security and routes, so unintended access gives unauthorized</p>
        </Box>
    </Grid>

    {/* RIGHT PANEL: your existing login box */}
    <Grid item xs={12} sm={7} md={7} lg={7} xl={7} className="login-form-panel">
        <Grid container justifyContent={"center"}>
            <Grid item>
                <Box
                    className='box'
                    sx={{ border: 1, borderColor: 'black' }}
                >
                    <Grid container>
                        <Grid item className='g0' xs={12}>
                            <span className='errors'>
                                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            </span>
                        </Grid>
                        <Grid item className='g1' xs={12}>
                            <span className='head'>SignIn</span>
                        </Grid>
                        <Grid item className='g2' xs={12}>
                            <Grid container>
                                <form onSubmit={handleSubmit}>
                                    <Grid item className='g3' xs={12}>
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
                                    <Grid item className='g4' xs={12}>
                                        <label htmlFor="password">Password:</label>
                                        <input
                                            type="password"
                                            id="password"
                                            onChange={(e) => setPwd(e.target.value)}
                                            value={pwd}
                                            required
                                        />
                                    </Grid>
                                    <Grid item className='g5' xs={12}>
                                        <button>Sign In</button>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                        <Grid item className='g7' xs={12}>
                            <p>
                                Need an Account? &nbsp;
                                <span className="line">
                                    <Link to="/register"><span className="sup">Sign Up</span></Link>
                                </span>
                            </p>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    </Grid>
</Grid>

        
        </StylesProvider >
    )
}

export default Login
