import Register from './components/Register';
import Login from './components/Login';
import CompanyListing from './components/CompanyListing';
import CompanyListingpage from './components/companylistingpage';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import AddCompany from './components/AddCompany';
import AddEmployee from './components/AddEmployee';
import EmployeeList from './components/Employeelist';
import EmployeeListPage from './components/Employeelistpage';
import Attendance from './components/Attendance';
import CameraGrid from './components/CameraGrid';
import Viewdetails from './components/ViewDetail';
import ViewDetailspage from './components/viewdetailspage';
import Home from './components/Home';
import RaiseTicket from './components/RaiseTicket';
import Tickets from './components/Tickets';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/" element={<Home />}/>
            <Route path="attendance" element={<Attendance />} />
            <Route path="ticket" element={<RaiseTicket />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
            
          <Route path="addemployee" element={<AddEmployee />} />
            <Route path="employeelist" element={<EmployeeList />}>
              <Route
                index
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>Select an Page</p>
                  </main>
                }
              />
              <Route path=":page" element={<EmployeeListPage/>} />
            </Route>
            <Route path="cameras" element={<CameraGrid />} />
            <Route path="tickets" element={<Tickets />} />
            {/* Attendance not available for editors in UI */}
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="addcompany" element={<AddCompany />} />
            <Route path="companylisting" element={<CompanyListing />}>

              <Route
                index
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>Select a Page</p>
                  </main>
                }
              />
              <Route path=":page" element={<CompanyListingpage />} />
            </Route>
            <Route path="viewdetails" element={<Viewdetails/>}>
              <Route
                index
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>Select a Page</p>
                  </main>
                }
              />
              <Route path=":page" element={<ViewDetailspage/>} />
            </Route>
          </Route>

          
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;