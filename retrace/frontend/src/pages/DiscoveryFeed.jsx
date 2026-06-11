import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';

export default function DiscoveryFeed() {
  const [activeTab, setActiveTab] = useState('lost');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab]);

  const fetchItems = async (type) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/items?type=${type}`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center space-y-6 mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
          Recover what's yours.
        </h1>
        
        {/* Minimalist Toggle */}
        <div className="flex bg-surface border border-border/50 rounded-pill p-1 shadow-subtle">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-6 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${
              activeTab === 'lost' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-6 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${
              activeTab === 'found' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            Found Items
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-secondary">
          Loading...
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No items found</h2>
          <p className="text-secondary">It's quiet here. Check back later.</p>
        </div>
      )}
    </div>
  );
}
