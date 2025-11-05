import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, Outlet, useParams, useSearchParams } from "react-router-dom"
import Pagination from '@mui/material/Pagination';
import { Grid, PaginationItem, TextField, Box, Paper, Typography, Divider } from "@mui/material";
import { Checkbox } from "@mui/material";
import Button from "@mui/material/Button"
import "../css/viewdetails.css"
const num_records_page = 10
const Viewdetails = () => {
    const [companydetails, setCompanydetails] = useState();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();


    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getdata = async () => {
            try {
                const response = await axiosPrivate.post('/company/details', {
                    "reg_no": location.state.reg_no,
                    signal: controller.signal   //find out what this does.
                });
                isMounted && setCompanydetails(response.data);
                console.log(response.data.data.logo)
                

            } catch (err) {
                console.error(err);
            }
        }

        getdata()

        return () => {
            isMounted = false;
            controller.abort();
        }

    }, [])


    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', width: '95%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#000000' }}>
                    Company Details
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: '#6b7280' }}>Company</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{companydetails?.data?.comp_name || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: '#6b7280' }}>Employee Count</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{companydetails?.employeeCount ?? '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: '#6b7280' }}>Designated Person</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{companydetails?.data?.dp_firstName} {companydetails?.data?.dp_lastName}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: '#6b7280' }}>Contact Number</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{companydetails?.data?.dp_phoneNum || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: '#6b7280' }}>Email Address</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{companydetails?.data?.dp_email || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: '#6b7280' }}>Address</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{companydetails?.data?.address || '-'}</Typography>
                            </Box>
                            <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
                                <Typography variant="subtitle2" sx={{ color: '#6b7280' }}>Billing Address</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{companydetails?.data?.billing_address || '-'}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" sx={{ color: '#6b7280', mb: 1 }}>Logo</Typography>
                        {companydetails?.data?.logo ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img 
                                    src={"data:image/png;base64," + companydetails.data.logo} 
                                    alt="Company Logo" 
                                    style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 12, border: '1px solid #000000' }}
                                />
                            </Box>
                        ) : (
                            <Typography sx={{ color: '#6b7280' }}>No logo uploaded</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
        /* <h3 style={{width:"10%", display:"inline-block",}}>Employee List</h3>
                    <form style={{width:"70%", display:"inline-block", marginLeft:"10px",}}
                        onSubmit={(event) => {
                            event.preventDefault()
                            let filter = document.getElementById("searchfield").value;
                            if (filter) {
                                let temp = {
                                    "filter" : filter,
                                    "active" : searchParams.get("active")
                                }
                                if(!temp.active){ delete temp["active"];}
                                setSearchParams(temp);
                            } else {
                                searchParams.delete("filter")
                                setSearchParams(searchParams);
                            }
                            document.getElementById("searchfield").blur()
                        }}>
                        <TextField style={{width:"100%",}}
                            value={searchquery}
                            id="searchfield"
                            onChange={(event) => {
                                setSearchquery(event.target.value)
                            }}
                        />
                    </form>
                    <Button style={{backgroundColor:"blue", color:"white", display:"inline-block", width:"10%", marginLeft:"10px",}} onClick={(e)=>{navigate("/addemployee")}}>Add Employee</Button>
        
                    <Checkbox
                        checked={checkedActive}
                        onChange={(e) => { setCheckedActive(e.target.checked); if(e.target.checked){setCheckedInactive(false);} }}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    Active
                    <Checkbox
                        checked={checkedInactive}
                        onChange={(e) => { setCheckedInactive(e.target.checked);if(e.target.checked){setCheckedActive(false);} }}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    Inactive
                    <Outlet />
                    <Pagination count={pagecount} variant="outlined" shape="rounded" color="primary"
                        renderItem={(item) => (
                            <PaginationItem
                                page={page}
                                component={Link}
                                to={`/employeelist/${item.page}` + location.search}
                                {...item}
                                style={{ color: "black" }}
                            />
        
                        )}
                    /> */
        /* </div>  */
    )

}

export default Viewdetails