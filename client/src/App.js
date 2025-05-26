import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AddTicket from './addticket/AddTicket';
import UserTicketList from './ticketlist/UserTicketList';
import SupportTicketList from './ticketlist/SupportTicketList';
import AdminTicketList from './ticketlist/AdminTicketList';
import Header from './components/Header';
import SLAPage from './sla/SLAPage';
import UserKnowledgeBase from './knowledgebase/UserKnowledgeBase';
import SupportKnowledgeBase from './knowledgebase/SupportKnowledgeBase';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

const SupportAdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user || (user.status !== 'support' && user.status !== 'admin')) {
        return <Navigate to="/tickets" />;
    }
    return children;
};

function AppContent() {
    const { user } = useAuth();

    return (
        <Router>
            {user && <Header />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/tickets"
                    element={
                        <ProtectedRoute>
                            {user?.status === 'admin' ? (
                                <AdminTicketList />
                            ) : user?.status === 'support' ? (
                                <SupportTicketList />
                            ) : (
                                <UserTicketList />
                            )}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add"
                    element={
                        <ProtectedRoute>
                            <AddTicket />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sla"
                    element={
                        <SupportAdminRoute>
                            <SLAPage />
                        </SupportAdminRoute>
                    }
                />
                <Route
                    path="/knowledge"
                    element={
                        <ProtectedRoute>
                            {(user?.status === 'admin' || user?.status === 'support') ? (
                                <SupportKnowledgeBase />
                            ) : (
                                <UserKnowledgeBase />
                            )}
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/tickets" />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
