import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './KnowledgeBase.css';

function SupportKnowledgeBase() {
    const [articles, setArticles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        body: ''
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            if (editingArticle) {
                await axios.put(
                    `${API_URL}/bazaznaniy/${editingArticle._id}`, 
                    formData, 
                    { headers }
                );
            } else {
                await axios.post(
                    `${API_URL}/bazaznaniy`, 
                    formData, 
                    { headers }
                );
            }
            
            setShowModal(false);
            setEditingArticle(null);
            setFormData({ title: '', body: '' });
            loadArticles();
        } catch (error) {
            alert(`Ошибка при сохранении статьи: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            body: article.body
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/bazaznaniy/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                loadArticles();
            } catch (error) {
                alert(`Ошибка при удалении статьи: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>База знаний (для поддержки)</h2>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title">Техническая документация</h5>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingArticle(null);
                                setFormData({ title: '', body: '' });
                                setShowModal(true);
                            }}
                        >
                            Добавить статью
                        </button>
                    </div>

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
                                    <div className="btn-group">
                                        <button 
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => handleEdit(article)}
                                        >
                                            Редактировать
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(article._id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                                <p className="article-content">{article.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingArticle ? 'Редактировать статью' : 'Добавить статью'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Заголовок</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Содержание</label>
                                        <textarea
                                            className="form-control article-content"
                                            value={formData.body}
                                            onChange={(e) => setFormData({...formData, body: e.target.value})}
                                            rows="5"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => setShowModal(false)}
                                        >
                                            Отмена
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {editingArticle ? 'Сохранить' : 'Добавить'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupportKnowledgeBase; 