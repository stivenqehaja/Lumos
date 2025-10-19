import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Performers from './pages/admin/Performers';
import CastingOrders from './pages/admin/CastingOrders';
import ClientPortal from './pages/client/ClientPortal';
import ProtectedRoute from './components/common/ProtectedRoute';
import './styles/lumos.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/client" element={<ClientPortal />} />

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/performers"
                        element={
                            <ProtectedRoute>
                                <Performers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/casting-orders"
                        element={
                            <ProtectedRoute>
                                <CastingOrders />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
