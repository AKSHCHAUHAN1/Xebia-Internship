import React, { useState } from 'react';
import ItemCard from '../components/ItemCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      let query = `?search=${encodeURIComponent(searchTerm)}`;
      if (category) query += `&category=${encodeURIComponent(category)}`;
      if (type) query += `&type=${encodeURIComponent(type)}`;

      const res = await fetch(`http://localhost:5000/api/items${query}`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Items</h1>
        <p className="text-secondary">Find specific lost or found items in the system.</p>
      </div>

      <div className="bg-surface rounded-card border border-border/50 p-6 shadow-subtle mb-10">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={20} />
            <input 
              type="text" 
              placeholder="Search by keyword..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="input-field sm:w-48 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Documents">Documents</option>
            <option value="Other">Other</option>
          </select>
          
          <select 
            className="input-field sm:w-48 bg-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Any Status</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {loading && <div className="text-center text-secondary py-10">Searching...</div>}

      {!loading && hasSearched && items.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No matches found</h2>
          <p className="text-secondary">Try adjusting your search criteria.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
