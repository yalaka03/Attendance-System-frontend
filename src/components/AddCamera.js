import { useState } from "react";
import { TextField, Button, Grid, Typography, Box, Switch, FormControlLabel } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AddCamera = ({ onCancel, onSuccess }) => {
    const axiosPrivate = useAxiosPrivate();
    const [formData, setFormData] = useState({
        camera_name: '',
        camera_location: '',
        video_url: '',
        thumbnail_url: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axiosPrivate.post('/cameras/add', formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add camera');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Add New Camera
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            name="camera_name"
                            label="Camera Name"
                            value={formData.camera_name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            name="camera_location"
                            label="Camera Location"
                            value={formData.camera_location}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            name="video_url"
                            label="Video URL (MP4)"
                            value={formData.video_url}
                            onChange={handleChange}
                            required
                            fullWidth
                            placeholder="https://example.com/video.mp4"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            name="thumbnail_url"
                            label="Thumbnail URL (Image)"
                            value={formData.thumbnail_url}
                            onChange={handleChange}
                            required
                            fullWidth
                            placeholder="https://example.com/thumbnail.jpg"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                            }
                            label="Active"
                        />
                    </Grid>
                    
                    {error && (
                        <Grid item xs={12}>
                            <Typography color="error">{error}</Typography>
                        </Grid>
                    )}
                    
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Camera'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AddCamera;
