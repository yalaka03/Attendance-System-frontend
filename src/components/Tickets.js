import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

const Tickets = () => {
  const axiosPrivate = useAxiosPrivate();
  const [tickets, setTickets] = useState([]);

  const load = async () => {
    try {
      const res = await axiosPrivate.get('/tickets/list?status=pending');
      setTickets(res?.data || []);
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  const act = async (ticket_id, action) => {
    try {
      await axiosPrivate.post('/tickets/act', { ticket_id, action });
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, width: '95%', margin: '0 auto' }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Pending Tickets</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Camera</TableCell>
              <TableCell>Attendance Date</TableCell>
              <TableCell>Video Timestamp</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(t => (
              <TableRow key={t._id}>
                <TableCell>{t.e_id}</TableCell>
                <TableCell>{t.camera_id}</TableCell>
                <TableCell>{new Date(t.requestedDate).toLocaleString()}</TableCell>
                <TableCell>{new Date(t.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => act(t._id, 'accepted')} sx={{ mr: 1 }}>Accept</Button>
                  <Button variant="outlined" onClick={() => act(t._id, 'rejected')}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#6b7280' }}>No tickets found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Tickets;


