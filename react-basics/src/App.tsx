import React from 'react';
import './App.css';
import { Counter } from './components/Counter';
import { TaskList } from './components/TaskList';
import { tasks } from './data';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Week 1 - React Fundamentals</h1>

      <Counter />

      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
