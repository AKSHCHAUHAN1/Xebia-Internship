import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ItemCard({ item }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card group hover:bg-surface-container-low transition-colors cursor-pointer"
    >
      <Link to={`/item/${item.id}`} className="block">
        {item.image ? (
          <div className="w-full h-48 sm:h-64 rounded-image overflow-hidden mb-4 bg-secondary-container">
            <img 
              src={`http://localhost:5000${item.image}`} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64 rounded-image mb-4 bg-background flex items-center justify-center border border-border/50">
            <span className="text-secondary text-sm">No Image Provided</span>
          </div>
        )}
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-secondary line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-2 text-xs font-medium">
          <span className="bg-background px-3 py-1 rounded-pill text-secondary">{item.location}</span>
          <span className="bg-background px-3 py-1 rounded-pill text-secondary">{new Date(item.date).toLocaleDateString()}</span>
          <span className="bg-background px-3 py-1 rounded-pill text-secondary uppercase tracking-widest text-[10px]">{item.category}</span>
        </div>
      </Link>
    </motion.div>
  );
}
