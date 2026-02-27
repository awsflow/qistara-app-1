const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory store (replace with database in production)
let tasks = [
  {
    id: uuidv4(),
    title: 'Set up server on AWS EC2',
    description: 'Launch RHEL instance and configure Nginx',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Configure domain qistara.co.in',
    description: 'Point DNS A record to EC2 public IP',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// GET all tasks
router.get('/', (req, res) => {
  const sorted = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ tasks: sorted, total: tasks.length });
});

// GET single task
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST create task
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim() || '',
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PATCH toggle task
router.patch('/:id/toggle', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.completed = !task.completed;
  res.json(task);
});

// DELETE task
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
