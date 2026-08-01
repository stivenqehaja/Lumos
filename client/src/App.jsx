import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/lumos.css';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Performers from './pages/admin/Performers';
import CastingOrders from './pages/admin/CastingOrders';
import CastingOrderDetail from './pages/admin/CastingOrderDetail';
import ManageClients from './pages/admin/ManageClients';
import GenerateLink from './pages/admin/GenerateLink';
import ClientPortal from './pages/client/ClientPortal';
import ExpiredLink from './pages/client/ExpiredLink';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Router>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/client" element={<ClientPortal />} />
                    <Route path="/client/expired" element={<ExpiredLink />} />

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
                    <Route
                        path="/admin/casting-orders/:id"
                        element={
                            <ProtectedRoute>
                                <CastingOrderDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/manage-clients"
                        element={
                            <ProtectedRoute>
                                <ManageClients />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/generate-link"
                        element={
                            <ProtectedRoute>
                                <GenerateLink />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                </Router>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
