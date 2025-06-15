// src/components/Navbar.tsx
import { useState } from 'react';
import { Menu, X }         from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-sm shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-900">AUT Nursing Tracker</div>

        {/* Desktop (md+) */}
        <ul className="hidden md:flex space-x-6 text-gray-700">
          <li><a href="#home"       className="hover:text-gray-900">Home</a></li>
          <li><a href="#programmes" className="hover:text-gray-900">Programmes</a></li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xs border-t border-gray-200">
          <ul className="flex flex-col p-4 space-y-2 text-gray-700">
            <li><a href="#home"       onClick={() => setOpen(false)}>Home</a></li>
            <li><a href="#programmes" onClick={() => setOpen(false)}>Programmes</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
