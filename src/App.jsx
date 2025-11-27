import React from 'react';
import PlayDesigner from './features/PlayDesigner';
import './index.css';

function App() {
  return (
    <>
      <header className="app-header">
        <h1 className="app-title">🏐 Handball Play Designer</h1>
      </header>

      <PlayDesigner />
    </>
  );
}

export default App;
