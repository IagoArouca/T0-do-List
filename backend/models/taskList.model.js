const mongoose = require('mongoose');

const TaskListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' 
    }]
}, { timestamps: true });

const TaskList = mongoose.model('TaskList', TaskListSchema);

module.exports = TaskList;