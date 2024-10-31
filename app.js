import mongoose from "mongoose";
import express from 'express';
import Task from './models/Task.js';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

const app = express();
app.use(cors());
app.use(express.json());


function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch(e){
      if(e.name === 'ValidationError') {
        res.status(400).send({message : e.message});
      } else if (e.name === 'CastError') {
        res.status(404).send({message : "Cannot find given id."});
      } else {
        res.status(500).send({message : e.message});
      }
    }
  }
}

app.get('/tasks', asyncHandler(async (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  const sortOption = {
    createdAt : sort === 'oldest' ? 'asc' : 'desc'
  };

  const tasks = await Task.find().sort(sortOption).limit(count);  // .find()는 모든 객체를 가져옴

  res.send(tasks);
}))


app.get('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);  // 해당하는 주어진 객체 하나만을 가져옴
  if(task) {
    res.send(task);
  }else {
    res.status(404).send({message : "Cannot find given id."});
  }
}))


app.post('/tasks/', asyncHandler(async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).send(newTask);
}));

app.patch('/tasks/:id', asyncHandler(async(req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if(task){
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  }else{
    res.status(404).send({message : "Cannot find given id."});
  }
}));

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id);

  if(task){
    res.status(204);
  }else{
    res.status(404).send({message : "Cannot find given id."});
  }

}))

app.listen(3000, () => console.log('Server OPEN'));