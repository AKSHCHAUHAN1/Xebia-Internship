import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MapPin, Search } from 'lucide-react';

export default function Verification() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    claimerName: '',
    claimerEmail: '',
    answer: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}`)
      .then(res => res.json())
      .then(data => setItem(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, ...formData })
      });

      if (res.ok) {
        alert('Claim submitted successfully for verification.');
        navigate(`/item/${id}`);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to submit claim');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col gap-16">
      {/* Section 1: Item Context & Hero */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center px-3 py-1 bg-[#e8e8e8] rounded-full w-max border border-[#cfc4c5]/50">
            <span className="text-[14px] text-[#4c4546] mr-1">●</span>
            <span className="text-[11px] font-semibold text-[#4c4546] uppercase tracking-wider">Pending Verification</span>
          </div>
          <span className="text-[11px] font-semibold text-[#4c4546]">ID: #{item.id}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
          {item.title}
        </h1>
        <p className="text-[15px] text-[#4c4546]">
          {item.type === 'found' ? 'Found on ' : 'Lost on '} 
          {new Date(item.date).toLocaleDateString()}
        </p>

        {item.image && (
          <div className="w-full mt-4 rounded-xl overflow-hidden border border-[#cfc4c5]/50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <img 
              src={`http://localhost:5000${item.image}`} 
              alt={item.title} 
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>
        )}
      </section>

      {/* Section 2: Details & Location */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-[13px] font-medium text-[#4c4546] uppercase tracking-wider">Description</h3>
          <div className="bg-white border border-[#cfc4c5] p-6 rounded-xl h-full shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <p className="text-[17px] text-primary leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[13px] font-medium text-[#4c4546] uppercase tracking-wider">Location {item.type === 'found' ? 'Found' : 'Lost'}</h3>
          <div className="relative bg-white border border-[#cfc4c5] rounded-xl overflow-hidden h-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] min-h-[160px] flex items-end p-4">
            {/* Simulated map background styling */}
            <div className="absolute inset-0 bg-[#f3f3f3] opacity-50"></div>
            <div className="relative z-10 flex items-center gap-3 w-full bg-white/90 backdrop-blur-md p-3 rounded-lg border border-[#cfc4c5]/50">
              <MapPin className="text-primary" size={20} />
              <span className="text-[15px] text-primary font-medium">{item.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Verification Flow */}
      <section className="flex flex-col gap-3 mb-16">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-primary" size={24} />
          <h2 className="text-[20px] font-semibold text-primary">Security Verification</h2>
        </div>

        <div className="bg-white border border-[#cfc4c5] rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#e8e8e8] flex-shrink-0 flex items-center justify-center border border-[#cfc4c5]/30">
              <Search className="text-[#4c4546]" size={20} />
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-[11px] font-semibold text-[#4c4546]">Message from System</span>
              <p className="text-[17px] text-primary">
                "To make sure this is yours, please describe any specific details, marks, or exactly what was inside."
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[#cfc4c5]/30 my-2"></div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium mb-1 text-[#4c4546]">Your Name</label>
                <input required type="text" name="claimerName" onChange={handleChange} className="w-full bg-[#f9f9f9] border border-[#cfc4c5] rounded-lg p-3 text-[15px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-1 text-[#4c4546]">Your Email</label>
                <input required type="email" name="claimerEmail" onChange={handleChange} className="w-full bg-[#f9f9f9] border border-[#cfc4c5] rounded-lg p-3 text-[15px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1 text-[#4c4546]">Your Answer</label>
              <textarea 
                required 
                name="answer" 
                onChange={handleChange} 
                rows="4" 
                className="w-full bg-[#f9f9f9] border border-[#cfc4c5] rounded-lg p-4 text-[15px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all" 
                placeholder="Type your answer here to prove ownership..."
              ></textarea>
            </div>
            
            <div className="flex items-center justify-between mt-2 flex-wrap gap-4">
              <span className="text-[11px] font-semibold text-[#4c4546]/70 flex items-center gap-1">
                Your details are sent securely.
              </span>
              <button disabled={loading} type="submit" className="bg-primary text-white text-[15px] font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2">
                {loading ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
