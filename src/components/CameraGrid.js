import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Grid, Card, CardContent, CardMedia, Typography, Button, IconButton, Box, Dialog, DialogContent } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Fullscreen as FullscreenIcon } from "@mui/icons-material";
import AddCamera from "./AddCamera";

const CameraGrid = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [fullscreenVideo, setFullscreenVideo] = useState(null);

    useEffect(() => {
        fetchCameras();
    }, []);

    const fetchCameras = async () => {
        try {
            const response = await axiosPrivate.get('/cameras/list');
            setCameras(response.data);
        } catch (err) {
            console.error('Failed to fetch cameras:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCamera = async (cameraId) => {
        if (window.confirm("Are you sure you want to delete this camera?")) {
            try {
                await axiosPrivate.post('/cameras/delete', { camera_id: cameraId });
                setCameras(cameras.filter(cam => cam._id !== cameraId));
            } catch (err) {
                console.error('Failed to delete camera:', err);
            }
        }
    };

    const handleCameraAdded = () => {
        setShowAddForm(false);
        fetchCameras();
    };

    const handleVideoHover = (videoElement, isEntering) => {
        if (isEntering) {
            videoElement.style.display = 'block';
            videoElement.play().catch(console.error);
        } else {
            videoElement.style.display = 'none';
            videoElement.pause();
        }
    };

    const handleFullscreen = (camera) => {
        setFullscreenVideo(camera);
    };

    const closeFullscreen = () => {
        setFullscreenVideo(null);
    };

    if (loading) {
        return <Typography>Loading cameras...</Typography>;
    }

    if (showAddForm) {
        return <AddCamera onCancel={() => setShowAddForm(false)} onSuccess={handleCameraAdded} />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Camera Surveillance</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddForm(true)}
                >
                    Add Camera
                </Button>
            </Box>

            <Grid container spacing={3}>
                {cameras.map((camera) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={camera._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="div"
                                    sx={{
                                        height: 200,
                                        backgroundImage: `url(${camera.thumbnail_url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleFullscreen(camera)}
                                    onMouseEnter={(e) => {
                                        const video = e.currentTarget.querySelector('video');
                                        if (video) handleVideoHover(video, true);
                                    }}
                                    onMouseLeave={(e) => {
                                        const video = e.currentTarget.querySelector('video');
                                        if (video) handleVideoHover(video, false);
                                    }}
                                >
                                    <video
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'none',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            pointerEvents: 'none'
                                        }}
                                        muted
                                        loop
                                        preload="metadata"
                                    >
                                        <source src={camera.video_url} type="video/mp4" />
                                    </video>
                                </CardMedia>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCamera(camera._id);
                                    }}
                                >
                                    <DeleteIcon color="error" />
                                </IconButton>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFullscreen(camera);
                                    }}
                                >
                                    <FullscreenIcon />
                                </IconButton>
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {camera.camera_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {camera.camera_location}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    Status: {camera.isActive ? 'Active' : 'Inactive'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {cameras.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No cameras found. Add your first camera to get started.
                    </Typography>
                </Box>
            )}

            {/* Fullscreen Video Dialog */}
            <Dialog
                open={!!fullscreenVideo}
                onClose={closeFullscreen}
                maxWidth="lg"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'black',
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    {fullscreenVideo && (
                        <>
                            <video
                                style={{
                                    width: '100%',
                                    height: '80vh',
                                    objectFit: 'contain'
                                }}
                                controls
                                autoPlay
                                muted
                                loop
                            >
                                <source src={fullscreenVideo.video_url} type="video/mp4" />
                            </video>
                            <Box sx={{ 
                                position: 'absolute', 
                                top: 16, 
                                left: 16, 
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                p: 2,
                                borderRadius: 1
                            }}>
                                <Typography variant="h6">{fullscreenVideo.camera_name}</Typography>
                                <Typography variant="body2">{fullscreenVideo.camera_location}</Typography>
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default CameraGrid;
