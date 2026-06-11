import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/70 backdrop-blur-[20px] border-b border-border/50">
      <div className="max-w-[800px] mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">Retrace.</Link>
        
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link to="/search" className="text-secondary hover:text-primary transition-colors">
            <Search size={20} />
          </Link>
          
          <Link to="/report" className="text-secondary hover:text-primary transition-colors">
            <Plus size={20} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
