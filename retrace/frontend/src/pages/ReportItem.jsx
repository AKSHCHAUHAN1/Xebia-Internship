import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportItem() {
  const [type, setType] = useState('lost');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    date: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('type', type);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        body: data
      });
      
      if (res.ok) {
        navigate('/');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to report item');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Report an Item</h1>
        <p className="text-secondary">Provide details to help others identify it.</p>
      </div>

      <div className="bg-surface rounded-card border border-border/50 p-6 sm:p-8 shadow-subtle">
        
        <div className="flex bg-background border border-border/50 rounded-pill p-1 mb-8 w-fit mx-auto">
          <button
            type="button"
            onClick={() => setType('lost')}
            className={`px-6 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${
              type === 'lost' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary'
            }`}
          >
            I Lost Something
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            className={`px-6 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${
              type === 'found' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary'
            }`}
          >
            I Found Something
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input required type="text" name="title" onChange={handleInputChange} className="input-field" placeholder="e.g. Black AirPods Pro" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select required name="category" onChange={handleInputChange} className="input-field bg-white">
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Documents">Documents</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input required type="date" name="date" onChange={handleInputChange} className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input required type="text" name="location" onChange={handleInputChange} className="input-field" placeholder="e.g. Library 2nd Floor" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required name="description" onChange={handleInputChange} rows="3" className="input-field resize-none" placeholder="Provide any distinct features..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photo Upload</label>
            <div className="border border-dashed border-border rounded-input p-6 flex justify-center items-center bg-background/50">
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-pill file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:opacity-90" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
