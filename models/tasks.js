const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  taskDescription: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  finishDate: {
    type: Date,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    default: null,
    required: false,
  },
  complete: {
    type: Boolean, 
    default: false,
    required:false,
  },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;

