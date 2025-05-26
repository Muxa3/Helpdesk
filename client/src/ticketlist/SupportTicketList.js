import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from '../context/AuthContext';
import './TicketList.css';

function SupportTicketList() {
    const [tickets, setTickets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [priorityRating, setPriorityRating] = useState("1");
    const { logout } = useAuth();

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/tickets`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const activeTickets = response.data.filter(ticket => ticket.status !== 'closed');
            setTickets(activeTickets);
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            } else {
                alert("Ошибка при загрузке тикетов. Проверьте консоль для деталей.");
            }
        }
    };

    const handleStartWork = (ticketId) => {
        setSelectedTicketId(ticketId);
        setShowModal(true);
    };

    const handleStatusUpdate = async (id, newStatus, priorityRating = null) => {
        try {
            const token = localStorage.getItem('token');
            const updateData = { status: newStatus };
            if (priorityRating) {
                updateData.priorityRating = priorityRating;
            }
            if (newStatus === 'active') {
                updateData.activatedAt = new Date();
            }
            
            await axios.put(`${API_URL}/tickets/${id}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            loadTickets();
            setShowModal(false);
        } catch (error) {
            alert("Ошибка при обновлении статуса тикета. Проверьте консоль для деталей.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Список тикетов</h2>
                <Link to="/add" className="btn btn-primary">
                    Создать тикет
                </Link>
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
                            <th className="actions">Действия</th>
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
                                <td className="actions">
                                    {ticket.status === 'new' && (
                                        <button
                                            className="btn btn-success me-2"
                                            onClick={() => handleStartWork(ticket._id)}
                                        >
                                            Начать работу
                                        </button>
                                    )}
                                    {ticket.status === 'active' && (
                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={() => handleStatusUpdate(ticket._id, 'closed')}
                                        >
                                            Закрыть
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Установить приоритет</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Выберите приоритет (1-4)</label>
                                    <select 
                                        className="form-select"
                                        value={priorityRating}
                                        onChange={(e) => setPriorityRating(e.target.value)}
                                    >
                                        <option value="1">1 - Низкий</option>
                                        <option value="2">2 - Средний</option>
                                        <option value="3">3 - Высокий</option>
                                        <option value="4">4 - Критический</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Отмена
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={() => handleStatusUpdate(selectedTicketId, 'active', priorityRating)}
                                >
                                    Подтвердить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupportTicketList; 