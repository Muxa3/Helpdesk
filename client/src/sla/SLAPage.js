import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function SLAPage() {
    const [ticketStats, setTicketStats] = useState({
        total: 0,
        new: 0,
        active: 0,
        closed: 0,
        activePercentage: 0,
        closedPercentage: 0,
        averageResponseTime: 0,
        averageResolutionTime: 0
    });

    useEffect(() => {
        const loadTicketStats = async () => {
            try {
                const response = await axios.get(`${API_URL}/tickets`);
                const tickets = response.data;
                
                // Подсчитываем базовую статистику
                const stats = {
                    total: tickets.length,
                    new: tickets.filter(ticket => ticket.status === 'new').length,
                    active: tickets.filter(ticket => ticket.status === 'active').length,
                    closed: tickets.filter(ticket => ticket.status === 'closed').length
                };

                // Вычисляем проценты
                stats.activePercentage = stats.total > 0 
                    ? ((stats.active / stats.total) * 100).toFixed(1) 
                    : 0;
                stats.closedPercentage = stats.total > 0 
                    ? ((stats.closed / stats.total) * 100).toFixed(1) 
                    : 0;

                // Вычисляем среднее время реагирования
                const ticketsWithResponseTime = tickets.filter(
                    ticket => ticket.activatedAt && ticket.createdAt
                );

                if (ticketsWithResponseTime.length > 0) {
                    const totalResponseTime = ticketsWithResponseTime.reduce((sum, ticket) => {
                        const responseTime = new Date(ticket.activatedAt) - new Date(ticket.createdAt);
                        return sum + responseTime;
                    }, 0);

                    const averageResponseTimeMs = totalResponseTime / ticketsWithResponseTime.length;
                    // Конвертируем миллисекунды в минуты
                    stats.averageResponseTime = (averageResponseTimeMs / (1000 * 60)).toFixed(1);
                } else {
                    stats.averageResponseTime = 0;
                }

                // Вычисляем среднее время решения
                const ticketsWithResolutionTime = tickets.filter(
                    ticket => ticket.closedAt && ticket.activatedAt
                );

                if (ticketsWithResolutionTime.length > 0) {
                    const totalResolutionTime = ticketsWithResolutionTime.reduce((sum, ticket) => {
                        const resolutionTime = new Date(ticket.closedAt) - new Date(ticket.activatedAt);
                        return sum + resolutionTime;
                    }, 0);

                    const averageResolutionTimeMs = totalResolutionTime / ticketsWithResolutionTime.length;
                    // Конвертируем миллисекунды в минуты
                    stats.averageResolutionTime = (averageResolutionTimeMs / (1000 * 60)).toFixed(1);
                } else {
                    stats.averageResolutionTime = 0;
                }
                
                setTicketStats(stats);
            } catch (error) {
                console.error('Error loading ticket statistics:', error);
            }
        };

        loadTicketStats();
    }, []);

    return (
        <div className="container mt-5">
            <h2>SLA мониторинг</h2>
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <h5 className="card-title">Всего тикетов</h5>
                            <h2 className="card-text">{ticketStats.total}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <h5 className="card-title">Новые</h5>
                            <h2 className="card-text">{ticketStats.new}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <h5 className="card-title">В работе</h5>
                            <h2 className="card-text">{ticketStats.active}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <h5 className="card-title">Закрытые</h5>
                            <h2 className="card-text">{ticketStats.closed}</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mt-4">
                <div className="card-body">
                    <h5 className="card-title">Статистика тикетов</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <h6>Базовые показатели:</h6>
                            <ul>
                                <li>Всего тикетов: {ticketStats.total}</li>
                                <li>Новых тикетов: {ticketStats.new}</li>
                                <li>Тикетов в работе: {ticketStats.active}</li>
                                <li>Закрытых тикетов: {ticketStats.closed}</li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h6>Процентные показатели:</h6>
                            <ul>
                                <li>Тикетов в работе: {ticketStats.activePercentage}%</li>
                                <li>Закрытых тикетов: {ticketStats.closedPercentage}%</li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h6>Временные показатели:</h6>
                            <ul>
                                <li>Среднее время реагирования: {ticketStats.averageResponseTime} минут</li>
                                <li>Среднее время решения: {ticketStats.averageResolutionTime} минут</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SLAPage; 