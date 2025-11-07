import { Link, Outlet, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import Pagination from '@mui/material/Pagination';
import { PaginationItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import Button from "@mui/material/Button"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const num_records_page = 10;
const CompanyListing = () => {
    const navigate= useNavigate();
    const params = useParams();
    const axiosPrivate = useAxiosPrivate();
    const page = parseInt(params.page, 10)
    const [pagecount,setPagecount] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchquery, setSearchquery] = useState("");
    const [checkedActive, setCheckedActive] = useState(false);
    const [checkedInactive, setCheckedInactive] = useState(false);
    const location = useLocation();
    useEffect(() => {
        setSearchquery(searchParams.get("filter") || "")
        let isMounted = true;
        const controller = new AbortController();
        const getpages = async () => {
            try {
                const response = await axiosPrivate.post('/company/Numpages', {
                    "filter" : searchParams.get("filter"), 
                    "active" : searchParams.get("active"),
                    "num_records_page" : num_records_page,
                    signal: controller.signal   //find out what this does.
                });
                isMounted && setPagecount(response.data.num_page);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
        getpages();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [searchParams])

    // Debounced search: update query after user stops typing
    useEffect(() => {
        const current = searchParams.get("filter") || "";
        if (searchquery === current) return;
        const handler = setTimeout(() => {
            let temp = {
                "filter": searchquery,
                "active": searchParams.get("active")
            };
            if (!temp.filter) { delete temp["filter"]; }
            if (!temp.active) { delete temp["active"]; }
            setSearchParams(temp);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchquery])
    useEffect(() => {
        if (checkedActive) {
            let temp = { "filter" : searchParams.get("filter"),
            active:true}
            if(!temp.filter){delete temp["filter"];}        
            setSearchParams(temp);
        }   
        else if (checkedInactive) {
            let temp = { "filter" : searchParams.get("filter"),
            active:false}
            if(!temp.filter){delete temp["filter"];}        
            setSearchParams(temp);
        }
        else{
            searchParams.delete("active")
            setSearchParams(searchParams)
        }
    }, [checkedActive, checkedInactive])

    return (
        <div style={{width:"95%", maxWidth: "1400px", margin: "2rem auto", padding: "1rem"}}>
            <h1 style={{marginBottom: "1rem", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", flex: "0 0 auto"}}>Company List</h1>
            <div style={{display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1.5rem"}}>
                
                <form style={{flex: "1 1 300px", minWidth: "200px"}}
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
                    <TextField 
                        style={{width:"100%" , border: "0px",height:"100%"}}
                        placeholder="Search companies..."
                        value={searchquery}
                        id="searchfield"
                        onChange={(event) => {
                            setSearchquery(event.target.value)
                        }}
                    />
                </form>
                <Button 
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
                        color: 'white',
                        fontWeight: 600,
                        padding: '0.625rem 1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4338ca 0%, #5b21b6 50%, #6d28d9 100%)',
                            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
                            transform: 'translateY(-2px)',
                        },
                        flex: "0 0 auto"
                    }}
                    onClick={(e)=>{navigate("/addcompany")}}
                >
                    Add Company
                </Button>
            </div>
            <div style={{display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1.5rem", padding: "0.75rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
                <span style={{fontWeight: 600, color: "#475569", fontSize: "0.95rem"}}>Filter by Status:</span>
                <label style={{display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", userSelect: "none"}}>
                    <Checkbox
                        checked={checkedActive}
                        onChange={(e) => { setCheckedActive(e.target.checked); if(e.target.checked){setCheckedInactive(false);} }}
                        inputProps={{ 'aria-label': 'Filter active companies' }}
                        sx={{
                            color: '#4f46e5',
                            '&.Mui-checked': {
                                color: '#4f46e5',
                            }
                        }}
                    />
                    <span style={{color: "#1e293b", fontWeight: 500}}>Active</span>
                </label>
                <label style={{display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", userSelect: "none"}}>
                    <Checkbox
                        checked={checkedInactive}
                        onChange={(e) => { setCheckedInactive(e.target.checked);if(e.target.checked){setCheckedActive(false);} }}
                        inputProps={{ 'aria-label': 'Filter inactive companies' }}
                        sx={{
                            color: '#4f46e5',
                            '&.Mui-checked': {
                                color: '#4f46e5',
                            }
                        }}
                    />
                    <span style={{color: "#1e293b", fontWeight: 500}}>Inactive</span>
                </label>
            </div>
            <Outlet />
            <div style={{display: "flex", justifyContent: "center", marginTop: "2rem"}}>
                <Pagination count={pagecount} variant="outlined" shape="rounded" color="primary"
                    renderItem={(item) => (
                        <PaginationItem
                            page={page}
                            component={Link}
                            to={`/companylisting/${item.page}` + location.search}
                            {...item}
                            sx={{
                                color: "#1e293b",
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
                                    color: 'white',
                                    borderColor: '#4f46e5',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4338ca 0%, #5b21b6 50%, #6d28d9 100%)',
                                    }
                                }
                            }}
                        />
                    )}
                />
            </div>
        </div>
    )

}

export default CompanyListing