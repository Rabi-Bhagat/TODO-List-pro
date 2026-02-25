const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');
const User = require('../models/User');

// @route   GET api/todos
// @desc    Get all user todos
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/todos
// @desc    Add new todo
router.post('/', auth, async (req, res) => {
    const { task, details, priority, category } = req.body;

    try {
        const newTodo = new Todo({
            userId: req.user.id,
            task,
            details,
            priority,
            category
        });

        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/todos/:id
// @desc    Update todo
router.put('/:id', auth, async (req, res) => {
    const { task, details, completed, priority, category } = req.body;

    // Build todo object
    const todoFields = {};
    if (task) todoFields.task = task;
    if (details !== undefined) todoFields.details = details;
    if (completed !== undefined) todoFields.completed = completed;
    if (priority) todoFields.priority = priority;
    if (category) todoFields.category = category;

    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        // Make sure user owns todo
        if (todo.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Gamification: Award XP and calculate streaks on task completion
        if (completed === true && !todo.completed) {
            try {
                const user = await User.findById(req.user.id);
                if (user) {
                    // Award XP and calculate Level
                    user.xp += 15; // 15 XP per task
                    user.level = Math.floor(user.xp / 100) + 1; // Level up every 100 XP

                    // Update Streak
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (!user.lastActivityDate) {
                        user.currentStreak = 1;
                        user.bestStreak = 1;
                    } else {
                        const lastActivity = new Date(user.lastActivityDate);
                        lastActivity.setHours(0, 0, 0, 0);
                        
                        const diffTime = Math.abs(today - lastActivity);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        
                        if (diffDays === 1) {
                            user.currentStreak += 1;
                            if (user.currentStreak > user.bestStreak) {
                                user.bestStreak = user.currentStreak;
                            }
                        } else if (diffDays > 1) {
                            user.currentStreak = 1;
                        }
                    }

                    const todayStr = new Date().toISOString().split('T')[0];
                    if (!user.activeDates) user.activeDates = [];
                    if (!user.activeDates.includes(todayStr)) {
                        user.activeDates.push(todayStr);
                    }

                    user.lastActivityDate = new Date();
                    await user.save();
                }
            } catch (err) {
                console.error("Error updating user XP:", err);
            }
        }

        todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { $set: todoFields },
            { new: true }
        );

        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/todos/:id
// @desc    Delete todo
router.delete('/:id', auth, async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        // Make sure user owns todo
        if (todo.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Todo.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
