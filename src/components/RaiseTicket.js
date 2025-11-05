import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box, Paper, TextField, Button, Typography, MenuItem } from '@mui/material';

const RaiseTicket = () => {
  const axiosPrivate = useAxiosPrivate();
  const [cameras, setCameras] = useState([]);
  const [cameraId, setCameraId] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const loadCameras = async () => {
      try {
        const res = await axiosPrivate.get('/cameras/list');
        setCameras(res?.data || []);
      } catch (e) {}
    };
    loadCameras();
  }, [axiosPrivate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.post('/tickets/add', { camera_id: cameraId, requestedDate, timestamp, note });
      alert('Ticket raised');
      setCameraId(''); setRequestedDate(''); setTimestamp(''); setNote('');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to raise ticket');
    }
  };

  return (
    <Box sx={{ maxWidth: 700, width: '95%', margin: '0 auto' }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Raise Attendance Ticket</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField select label="Camera" value={cameraId} onChange={(e) => setCameraId(e.target.value)} required>
            {cameras.map((c) => (
              <MenuItem key={c._id} value={c._id}>{c.camera_name || c._id}</MenuItem>
            ))}
          </TextField>
          <TextField type="date" label="Attendance Date" InputLabelProps={{ shrink: true }} value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)} required />
          <TextField type="datetime-local" label="Video Timestamp" InputLabelProps={{ shrink: true }} value={timestamp} onChange={(e) => setTimestamp(e.target.value)} required />
          <TextField label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RaiseTicket;


