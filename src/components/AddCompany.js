import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Country, State, City } from 'country-state-city';
import { TextField, Box, Paper, Typography, Divider, Checkbox, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import imageToBase64 from 'image-to-base64/browser';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/addcompany.css";
import { StylesProvider } from "@material-ui/core/styles";

const PIN_REGEX = /^[0-9]{1,7}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-._!`#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?!.*[\s'"]).{8,24}$/;
const EMAIL_REGEX = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/
const AddCompany_URL = "company/addcompany"

const AddCompany = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = Boolean(location.state?.edit && location.state?.reg_no);
    const inputFocus = useRef()
    const [success, setSuccess] = useState(false)
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [countryb, setCountryb] = useState("")
    const [stateb, setStateb] = useState("")
    const [cityb, setCityb] = useState("")
    const [phonenumber, setPhonenumber] = useState("")
    const [phonenumbererr, setPhonenumbererr] = useState(false)
    const [countrylist, setCountrylist] = useState([])
    const [statelist, setStatelist] = useState([])
    const [citylist, setCitylist] = useState([])
    const [statelistb, setStatelistb] = useState([])
    const [citylistb, setCitylistb] = useState([])
    const [zip, setZip] = useState("")
    const [ziperr, setZiperr] = useState(false)
    const [address, setAddress] = useState("")
    const [zipb, setZipb] = useState("")
    const [zipberr, setZipberr] = useState(false)
    const [addressb, setAddressb] = useState("")
    const [emailIderr, setEmailIderr] = useState(false)
    const [passworderr, setPassworderr] = useState(false)
    const [checked, setChecked] = useState(false);
    const [img, setImg] = useState("");
    const [existingLogo, setExistingLogo] = useState("");
    const [newLogoSelected, setNewLogoSelected] = useState(false);
    const [imgerr, setImgerr] = useState("");
    const onImageChange = (e) => {
        const [file] = e.target.files;
        setImg(URL.createObjectURL(file));
        setNewLogoSelected(true);
    };
    const [formError, setFormError] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        let submit = 1;
        if (!isValidPhoneNumber(phonenumber)) {
            setPhonenumbererr("Enter a valid Phone number");
            submit = 0
        }
        else {
            setPhonenumbererr("");
        }
        if (!PIN_REGEX.test(zip)) {
            setZiperr("Enter a valid Zip code");
            submit = 0
        }
        else {
            setZiperr("");
        }
        if (!PIN_REGEX.test(zipb)) {
            setZipberr("Enter a valid Zip code");
            submit = 0
        }
        else {
            setZipberr("");
        }
        if (!EMAIL_REGEX.test(document.getElementById("emailid").value)) {
            setEmailIderr("Enter a valid email ID");
            submit = 0
        }
        else {
            setEmailIderr("");
        }
        const isEditModeValidate = Boolean(location.state?.edit && location.state?.reg_no);
        const pwdVal = document.getElementById("password").value;
        if (isEditModeValidate && pwdVal === "") {
            setPassworderr("");
        } else {
            if (!PWD_REGEX.test(pwdVal)) {
                setPassworderr("Password must contain atleast one lowercase letter, atleast one Upper case letter , atleast one number , atleast one special character and must be a minimum length of 8 characters. No spaces or quotes are allowed");
                submit = 0
            } else {
                setPassworderr("");
            }
        }
        let image_string = "";
        const isEdit = Boolean(location.state?.edit && location.state?.reg_no);
        if (isEdit) {
            if (newLogoSelected && img) {
                try {
                    image_string = await imageToBase64(img);
                    setImgerr("");
                } catch (error) {
                    setImgerr("Choose an Image file");
                    console.log(error);
                    submit = 0;
                }
            } else {
                image_string = existingLogo || "";
            }
        } else {
            if (!img) {
                setImgerr("Choose an Image file");
                submit = 0;
            } else {
                try {
                    image_string = await imageToBase64(img)
                    setImgerr("")
                } catch (error) {
                    setImgerr("Choose an Image file");
                    console.log(error)
                    submit = 0;
                }
            }
        }
        if (submit === 0) {
            setFormError("Please fix the highlighted errors and try again.");
            return;
        }
        setFormError("");

        const newCompany = {
            reg_no: document.getElementById("registrationnum").value,
            comp_name: document.getElementById("companyname").value,
            isActive: document.getElementById("active").checked,
            logo: image_string,
            dp_email: document.getElementById("emailid").value,
            password: document.getElementById("password").value,
            dp_firstName: document.getElementById("firstname").value,
            dp_lastName: document.getElementById("lastname").value,
            dp_phoneNum: phonenumber,
            country: country,
            state: statelist.length ? state : "",
            city: citylist.length ? city : "",
            zipcode: parseInt(zip, 10),
            address: address,
            billing_address: addressb,
            billing_country: countryb,
            billing_state: statelistb.length ? stateb : "",
            billing_city: citylistb.length ? cityb : "",
            billing_zipcode: parseInt(zipb, 10)
        }
        try {
            const isEditMode = Boolean(location.state?.edit && location.state?.reg_no);
            if (isEditMode) {
                await axiosPrivate.post('/company/updatecompany', newCompany);
            } else {
                await axiosPrivate.post(AddCompany_URL, newCompany);
            }
            setSuccess(true)
        }
        catch (err) {
            if (!err?.response) {
                alert("No server connected")
            }
            else if (err?.response?.status === 409) {
                const errorMsg = err?.response?.data?.message || "Username or registration number already exists. Please choose different values.";
                alert(errorMsg)
            }
            else if (err?.response?.data?.message) {
                alert(err.response.data.message)
            }
            else if (err?.response?.message) {
                alert(err.response.message)
            }
            else {
                alert("An error occurred. Please try again.")
                console.log(err)
            }
        }
    }
    
    const handlecancel = () => {
        navigate('/companylisting/1');
    }
    
    useEffect(() => {
        setCountrylist(Country.getAllCountries().map((element) => { return { value: element.isoCode, label: element.name }; }))
        inputFocus.current.focus()
    }, [])
    
    useEffect(() => {
        setStatelist(State.getStatesOfCountry(country).map((element) => { return { value: element.isoCode, label: element.name }; }));
    }, [country])
    
    useEffect(() => {
        setStatelistb(State.getStatesOfCountry(countryb).map((element) => { return { value: element.isoCode, label: element.name }; }))
    }, [countryb])

    // Prefill for edit mode
    useEffect(() => {
        const reg_no = location.state?.reg_no;
        if (!location.state?.edit || !reg_no) return;
        const fetchDetails = async () => {
            try {
                const res = await axiosPrivate.post('/company/details', { reg_no });
                const c = res?.data?.data;
                if (!c) return;
                // Set states for selects and controlled fields
                setCountry(c.country || "");
                setState(c.state || "");
                setCity(c.city || "");
                setZip(String(c.zipcode ?? ""));
                setAddress(c.address || "");
                setCountryb(c.billing_country || "");
                setStateb(c.billing_state || "");
                setCityb(c.billing_city || "");
                setZipb(String(c.billing_zipcode ?? ""));
                setAddressb(c.billing_address || "");
                setPhonenumber(c.dp_phoneNum || "");
                setExistingLogo(c.logo || "");
                setImg(c.logo ? `data:image/png;base64,${c.logo}` : "");
                // Set uncontrolled TextField values directly
                const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ""; };
                setVal('companyname', c.comp_name);
                setVal('registrationnum', c.reg_no);
                const activeEl = document.getElementById('active'); if (activeEl) activeEl.checked = !!c.isActive;
                setVal('firstname', c.dp_firstName);
                setVal('lastname', c.dp_lastName);
                setVal('emailid', c.dp_email);
                // Do not prefill password for security
            } catch (e) {
                console.log(e);
            }
        };
        fetchDetails();
    }, [location.state, axiosPrivate])
    
    useEffect(() => {
        setCitylist(City.getCitiesOfState(country, state).map((element) => { return { value: element.name, label: element.name }; }))
    }, [country, state])
    
    useEffect(() => {
        if (checked) {
            setCountryb(country);
            setStateb(state);
            setCityb(city);
            setZipb(zip)
            setAddressb(address)
        }
    }, [country, state, city, zip, address, checked])
    
    useEffect(() => {
        if (checked) {
            setChecked(false);
        }
        if (country === countryb && state === stateb && city === cityb && zip === zipb && address === addressb) {
            if (!country) {
                setChecked(false);
            }
            else {
                setChecked(true);
            }
        }
    }, [countryb, stateb, cityb, zipb, addressb, country, state, city, zip, address])

    useEffect(() => {
        setCitylistb(City.getCitiesOfState(countryb, stateb).map((element) => { return { value: element.name, label: element.name }; }))
    }, [countryb, stateb])

    return (
        <StylesProvider injectFirst>
            <Box sx={{ maxWidth: '1400px', margin: '2rem auto', padding: '2rem 1rem' }}>
                {success ? (
                    <Paper 
                        elevation={3}
                        sx={{ 
                            padding: '3rem', 
                            textAlign: 'center',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
                        }}
                    >
                        <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700, marginBottom: '1rem' }}>
                            Successfully Added!
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#475569', marginBottom: '2rem' }}>
                            Company has been added successfully. Click below to return to the list.
                        </Typography>
                        <Button 
                            variant="contained"
                            onClick={(e) => { navigate('/companylisting/1') }}
                            sx={{
                                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
                                color: 'white',
                                fontWeight: 600,
                                padding: '0.875rem 2.5rem',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4338ca 0%, #5b21b6 50%, #6d28d9 100%)',
                                    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            Go to Company List
                        </Button>
                    </Paper>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {formError && (
                            <Box sx={{ 
                                mb: 3, 
                                p: 2, 
                                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #ef4444'
                            }}>
                                <Typography sx={{ color: '#991b1b', fontWeight: 600 }}>
                                    {formError}
                                </Typography>
                            </Box>
                        )}

                        {/* Header */}
                        <Paper 
                            elevation={2}
                            sx={{ 
                                padding: '1.5rem', 
                                marginBottom: '2rem',
                                borderRadius: '16px',
                                background: '#ffffff'
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontSize: '1.8rem',
                                    fontWeight: 700, 
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    marginBottom: '1rem'
                                }}
                            >
                                Company Information
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <Checkbox
                                    id="active"
                                    sx={{
                                        color: '#4f46e5',
                                        '&.Mui-checked': {
                                            color: '#4f46e5',
                                        }
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    Active Company
                                </Typography>
                            </Box>
                            
                        </Paper>

                        <Grid container spacing={3}>
                            {/* Left Column */}
                            <Grid item xs={12} lg={8}>
                                {/* Company Details */}
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        padding: '2rem', 
                                        borderRadius: '16px',
                                        background: '#ffffff',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
                                        Company Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="companyname"
                                                type="text"
                                                fullWidth
                                                required
                                                label="Company Name"
                                                ref={inputFocus}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="registrationnum"
                                                type="text"
                                                fullWidth
                                                required
                                                label="Registration Number"
                                                disabled={isEditMode}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Company Address */}
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        padding: '2rem', 
                                        borderRadius: '16px',
                                        background: '#ffffff',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
                                        Company Address
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="country"
                                                select
                                                fullWidth
                                                required
                                                label="Country"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                SelectProps={{ native: true }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {countrylist.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="state"
                                                select
                                                fullWidth
                                                required
                                                label="State"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                SelectProps={{ native: true }}
                                                disabled={!statelist.length}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {statelist.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="city"
                                                select
                                                fullWidth
                                                required
                                                label="City"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                SelectProps={{ native: true }}
                                                disabled={!citylist.length}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {citylist.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="zipcode"
                                                type="text"
                                                fullWidth
                                                required
                                                label="ZIP/PIN Code"
                                                value={zip}
                                                onChange={(e) => setZip(e.target.value)}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                            {ziperr && (
                                                <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', marginTop: '0.5rem' }}>
                                                    {ziperr}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="address"
                                                type="text"
                                                required
                                                fullWidth
                                                label="Address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Billing Address */}
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        padding: '2rem', 
                                        borderRadius: '16px',
                                        background: '#ffffff',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                            Billing Address
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Checkbox
                                                checked={checked}
                                                onChange={(e) => { 
                                                    setChecked(e.target.checked); 
                                                    if (e.target.checked) { 
                                                        setCountryb(country); 
                                                        setStateb(state); 
                                                        setCityb(city); 
                                                        setZipb(zip); 
                                                        setAddressb(address); 
                                                    } 
                                                }}
                                                sx={{
                                                    color: '#4f46e5',
                                                    '&.Mui-checked': {
                                                        color: '#4f46e5',
                                                    }
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                                                Same as Company Address
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="countryb"
                                                select
                                                fullWidth
                                                required
                                                label="Country"
                                                value={countryb}
                                                onChange={(e) => setCountryb(e.target.value)}
                                                SelectProps={{ native: true }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {countrylist.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="stateb"
                                                select
                                                fullWidth
                                                required
                                                label="State"
                                                value={stateb}
                                                onChange={(e) => setStateb(e.target.value)}
                                                SelectProps={{ native: true }}
                                                disabled={!statelistb.length}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {statelistb.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="cityb"
                                                select
                                                fullWidth
                                                required
                                                label="City"
                                                value={cityb}
                                                onChange={(e) => setCityb(e.target.value)}
                                                SelectProps={{ native: true }}
                                                disabled={!citylistb.length}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {citylistb.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="zipcodeb"
                                                fullWidth
                                                type="text"
                                                required
                                                label="ZIP/PIN Code"
                                                value={zipb}
                                                onChange={(e) => setZipb(e.target.value)}
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                            {zipberr && (
                                                <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', marginTop: '0.5rem' }}>
                                                    {zipberr}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="addressb"
                                                type="text"
                                                fullWidth
                                                required
                                                label="Address"
                                                value={addressb}
                                                onChange={(e) => setAddressb(e.target.value)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={12} lg={4}>
                                {/* Logo Upload */}
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        padding: '2rem', 
                                        borderRadius: '16px',
                                        background: '#ffffff',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
                                        Company Logo
                                    </Typography>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <input 
                                            type="file" 
                                            id="image" 
                                            accept="image/*" 
                                            style={{ display: "none" }} 
                                            onChange={onImageChange} 
                                        />
                                        {Boolean(img) && (
                                            <Box sx={{ marginBottom: '1.5rem' }}>
                                                <img 
                                                    src={img} 
                                                    alt="Company logo preview" 
                                                    style={{ 
                                                        width: '100%', 
                                                        maxWidth: '300px', 
                                                        height: 'auto',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                                    }} 
                                                />
                                            </Box>
                                        )}
                                        <Button 
                                            variant="outlined"
                                            onClick={(e) => { document.getElementById("image").click() }}
                                            sx={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                borderRadius: '12px',
                                                borderColor: '#4f46e5',
                                                color: '#4f46e5',
                                                fontWeight: 600,
                                                borderWidth: '2px',
                                                '&:hover': {
                                                    borderWidth: '2px',
                                                    borderColor: '#4338ca',
                                                    background: 'rgba(79, 70, 229, 0.05)',
                                                }
                                            }}
                                        >
                                            {img ? 'Change Logo' : 'Upload Logo'}
                                        </Button>
                                        {imgerr && (
                                            <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', marginTop: '0.5rem' }}>
                                                {imgerr}
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>

                                {/* Designated Person */}
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        padding: '2rem', 
                                        borderRadius: '16px',
                                        background: '#ffffff'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
                                        Designated Person
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="firstname"
                                                type="text"
                                                fullWidth
                                                required
                                                label="First Name"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="lastname"
                                                type="text"
                                                fullWidth
                                                required
                                                label="Last Name"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: '#64748b', marginBottom: '0.5rem', fontWeight: 500 }}>
                                                    Phone Number
                                                </Typography>
                                                <PhoneInput
                                                    international
                                                    countryCallingCodeEditable={false}
                                                    defaultCountry="IN"
                                                    value={phonenumber}
                                                    onChange={setPhonenumber}
                                                    disabled={isEditMode}
                                                />
                                                {phonenumbererr && (
                                                    <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', marginTop: '0.5rem' }}>
                                                        {phonenumbererr}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="emailid"
                                                type="email"
                                                required
                                                fullWidth
                                                label="Email ID (Username)"
                                                disabled={isEditMode}
                                                autoComplete="off"
                                                inputProps={{ autoComplete: "off" }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                            {emailIderr && (
                                                <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', marginTop: '0.5rem' }}>
                                                    {emailIderr}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="password"
                                                type="password"
                                                required
                                                fullWidth
                                                label="Choose Password"
                                                disabled={isEditMode}
                                                autoComplete="new-password"
                                                inputProps={{ autoComplete: "new-password" }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        backgroundColor: '#ffffff',
                                                        padding: '0 8px',
                                                        marginLeft: '-4px',
                                                    }
                                                }}
                                            />
                                            {passworderr && (
                                                <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                                    {passworderr}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Action Buttons */}
                        <Paper 
                            elevation={2}
                            sx={{ 
                                padding: '1.5rem 2rem', 
                                borderRadius: '16px',
                                background: '#ffffff',
                                marginTop: '2rem'
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                <Button 
                                    variant="outlined"
                                    type="button" 
                                    onClick={handlecancel}
                                    sx={{
                                        padding: '0.875rem 2rem',
                                        borderRadius: '12px',
                                        borderColor: '#cbd5e1',
                                        color: '#475569',
                                        fontWeight: 600,
                                        borderWidth: '2px',
                                        minWidth: '150px',
                                        '&:hover': {
                                            borderWidth: '2px',
                                            borderColor: '#ef4444',
                                            background: 'rgba(239, 68, 68, 0.05)',
                                            color: '#dc2626',
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="contained" 
                                    type="submit"
                                    sx={{
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
                                        color: 'white',
                                        fontWeight: 600,
                                        padding: '0.875rem 2.5rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
                                        minWidth: '150px',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4338ca 0%, #5b21b6 50%, #6d28d9 100%)',
                                            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                >
                                    Save Company
                                </Button>
                            </Box>
                        </Paper>
                    </form>
                )}
            </Box>
        </StylesProvider>
    )
}

export default AddCompany
