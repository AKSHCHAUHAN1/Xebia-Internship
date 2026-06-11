import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DiscoveryFeed from './pages/DiscoveryFeed';
import ReportItem from './pages/ReportItem';
import SearchPage from './pages/SearchPage';
import ItemDetails from './pages/ItemDetails';
import Verification from './pages/Verification';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-[800px] w-full mx-auto px-5 sm:px-6 py-8 sm:py-16">
          <Routes>
            <Route path="/" element={<DiscoveryFeed />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/report" element={<ReportItem />} />
            <Route path="/verify/:id" element={<Verification />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
