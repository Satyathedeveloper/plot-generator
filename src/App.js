import React from 'react';
import './App.css';
import ResizableComponent from './ResizableComponent';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React and Flask Plot Viewer</h1>
      </header>
      <main>
        {/* <PlotViewer /> */}
        <ResizableComponent/>
      </main>
    </div>
  );
}

export default App;













