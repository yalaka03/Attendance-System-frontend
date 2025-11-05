import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Paper, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState , useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const num_records_page=10
const ViewDetailspage = (props) => {
    let params = useParams();
    console.log(params)
    const [searchParams,setSearchParams] = useSearchParams();
    const [data,setData] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const handleEdit = (event) =>
    {
       console.log(event.currentTarget.id)
    }
    const handleDelete = async (event) =>
    {
        if(window.confirm("Are you sure you want to delete") == true)
        {
        const index=event.currentTarget.id
        try {
            const response = await axiosPrivate.post("employees/deleteemployee",{
                "e_id" : data[index]["e_id"] 
            })
            // If you dont want reload then use setData(data.filter((value,ind) = > { if(ind != index) { return value } }) // but this makes the records on page less and a record has no place to stay 
            window.location.reload()
        }
        catch (err) {
            console.log("Error while deleting")
        }
    }
    }
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getdata = async () => {
            try {
                const response = await axiosPrivate.post('/employees/listadmin', {
                    "reg_no" : location.reg_no,
                    "filter" : searchParams.get("filter"), 
                    "active" : searchParams.get("active"),
                    "page" : parseInt(params.page,10),
                    "num_records_page" : num_records_page,
                    signal: controller.signal   //find out what this does.
                });
                isMounted && setData(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getdata();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [params])
    useEffect(()=>{
        navigate("/employeelist/1" + location.search)
    },[searchParams])
    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', width: '95%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#000000' }}>
                    Employees
                </Typography>
            </Box>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Table aria-label="simple table" xs={14}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 700 }} xs ={2}>Employee ID</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }} xs ={2}>Employee Name</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }} xs ={2}>Building</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }} xs ={2}>Company Name</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }} xs ={2}>Contact No.</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }} xs ={2}>Status</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }} xs ={2}>Edit</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }} xs ={2}>Delete</TableCell>
                        <TableCell align="center" xs ={2}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row,index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" align="center">
                                {row["e_id"]}
                            </TableCell>
                            <TableCell align="center">{row["e_fname"]} {row["e_lname"]}</TableCell>
                            <TableCell align="center">{row["e_building"]}</TableCell>
                            <TableCell align="center">{row["e_company_name"]}</TableCell>
                            <TableCell align="center">{row["e_contact"]}</TableCell>
                            <TableCell align="center">{row.isActive ? "True" : "False"}</TableCell>
                            <TableCell align="center">
                                <IconButton aria-label="edit" onClick={handleEdit} id={index} >
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell align="center">
                                <IconButton aria-label="delete" onClick={handleDelete}  id={index}>
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </Paper>
        </Box>
    )


}

export default ViewDetailspage