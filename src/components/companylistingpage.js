import { useLocation, useNavigate, useParams, useSearchParams ,Link} from "react-router-dom"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState , useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";

const num_records_page=10
const CompanyListingpage = () => {
    let params = useParams();
    console.log(params)
    const [searchParams,setSearchParams] = useSearchParams();
    const [data,setData] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const handleViewdetails = (event) =>
    {
        navigate("/viewdetails",{state : {"reg_no": data[event.currentTarget.id]["reg_no"]}})
    }
    const handleEdit = (event) =>
    {
       const index = event.currentTarget.id;
        const reg_no = data[index]["reg_no"];
        navigate("/addcompany", { state: { edit: true, reg_no } });
    }
    const handleDelete = async(event) =>
    {
        if(window.confirm("Are you sure you want to delete") == true)
        {
        const index=event.currentTarget.id
        try {
            const response = await axiosPrivate.post("company/deletecompany",{
                "reg_no" : data[index]["reg_no"] 
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
                const response = await axiosPrivate.post('/company/list', {
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
        navigate("/companylisting/1" + location.search)
    },[searchParams])
    return (
        <div>
            <Table aria-label="simple table" xs={14}>
                <TableHead>
                    <TableRow>
                        <TableCell xs ={2}>S.No</TableCell>
                        <TableCell align="center" xs ={2}>Logo</TableCell>
                        <TableCell align="center" xs ={2}>Company</TableCell>
                        <TableCell align="center" xs ={2}>Designated Person</TableCell>
                        <TableCell align="center" xs ={2}>Contact Number</TableCell>
                        <TableCell align="center" xs ={2}>Status</TableCell>
                        <TableCell align="center" xs ={2}>Edit</TableCell>
                        <TableCell align="center" xs ={2}>Delete</TableCell>
                        <TableCell align="center" xs ={2}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row,index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {(parseInt(params.page,10)-1)*(num_records_page)+index+1}
                            </TableCell>
                            <TableCell align="center">
                                {row["logo"] ? (
                                    <img 
                                        src={"data:image/png;base64," + row["logo"]}
                                        alt="Logo"
                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid #000000' }}
                                    />
                                ) : (
                                    <span>-</span>
                                )}
                            </TableCell>
                            <TableCell align="center">{row["comp_name"]}</TableCell>
                            <TableCell align="center">{row["dp_firstName"]} {row["dp_lastName"]}</TableCell>
                            <TableCell align="center">{row["dp_phoneNum"]}</TableCell>
                            <TableCell align="center">{row.isActive ? "Active" : "Inactive"}</TableCell>
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
                            <TableCell align="center">
                                <Button 
                                    onClick={handleViewdetails} 
                                    id={index} 
                                    variant="outlined"
                                    sx={{
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
                                        color: 'white',
                                        borderColor: '#4f46e5',
                                        fontWeight: 600,
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4338ca 0%, #5b21b6 50%, #6d28d9 100%)',
                                            borderColor: '#4338ca',
                                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}
                                >
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )


}

export default CompanyListingpage