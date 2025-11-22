import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "CARCARE - CHĂM SÓC XE ĐIỆN",
      subtitle: "Trung Tâm Bảo Dưỡng Xe Điện",
      description: "Chuyên sâu về xe điện với công nghệ tiên tiến và đội ngũ kỹ thuật viên được đào tạo bài bản",
      cta1: "Explore",
      cta2: "Book Service"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "HỆ THỐNG PIN HIỆU SUẤT CAO",
      subtitle: "Bảo Dưỡng Pin Chuyên Nghiệp",
      description: "Kiểm tra và bảo dưỡng hệ thống pin xe điện đảm bảo hiệu suất tối ưu và tuổi thọ cao",
      cta1: "Discover More",
      cta2: "Schedule Now"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "CÔNG NGHỆ TIÊN TIẾN",
      subtitle: "Chẩn Đoán Thông Minh",
      description: "Hệ thống chẩn đoán hiện đại giúp phát hiện sớm và khắc phục mọi vấn đề của xe điện",
      cta1: "Learn More",
      cta2: "Contact Us"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "TỐI ƯU HÓA HIỆU SUẤT",
      subtitle: "Nâng Cấp Hệ Thống Sạc",
      description: "Tối ưu hóa hiệu suất sạc và cập nhật phần mềm xe điện cho trải nghiệm lái tốt nhất",
      cta1: "Explore",
      cta2: "Book Now"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "CAM KẾT CHẤT LƯỢNG",
      subtitle: "Bảo Hành Toàn Diện",
      description: "Dịch vụ bảo dưỡng định kỳ với cam kết chất lượng và bảo hành dài hạn cho xe điện",
      cta1: "Get Started",
      cta2: "Learn More"
    }
  ];

  // Auto play slides - Longer interval for smooth Ken Burns effect
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds to match Ken Burns animation

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="image-slider"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Images */}
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.image})`
            }}
          >
            <div className="slide-content">
              <div className="content-wrapper">
                <h1 className="slide-title">{slide.title}</h1>
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
                <p className="slide-description">{slide.description}</p>
                
                <div className="slide-actions">
                  
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="nav-arrow nav-prev" onClick={prevSlide}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button className="nav-arrow nav-next" onClick={nextSlide}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="dots-container">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default ImageSlider;