import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import BookingPage from './pages/BookingPage.jsx';
import PaymentGatewayPage from './pages/PaymentGatewayPage.jsx';
import PaymentReturnPage from './pages/PaymentReturnPage.jsx';
import Profile from './pages/Profile.jsx';
import MyCar from './pages/MyCar.jsx';
import StaffDashboard from './pages/StaffDashboard.jsx';
import TechnicianDashboard from './pages/TechnicianDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard/index.jsx'; // ✅ Updated path
import ManagerDashboard from './pages/ManagerDashboard.jsx';

// Định nghĩa routes
const routes = [
  {
    path: '/',
    element: Home,
    showNavbar: true,
    showFooter: true
  },
  {
    path: '/home',
    element: Home,
    showNavbar: true,
    showFooter: true
  },
  {
    path: '/login',
    element: Login,
    showNavbar: true,
    showFooter: true
  },
  {
    path: '/booking',
    element: BookingPage,
    showNavbar: true,
    showFooter: true
  },
  {
    path: '/payment',
    element: PaymentGatewayPage,
    showNavbar: true,
    showFooter: true
  },
  {
    path: '/payment-return',
    element: PaymentReturnPage,
    showNavbar: true,
    showFooter: true
  },
  {
    path: '/profile',
    element: Profile,
    showNavbar: true,
    showFooter: true
  },
  {
    path: '/mycar',
    element: MyCar,
    showNavbar: true,
    showFooter: true
  },
  {
    path: '/staff',
    element: StaffDashboard,
    showNavbar: false,
    showFooter: false
  },
  {
    path: '/technician',
    element: TechnicianDashboard,
    showNavbar: false,
    showFooter: false
  },
  {
    path: '/admin',
    element: AdminDashboard,
    showNavbar: false,
    showFooter: false
  },
  {
    path: '/manager/*',  // Wildcard để ManagerDashboard tự handle sub-routes
    element: ManagerDashboard,
    showNavbar: false,
    showFooter: false
  }
];

export default routes;
