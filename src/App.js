import React from "react";
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import LiveDetection from "./LiveDetection/LiveDetection";
import ImageDetection from "./ImageDetection/ImageDetection";
import './App.css'

function App() {

    return (
        <Router>
            <div className="App">
                <div className="App-header">
                    <h1>Heart Stroke Detection</h1>
                </div>
                <nav>
                    <Link to="/live-detection" className="nav-button">Live Detection</Link>
                    <Link to="/" className="nav-button">Image Detection</Link>
                </nav>
                <Routes>
                    <Route path="/live-detection" element={<LiveDetection/>}/>
                    <Route path="/" element={<ImageDetection/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
