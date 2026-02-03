import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Header } from './components/Header'
import { Card } from './components/Card'
import { Counter } from './components/Counter'
import { tasks } from './data'
import { TaskList } from './components/TaskList'

function App() {
  return (
    <div style={{ padding:20}}>
      <h1>Day 6 - Lists & map</h1>
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
