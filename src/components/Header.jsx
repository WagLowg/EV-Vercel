// Header.jsx - Tesla Style
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - Tesla Style */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-black tracking-tight">
            <span className="text-3xl">A</span>utoCare
          </div>
        </div>

        {/* Navigation Menu - Center */}
        <nav className="hidden md:flex items-center space-x-8 text-black font-medium text-sm">
          <button 
            onClick={() => scrollToSection('home')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Trang Chủ
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Dịch Vụ
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Về Chúng Tôi
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Liên Hệ
          </button>
          <button 
            onClick={() => scrollToSection('booking')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Đặt Lịch
          </button>
        </nav>

        {/* Right Icons - Tesla Style */}
        <div className="flex items-center space-x-4">
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-6 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Trang Chủ
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Dịch Vụ
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Về Chúng Tôi
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Liên Hệ
            </button>
            <button 
              onClick={() => scrollToSection('booking')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Đặt Lịch
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}