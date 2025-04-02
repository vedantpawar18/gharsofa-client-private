import React, { useState, useEffect } from 'react';

const ImageGallery = ({ thumbnail, galleryImg }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Combine thumbnail and gallery images, ensuring no duplicates
    if (thumbnail) {
      const images = [thumbnail];
      if (galleryImg && galleryImg.length > 0) {
        galleryImg.forEach(img => {
          if (img !== thumbnail) {
            images.push(img);
          }
        });
      }
      setAllImages(images);
      setSelectedImage(thumbnail);
    }
  }, [thumbnail, galleryImg]);

  const ImageModal = ({ image, onClose }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
        <img
          src={image}
          alt="Full size view"
          className="max-w-full max-h-full object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
        >
          ×
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Main large image display */}
      <div 
        className="w-full h-[600px] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center cursor-zoom-in hover:opacity-95 transition-opacity"
        onClick={() => setShowModal(true)}
      >
        <img
          src={selectedImage || thumbnail}
          alt="Main product view"
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnail gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-4">
          {allImages.map((image, index) => (
            <div 
              key={index} 
              className={`h-24 bg-gray-50 rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:opacity-80 ${
                selectedImage === image ? 'border-blue-500 ring-2 ring-blue-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal for full-size view */}
      {showModal && (
        <ImageModal
          image={selectedImage || thumbnail}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ImageGallery;





