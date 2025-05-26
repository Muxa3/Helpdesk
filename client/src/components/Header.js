import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
    const { logout, user } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Helpdesk</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/tickets">Тикеты</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/knowledge">База знаний</Link>
                        </li>
                        {(user?.status === 'support' || user?.status === 'admin') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/sla">SLA</Link>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex">
                        <button 
                            onClick={logout} 
                            className="btn btn-outline-light"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header; 