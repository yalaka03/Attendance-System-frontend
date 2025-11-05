import { Button, Checkbox, TextField, Box, Paper, Typography, Divider, LinearProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import Grid from "@mui/material/Grid";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import imageToBase64 from 'image-to-base64/browser';
import "../css/addemployee.css";
import { StylesProvider } from "@material-ui/core/styles";

// Helper function to create thumbnail from base64 image
const createThumbnail = (imageSrc, maxSize = 150) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(imageSrc); // fallback to original
        img.src = imageSrc;
    });
};

const AddEmployee = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const isEdit = Boolean(location.state?.edit && location.state?.employee);
    const inputFocus = useRef();
    const [phonenumber, setPhonenumber] = useState();
    const [phonenumbererr, setPhonenumbererr] = useState();
    const [img, setImg] = useState("");
    const [existingFace, setExistingFace] = useState("");
    const [newPhotoSelected, setNewPhotoSelected] = useState(false);
    const [imgerr, setImgerr] = useState("");
    const [success, setSuccess] = useState("")
    const [imageLoading, setImageLoading] = useState(false);
    const onImageChange = (e) => {
        const [file] = e.target.files;
        setImg(URL.createObjectURL(file));
        setNewPhotoSelected(true);
        // Clear cache when new image is selected (will be updated on save)
        if (isEdit && location.state?.employee?.e_id) {
            const cacheKey = `employee-face-${location.state.employee.e_id}`;
            localStorage.removeItem(cacheKey);
        }
    };
    useEffect(() => {
        inputFocus.current.focus()
    }, [])
    const [formError, setFormError] = useState("");
    const prefillId = async () => {
        try {
            const resp = await axiosPrivate.get('/employees/nextEmployeeId');
            const nextId = resp?.data?.nextId;
            if (nextId != null) {
                const el = document.getElementById('employeeid');
                if (el) el.value = nextId;
            }
        } catch (e) {
            // ignore; surfaced by interceptors/UI
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let submit = 1;
        const isEdit = Boolean(location.state?.edit && location.state?.employee);
        if (isEdit) {
            if (newPhotoSelected && img) {
                setImgerr("");
            } else {
                // photo not required on edit unless changed
                setImgerr("");
            }
        } else {
            if (!img) {
                setImgerr("Choose an Image file");
                submit = 0
            } else {
                setImgerr("")
            }
        }
        if (!isValidPhoneNumber(phonenumber)) {
            setPhonenumbererr("Enter a valid Phone number");
            submit = 0;
        }
        else {
            setPhonenumbererr("");
        }
        if (submit === 0) {
            setFormError("Please fix the highlighted errors and try again.");
            return;
        }
        setFormError("");
        let image_string = "";
        if (isEdit) {
            if (newPhotoSelected && img) {
                image_string = await imageToBase64(img);
            } else {
                image_string = existingFace || "";
            }
        } else {
            image_string = await imageToBase64(img);
        }
        const newEmployee = {
            e_fname: document.getElementById("firstname").value,
            e_lname: document.getElementById("lastname").value,
            e_gender: document.getElementById("gender").value,
            e_company_name: document.getElementById("companyname").value,
            e_id: parseInt(document.getElementById("employeeid").value, 10),
            e_building: document.getElementById("buildingname").value,
            e_contact: phonenumber,
            e_designation: document.getElementById("designation").value,
            e_dob: document.getElementById("dob").value,
            e_face: image_string,
            e_username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            isActive: document.getElementById("active").checked
        }
        console.log()
        try {
            if (isEdit) {
                await axiosPrivate.post('/employees/update', newEmployee);
                // Update cache if new image was uploaded
                if (newPhotoSelected && image_string) {
                    const cacheKey = `employee-face-${newEmployee.e_id}`;
                    localStorage.setItem(cacheKey, image_string);
                }
            } else {
                await axiosPrivate.post("/employees/addemployee", newEmployee)
            }
            setSuccess(true)
        }
        catch (err) {
            if (!err?.response) {
                alert("No server connected")
            }
            else if (err?.response?.status === 409) {
                const errorMsg = err?.response?.data?.Message || "Username or employee ID already exists. Please choose different values.";
                alert(errorMsg)
            }
            else if (err?.response?.status === 403) {
                const errorMsg = err?.response?.data?.Message || "No company access assigned";
                alert(errorMsg)
            }
            else if (err?.response?.status === 405) {
                const errorMsg = err?.response?.data?.Unauthorised || "Unauthorized access";
                alert(errorMsg)
            }
            else if (err?.response?.data?.Message) {
                alert(err.response.data.Message)
            }
            else if (err?.response?.data?.message) {
                alert(err.response.data.message)
            }
            else if (err?.response?.message) {
                alert(err.response.message)
            }
            else {
                alert("An error occurred. Please check phone number and employee ID (they should be unique).")
                console.log(err)
            }
        }
    }
    const handlecancel = () => {
        console.log("cancelled?")
        navigate('/employeelist/1')
    }
    // Prefill on edit
    useEffect(() => {
        const emp = location.state?.employee;
        if (!location.state?.edit || !emp) {
            prefillId();
            return;
        }
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ""; };
        // Basic available fields
        setVal('companyname', emp.e_company_name);
        setVal('firstname', emp.e_fname);
        setVal('lastname', emp.e_lname);
        setVal('employeeid', emp.e_id);
        setVal('buildingname', emp.e_building);
        setPhonenumber(emp.e_contact || "");
        const activeEl = document.getElementById('active'); if (activeEl) activeEl.checked = !!emp.isActive;
        // Fetch full details to prefill login, gender, dob, designation, face
        const fetchDetails = async () => {
            try {
                const res = await axiosPrivate.get(`/employees/details?e_id=${encodeURIComponent(emp.e_id)}`);
                const full = res?.data || {};
                setVal('gender', full.e_gender || '');
                setVal('dob', full.e_dob ? new Date(full.e_dob).toISOString().slice(0,10) : '');
                setVal('designation', full.e_designation || '');
                setVal('username', full.e_username || '');
                // Load face lazily with progressive loading (thumbnail first, then full)
                const cacheKey = `employee-face-${emp.e_id}`;
                const cachedFace = localStorage.getItem(cacheKey);
                if (cachedFace) {
                    setExistingFace(cachedFace);
                    setImg(`data:image/png;base64,${cachedFace}`);
                    // Emit loadComplete for cached image
                    window.dispatchEvent(new CustomEvent('imageLoadComplete', { detail: { e_id: emp.e_id } }));
                } else {
                    setImageLoading(true);
                    // Load thumbnail first
                    try {
                        const thumbRes = await axiosPrivate.get(`/employees/face?e_id=${encodeURIComponent(emp.e_id)}&thumbnail=true`);
                        const thumbData = thumbRes?.data?.e_face || '';
                        if (thumbData) {
                            // Create thumbnail on client side (resize to 150x150)
                            const thumbImg = await createThumbnail(`data:image/png;base64,${thumbData}`, 150);
                            setImg(thumbImg);
                            setExistingFace(thumbData);
                            // Emit loadComplete after thumbnail loads
                            window.dispatchEvent(new CustomEvent('imageLoadComplete', { detail: { e_id: emp.e_id } }));
                            
                            // Now load full resolution (keep loading indicator visible)
                            try {
                                const faceRes = await axiosPrivate.get(`/employees/face?e_id=${encodeURIComponent(emp.e_id)}`);
                                const fullFace = faceRes?.data?.e_face || '';
                                if (fullFace) {
                                    localStorage.setItem(cacheKey, fullFace);
                                    setExistingFace(fullFace);
                                    setImg(`data:image/png;base64,${fullFace}`);
                                }
                            } catch {}
                        }
                    } catch {}
                    finally { setImageLoading(false); }
                }
            } catch (e) {
                // ignore
            }
        };
        fetchDetails();
    }, [location.state])
    
    return (
        <StylesProvider injectFirst>
            <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
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
                            Employee has been added successfully. Click below to return to the list.
                        </Typography>
                        <Button 
                            variant="contained"
                            onClick={() => { navigate("/employeelist/1") }}
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
                            Go to Employee List
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
                        
                        {/* Header Section */}
                        <Paper 
                            elevation={2}
                            sx={{ 
                                padding: '1.5rem', 
                                marginBottom: '2rem',
                                borderRadius: '16px',
                                background: '#ffffff'
                            }}
                        >
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
                                    Active Employee
                                </Typography>
                            </Box>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 700, 
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    marginTop: '1rem'
                                }}
                            >
                                Employee Information
                            </Typography>
                        </Paper>

                        <Grid container spacing={3}>
                            {/* Left Column - Basic Info */}
                            <Grid item xs={12} md={8}>
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
                                        Basic Information
                                    </Typography>
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="companyname"
                                                type="text"
                                                fullWidth
                                                required
                                                label="Department Name"
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
                                                id="firstname"
                                                type="text"
                                                required
                                                fullWidth
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
                                                required
                                                fullWidth
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
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                                <TextField
                                                    id="employeeid"
                                                    type="text"
                                                    required
                                                    fullWidth
                                                    label="Employee ID"
                                                    disabled={isEdit}
                                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                        }
                                                    }}
                                                />
                                                <Button 
                                                    size="small" 
                                                    onClick={prefillId}
                                                    sx={{
                                                        minWidth: '100px',
                                                        borderRadius: '8px',
                                                        background: '#f1f5f9',
                                                        color: '#475569',
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            background: '#e2e8f0',
                                                        }
                                                    }}
                                                >
                                                    Prefill
                                                </Button>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="buildingname"
                                                type="text"
                                                required
                                                fullWidth
                                                label="Building Number/Name"
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
                                                id="dob"
                                                type="date"
                                                required
                                                fullWidth
                                                label="Date of Birth"
                                                InputLabelProps={{ shrink: true }}
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
                                                id="gender"
                                                select
                                                fullWidth
                                                required
                                                label="Gender"
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
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="designation"
                                                type="text"
                                                required
                                                fullWidth
                                                label="Designation"
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
                                                />
                                                {phonenumbererr && (
                                                    <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', marginTop: '0.5rem' }}>
                                                        {phonenumbererr}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Login Credentials */}
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
                                        Login Credentials
                                    </Typography>
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="username"
                                                type="text"
                                                required
                                                fullWidth
                                                label="Login Username"
                                                disabled={isEdit}
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
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="password"
                                                type="password"
                                                required
                                                fullWidth
                                                disabled={isEdit}
                                                label="Login Password"
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
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Right Column - Photo Upload */}
                            <Grid item xs={12} md={4}>
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        padding: '2rem', 
                                        borderRadius: '16px',
                                        background: '#ffffff',
                                        height: 'fit-content',
                                        position: 'sticky',
                                        top: '2rem'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
                                        Employee Photo
                                    </Typography>
                                    
                                    <Box sx={{ textAlign: 'center' }}>
                                        <input 
                                            type="file" 
                                            id="image" 
                                            accept="image/*" 
                                            style={{ display: "none" }} 
                                            onChange={onImageChange} 
                                        />
                                        {imageLoading && (
                                            <Box sx={{ mb: 2 }}>
                                                <LinearProgress />
                                            </Box>
                                        )}
                                        {Boolean(img) && (
                                            <Box sx={{ marginBottom: '1.5rem' }}>
                                                <img 
                                                    src={img} 
                                                    alt="Employee preview" 
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
                                            {img ? 'Change Photo' : 'Upload Photo'}
                                        </Button>
                                        {imgerr && (
                                            <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', marginTop: '0.5rem' }}>
                                                {imgerr}
                                            </Typography>
                                        )}
                                    </Box>
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
                                    Save Employee
                                </Button>
                            </Box>
                        </Paper>
                    </form>
                )}
            </Box>
        </StylesProvider>
    )
}

export default AddEmployee
