import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from '../context/AuthContext';
import './TicketList.css';

function UserTicketList() {
    const [tickets, setTickets] = useState([]);
    const { user, logout } = useAuth();

    const loadTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/tickets`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTickets(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            } else {
                alert("Ошибка при загрузке тикетов. Проверьте консоль для деталей.");
            }
        }
    };

    useEffect(() => {
        loadTickets();
    }, [user._id]);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Мои тикеты</h2>
                <div>
                    <Link to="/add" className="btn btn-primary me-2">
                        Создать тикет
                    </Link>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped ticket-table">
                    <thead>
                        <tr>
                            <th className="title">Название</th>
                            <th className="description">Описание</th>
                            <th className="status">Статус</th>
                            <th className="priority">Приоритет</th>
                            <th className="date">Дата создания</th>
                            <th className="author">Автор</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket._id}>
                                <td className="title" title={ticket.title}>{ticket.title}</td>
                                <td className="description">{ticket.description}</td>
                                <td className="status">{ticket.status}</td>
                                <td className="priority">{ticket.priorityRating || '-'}</td>
                                <td className="date">{new Date(ticket.createdAt).toLocaleString()}</td>
                                <td className="author">{ticket.userId?.username || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserTicketList; 