import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './KnowledgeBase.css';

function UserKnowledgeBase() {
    const [articles, setArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/bazaznaniy`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setArticles(response.data);
        } catch (error) {
            alert(`Ошибка при загрузке статей: ${error.response?.data?.message || error.message}`);
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h2>База знаний</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Полезные материалы</h5>
                    <p className="card-text">Здесь вы найдете полезные статьи и инструкции для решения распространенных проблем.</p>
                    
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Поиск по заголовку..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="list-group">
                        {filteredArticles.map((article) => (
                            <div key={article._id} className="list-group-item article-item">
                                <div className="d-flex w-100 justify-content-between align-items-start">
                                    <h5 className="article-title">{article.title}</h5>
                                </div>
                                <p className="article-content">{article.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserKnowledgeBase; 