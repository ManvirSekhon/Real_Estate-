import React from 'react'
import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Dashboard/Profile'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Properties from './pages/Dashboard/Properties'
import AddProperty from './pages/Dashboard/AddProperty'
import EditProperty from './pages/Dashboard/EditProperty'
import ProtcetedRoutes from './components/ProtectedRoute'
import AdminDashboard from './pages/Admin/AdminDashboard'
import DashboardOverview from './pages/Admin/adminComponent/DashboardOverview'
import AdminProperties from './pages/Admin/adminComponent/AdminProperties'
import UserManage from './pages/Admin/adminComponent/usersManagement/UserManage'
import EditUser from './pages/Dashboard/EditUser'
import PropertyDetail from './components/layout/PropertyDetails'
import Bookmarks from './pages/Dashboard/Bookmarks'
import Messages from './pages/Dashboard/Messages'
import VerifyEmail from './components/VerifyEmail'
import ResendVerification from './components/ResendVerification'

const App = () => {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const isAdminRoute = location.pathname.startsWith('/admin_dashboard');
  return (
    <div className='App'>
      <Toaster position='top-left' reverseOrder={false} />
      {!isAdminRoute &&
        <header>
          <nav>
            <Navbar />
          </nav>
        </header>
      }
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/verify-email/:userId/:token' element={<VerifyEmail />} />
          <Route path='/resend-verification' element={<ResendVerification />} />

          <Route element={<ProtcetedRoutes />}>
          <Route path='/search/details/:id' element={<PropertyDetail/>} />
            <Route path='/dashboard' element={<Profile />} />
            <Route path='/dashboard/properties' element={<Properties />} />
            <Route path='/dashboard/bookmarks' element={<Bookmarks />} />
            <Route path='/Messages' element = {<Messages />} />
            <Route path='/dashboard/add-property' element={<AddProperty />} />
            <Route path='/dashboard/edit-property/:id' element={<EditProperty />} />
            <Route path='/dashboard/users/edit/:id' element={<EditUser />} />
            <Route path='/admin_dashboard' element={<AdminDashboard />} />
          </Route>

          <Route element={<AdminDashboard />}>
            <Route path='/admin_dashboard/' element={<DashboardOverview />} />
            <Route path='/admin_dashboard/properties' element={<AdminProperties />} />
            <Route path='/admin_dashboard/edit-property/:id' element={<EditProperty />} />
            <Route path='/admin_dashboard/users' element={<UserManage />} />
            <Route path='/admin_dashboard/users/register' element={<Register />} />
            <Route path='/admin_dashboard/users/edit/:id' element={<EditUser />} />
          </Route>
 
        </Routes>
      </main>
      {!isAdminRoute &&
        <footer>
          <Footer />
        </footer>
      }
    </div>
  )
}

export default App