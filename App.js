import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchTasks();
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await axios.get(`${API_URL}/health`);
      setHealth(res.data);
    } catch (err) {
      setHealth({ status: 'error', message: 'Backend not reachable' });
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(`${API_URL}/tasks`, { title, description });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.patch(`${API_URL}/tasks/${id}/toggle`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Qistara</h1>
        <p className="subtitle">Task Management</p>
        {health && (
          <span className={`health-badge ${health.status}`}>
            API: {health.status}
          </span>
        )}
      </header>

      <main className="main">
        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-primary">Add Task</button>
        </form>

        <div className="stats">
          <span>Total: {tasks.length}</span>
          <span>Done: {tasks.filter(t => t.completed).length}</span>
          <span>Pending: {tasks.filter(t => !t.completed).length}</span>
        </div>

        <div className="task-list">
          {tasks.length === 0 && <p className="empty">No tasks yet. Add one above!</p>}
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <div className="task-content" onClick={() => toggleTask(task.id)}>
                <span className="checkbox">{task.completed ? '✓' : ''}</span>
                <div>
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <small className="task-date">{new Date(task.createdAt).toLocaleString()}</small>
                </div>
              </div>
              <button className="btn btn-delete" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>qistara.co.in</p>
      </footer>
    </div>
  );
}

export default App;
