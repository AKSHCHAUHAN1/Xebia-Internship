import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/items/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading item details...</div>;
  if (!item) return <div className="text-center py-20 text-error">Item not found.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium text-sm">Back to Feed</span>
      </Link>

      <div className="bg-surface rounded-card border border-border/50 overflow-hidden shadow-subtle">
        {item.image ? (
          <div className="w-full h-64 sm:h-96 bg-background">
            <img 
              src={`http://localhost:5000${item.image}`} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64 bg-background flex items-center justify-center border-b border-border/50">
            <span className="text-secondary text-sm">No Image Provided</span>
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-pill text-xs font-semibold uppercase tracking-widest ${item.type === 'lost' ? 'bg-error-container text-on-error-container' : 'bg-primary text-white'}`}>
              {item.type}
            </span>
            <span className="bg-background px-3 py-1 rounded-pill text-secondary text-xs uppercase tracking-widest">
              {item.category}
            </span>
            <span className="bg-background px-3 py-1 rounded-pill text-secondary text-xs">
              {new Date(item.date).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{item.title}</h1>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-primary mb-1 uppercase tracking-widest">Location</h3>
              <p className="text-secondary">{item.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary mb-1 uppercase tracking-widest">Description</h3>
              <p className="text-secondary leading-relaxed">{item.description}</p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border/50 text-center">
            {item.status === 'active' ? (
              <Link to={`/verify/${item.id}`} className="btn-primary w-full py-3 inline-flex">
                {item.type === 'found' ? 'Claim This Item' : 'I Found This Item'}
              </Link>
            ) : (
              <p className="text-secondary font-medium px-4 py-3 bg-background rounded-button">
                This item has a pending claim or is already claimed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
