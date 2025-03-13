import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './pages/login/Login'
import Signup from "./pages/signup/SignUp";
import Home from "./pages/home/Home";
import Dashboard from "./pages/adminpanel/dashboard.jsx";
import UserProfile from "./pages/userprofile/UserProfile.jsx";
import ProtectedRoutes from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/notfound/NoteFound.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Unauthorized from "./pages/unauthorized/Unauthorized.jsx";
// import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";

function SignupAndLogout() {
  localStorage.clear()
  return <Signup />
}

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupAndLogout /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
          <Route path="/profile" element={<ProtectedRoutes><UserProfile /></ProtectedRoutes>} />

          {/* Admin protectd Routes */}
          <Route path="/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />


          {/* Catch-All Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer /> 
    </>
  )
}

export default App;
