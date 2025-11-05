import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import { TextField } from "@mui/material";

const num_records_page = 10;

const Attendance = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const e_id_from_state = location?.state?.e_id;
    const [e_id, setEid] = useState(e_id_from_state || '');
    const axiosPrivate = useAxiosPrivate();
    const [pagecount, setPagecount] = useState(1);
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
    const [rows, setRows] = useState([]);
    const [employeeName, setEmployeeName] = useState('');

    useEffect(() => {
        console.log("eid",e_id);
        if (!e_id) return;
        const getPages = async () => {
            try {
                const res = await axiosPrivate.post('/employees/attendance/Numpages', { e_id, num_records_page });
                setPagecount(res?.data?.num_page || 1);
                console.log("res",res);
            } catch (e) {
                console.log(e);
            }
        };
        getPages();
    }, [e_id]);

    useEffect(() => {
        if (!e_id) return;
        const fetchRows = async () => {
            try {
                const res = await axiosPrivate.post('/employees/attendance/list', { e_id, page, num_records_page });
                setRows(res?.data?.attendance || []);
                setEmployeeName(res?.data?.employeeName || '');
            } catch (e) {}
        };
        fetchRows();
    }, [e_id, page]);

    const onChangePage = (_e, value) => {
        setPage(value);
        setSearchParams({ page: String(value) });
    };

    // On mount, resolve e_id if not provided (navbar entry)
    useEffect(() => {
        if (e_id_from_state) return; // already provided
        const resolveEid = async () => {
            try {
                const res = await axiosPrivate.get('/employees/me');
                const resolved = res?.data?.e_id;
                if (resolved) setEid(String(resolved));
                else {
                    navigate('/unauthorized', { replace: true });
                }
            } catch (e) {
                navigate('/unauthorized', { replace: true });
            }
        };
        resolveEid();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h3>Attendance - {employeeName || `Employee ${e_id}`}</h3>
            {rows.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    No records found
                </div>
            ) : (
                <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((r, i) => (
                                <TableRow key={i}>
                                    <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{r.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination count={pagecount} page={page} onChange={onChangePage} sx={{ mt: 2 }} />
                </>
            )}
        </div>
    );
}

export default Attendance;


