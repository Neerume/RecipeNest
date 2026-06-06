import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarComponent from './Components/NavbarComponent';
import FooterComponent from './Components/FooterComponent';
import HomeComponent from './Components/HomeComponent';
import LoginComponent from './Components/LoginComponent';
import RegisterComponent from './Components/RegisterComponent';
import ChefDashboard from './Components/ChefDashboard';
import FoodloverDashboard from './Components/FoodloverDashboard';
import AdminDashboard from './Components/AdminDashboard';
import AddRecipe from './Chef/AddRecipe';
import ManageRecipe from './Chef/ManageRecipe';
import Profile from './Components/Profile';
import UpdateRecipe from './Chef/UpdateRecipe';
import ViewLikedRecipe from './Components/ViewLikedRecipe';
import ViewChart from './Chef/ViewChart';
import ViewChef from './FoodLover/ViewChef';
import AboutUs from './Components/about';
import Chef from './Components/chef';
import ViewProfile from './Components/ViewProfile';
import ManageChef from './Admin/ManageChef';
import ViewBlockedUser from './Admin/ViewBlockedUser';
import DeleteRecipe from './Admin/DeleteRecipe';
import ManageFoodLover from './Admin/ManageFoodLover';
import ViewReport from './Admin/ViewReport';


function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Navbar and Footer */}
        <Route path="/" element={
          <>
            <NavbarComponent />
            <HomeComponent />
            <FooterComponent />
          </>
        } />
        <Route path="/about" element={
          <>
            <NavbarComponent />
            <AboutUs />
            <FooterComponent />
          </>
        } />
         <Route path="/chef" element={
          <>
            <NavbarComponent />
            <Chef />
            <FooterComponent />
          </>
        } />
        <Route path="/login" element={
          <>
            <NavbarComponent />
            <LoginComponent />
            <FooterComponent />
          </>
        } />
        <Route path="/register" element={
          <>
            <NavbarComponent />
            <RegisterComponent />
            <FooterComponent />
          </>
        } />

        {/* Routes without Navbar and Footer */}
        <Route path="/admindash" element={<AdminDashboard />}>
          <Route path="chef" element={<ManageChef />} />
          <Route path="blockedUsers" element={<ViewBlockedUser />} />
          <Route path="deleterecipe" element={<DeleteRecipe />} />
          <Route path="managefoodlover" element={<ManageFoodLover />} />
          <Route path="viewreport" element={<ViewReport />} />



        </Route>


        <Route path="/chefdash" element={<ChefDashboard />}>
          <Route path="addrecipe" element={<AddRecipe />} />
          <Route path="managerecipe" element={<ManageRecipe />} />
          <Route path="managerecipe/updaterecipe/:id" element={<UpdateRecipe />} />
          <Route path="profile" element={<Profile />} />
          <Route path="viewchart" element={<ViewChart />} />
          <Route path="viewlikedrecipe" element={<ViewLikedRecipe />} />
          <Route path="viewprofile" element={<ViewProfile />} />
        </Route>

        <Route path="/foodlover" element={<FoodloverDashboard />}>
          <Route path="viewlikedrecipe" element={<ViewLikedRecipe />} />
          <Route path="profile" element={<Profile />} />
          <Route path="viewchef" element={<ViewChef />} />
        </Route>

        {/* Optional: 404 Page */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "20px" }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
