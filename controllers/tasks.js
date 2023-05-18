const Task = require('../models/tasks.js')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')
const db = require("../models");
const User = db.user;
const jwt = require('jsonwebtoken');
const secret = 'bezkoder-secret-key';

const getAllTasks = asyncWrapper(async (req, res) => {
  try {
    const token = req.session.token;
    const decodedToken = jwt.verify(token, secret);
    const userID = decodedToken.id;

    const tasks = await Task.find({ assignedTo:userID});
    res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

const getAllAdminTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({})
  res.status(200).json({ tasks })
});

const createTask = asyncWrapper( async (req,res) => { 
        try {
          const task = new Task({
            taskDescription: req.body.taskDescription,
            status: req.body.status,
            category: req.body.category,
            startDate: req.body.startDate,
            finishDate: req.body.finishDate,
            hours: req.body.hours,
            days: req.body.days,
          });
        
          // Check if user with assignedTo username exists
          const assignedToUser = await User.findOne({ username: req.body.assignedTo });
          if (!assignedToUser) {
            return res.status(400).send({ message: "Assigned to value does not match a user in the database" });
          }
        
          task.assignedTo = assignedToUser._id;
        
          try {
            await task.save();
            res.status(201).send({ message: "Task created" });
          } catch (err) {
            res.status(500).send({ message: err });
          }
        } catch (error) {
          console.error(error)
          res.status(500).json({message: 'Server Error'})
        }
})

const getTask =asyncWrapper( async (req,res) => {   
        const {id:taskID} = req.params
        const task = await Task.findOne({_id:taskID});
        if (!task) {
            return next(createCustomError(`No task with id : ${taskID}`, 404))
          }        
        res.status(200).json({task}); 
})
const updateTask =asyncWrapper( async (req,res) => {
        const {id:taskID} = req.params
        const task = await Task.findOneAndUpdate({_id:taskID}, req.body,{
            new:true,runValidators:true,useFindAndModify: false
        });
        if (!task) {
            return next(createCustomError(`No task with id : ${taskID}`, 404))
          }
        
        res.status(200).json({task}); 
})
const deleteTask =asyncWrapper( async (req,res) => {
        const {id:taskID} = req.params
        const task = await Task.findOneAndDelete({_id:taskID});
        if (!task) {
            return next(createCustomError(`No task with id : ${taskID}`, 404))
          }
        
        res.status(200).json({task:null,status: 'deleted'});
})

// const editTask = async (req,res) => {
//    
//         const {id:taskID} = req.params
//         const task = await Task.findOneAndUpdate({_id:taskID}, req.body,{
//             new:true,
//             runValidators:true,
//             overwrite:true
//         });
//         if(!task){
//             return res.status(404).json({msg:`no id':${taskID}`})
//         }
//         res.status(200).json({task});
//     } catch (error) {
//         res.status(500).json({msg:error})
//     }
// }

module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
    getAllAdminTasks
}