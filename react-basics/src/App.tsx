import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Header } from './components/Header'
import { Card } from './components/Card'
import { Counter } from './components/Counter'

function App() {
  return (
    <div style={{ padding:20}}>
      <h1>Day 5 - useState</h1>
      <Counter />
    </div>
  );
}

export default App;
