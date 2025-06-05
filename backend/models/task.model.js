const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    description: { 
        type: String,
        required: true, 
        trim: true 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
    taskList: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TaskList', 
        required: true 
    }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;