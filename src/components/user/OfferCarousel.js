import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

// Import your banner images here
import banner1 from '../../assets/images/1.png';
import banner2 from '../../assets/images/2.jpg';
import banner3 from '../../assets/images/3.jpg';
import banner4 from '../../assets/images/4.jpg';
import banner5 from '../../assets/images/5.jpg'; // Additional banners
import banner6 from '../../assets/images/6.jpg';
import banner7 from '../../assets/images/7.jpg';

const OfferCarousel = () => {
  const [shuffledItems, setShuffledItems] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Original carousel items
  const carouselItems = [
    {
      id: 1,
      image: banner1,
      title: "Modern Living Room Collection",
      subtitle: "Up to 40% Off",
      description: "Transform your living space with our exclusive furniture collection",
      link: "/shop?category=Sofas%20%26%20Couches",
      position: "left",
      theme: "dark"
    },
    {
      id: 2,
      image: banner2,
      title: "Bedroom Essentials",
      subtitle: "Starting at ₹14,999",
      description: "Create your perfect sanctuary with our bedroom furniture",
      link: "/shop?category=Beds%20%26%20Mattresses",
      position: "right",
      theme: "light"
    },
    {
      id: 3,
      image: banner3,
      title: "Office Furniture Sale",
      subtitle: "Save 30% Today",
      description: "Upgrade your workspace with ergonomic solutions",
      link: "/shop?category=Office%20Furniture",
      position: "center",
      theme: "dark"
    },
    {
      id: 4,
      image: banner4,
      title: "Outdoor Collection",
      subtitle: "New Arrivals",
      description: "Beautiful furniture for your outdoor spaces",
      link: "/shop?category=Outdoor%20Furniture",
      position: "left",
      theme: "light"
    },
    {
      id: 5,
      image: banner5,
      title: "New Kitchen Trends",
      subtitle: "Up to 50% Off",
      description: "Revamp your kitchen with modern designs",
      link: "/shop?category=Kitchen%20Furniture",
      position: "right",
      theme: "dark"
    },
    {
      id: 6,
      image: banner6,
      title: "Home Decor Essentials",
      subtitle: "Exclusive Styles",
      description: "Add a personal touch to every corner",
      link: "/shop?category=Home%20Decor",
      position: "center",
      theme: "light"
    },
    {
      id: 7,
      image: banner7,
      title: "Winter Collection",
      subtitle: "Up to 60% Off",
      description: "Stay warm and stylish with our winter furniture range",
      link: "/shop?category=Winter%20Furniture",
      position: "left",
      theme: "dark"
    }
  ];

  // Shuffle the carousel items array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setShuffledItems(shuffleArray(carouselItems));
  }, []);

  const getPositionClasses = (position) => {
    switch (position) {
      case 'left':
        return 'left-8 sm:left-16 lg:left-24';
      case 'right':
        return 'right-8 sm:right-16 lg:right-24';
      default:
        return 'left-1/2 transform -translate-x-1/2';
    }
  };

  const getThemeClasses = (theme) => {
    return theme === 'dark' 
      ? 'text-white bg-black/40' 
      : 'text-gray-800 bg-white/80';
  };

  return (
    <div className="offer-carousel-container">
      <Slider {...settings}>
        {shuffledItems.map((item) => (
          <div key={item.id} className="relative">
            <div className="h-[300px] md:h-[400px] lg:h-[500px] relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              
              <div className={`absolute ${getPositionClasses(item.position)} top-1/2 transform -translate-y-1/2`}>
                <div className={`backdrop-blur-sm rounded-lg p-6 md:p-8 ${getThemeClasses(item.theme)}`}>
                  <span className="text-sm md:text-base font-medium opacity-90">Special Offer</span>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mt-2">{item.title}</h2>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold mt-2">{item.subtitle}</p>
                  <p className="mt-2 text-sm md:text-base opacity-90">{item.description}</p>
                  <Link to={item.link}>
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      Shop Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default OfferCarousel;
