import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import FileUpload from './components/FileUpload';
import './index.css'; // Adjust the path if necessary

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Chat />} />
        <Route path='/upload' element={<FileUpload />} />
      </Routes>
    </Router>
  );
};

export default App;
