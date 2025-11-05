import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from "react-router-dom";

import image from '../css/image.png'
import "../css/register.css"
import Grid from '@mui/material/Grid'
import { StylesProvider } from "@material-ui/core/styles";
import Box from '@mui/material/Box';
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-._!`#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?!.*[\s'"]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <StylesProvider injectFirst>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
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
                        <Grid container>
                            <Grid item className='g0' xs={12} sm={12} md={12} lg={12} xl={12} >
                                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            </Grid>
                            <Grid item className='g1' xs={12} sm={12} md={12} lg={12} xl={12} >
                                <span className='head'>Register</span>
                            </Grid>
                            {/* <h1>Register</h1> */}
                            <Grid item className='g2' xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Grid container>
                                    <form onSubmit={handleSubmit}>
                                        <Grid item className='g3' xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <label htmlFor="username">
                                                Username:
                                                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                ref={userRef}
                                                autoComplete="off"
                                                onChange={(e) => setUser(e.target.value)}
                                                value={user}
                                                required
                                                aria-invalid={validName ? "false" : "true"}
                                                aria-describedby="uidnote"
                                                onFocus={() => setUserFocus(true)}
                                                onBlur={() => setUserFocus(false)}
                                            />
                                            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                4 to 24 characters.<br />
                                                Must begin with a letter.<br />
                                                Letters, numbers, underscores, hyphens allowed.
                                            </p>
                                        </Grid>
                                        <Grid item className='g4' xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <label htmlFor="password">
                                                Password:
                                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                onChange={(e) => setPwd(e.target.value)}
                                                value={pwd}
                                                required
                                                aria-invalid={validPwd ? "false" : "true"}
                                                aria-describedby="pwdnote"
                                                onFocus={() => setPwdFocus(true)}
                                                onBlur={() => setPwdFocus(false)}
                                            />
                                        </Grid>
                                        <Grid item className='g4' xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                8 to 24 characters.<br />
                                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                            </p>
                                        </Grid>
                                        <Grid item className='g4' xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <label htmlFor="confirm_pwd">
                                                Confirm Password:
                                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                            </label>
                                            <input
                                                type="password"
                                                id="confirm_pwd"
                                                onChange={(e) => setMatchPwd(e.target.value)}
                                                value={matchPwd}
                                                required
                                                aria-invalid={validMatch ? "false" : "true"}
                                                aria-describedby="confirmnote"
                                                onFocus={() => setMatchFocus(true)}
                                                onBlur={() => setMatchFocus(false)}
                                            />
                                        </Grid>
                                        <Grid item className='g4' xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                Must match the first password input field.
                                            </p>
                                        </Grid>
                                        <Grid item className='g5' xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                                        </Grid>
                                    </form>
                                </Grid>
                            </Grid>
                            <Grid item className='g7' xs={12} sm={12} md={12} lg={12} xl={12}>
                                <p>
                                    Already registered? &nbsp;
                                    <span className="line">
                                        <Link to="/login"><span className="sup"> Sign In</span></Link>
                                    </span>
                                </p>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            )}
        </StylesProvider >
    )
}

export default Register
