import React, { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Gallery images - using your actual image names
  const images = [
    {
      id: 1,
      src: '/images/gallery/gallery-1.jpg',
      alt: 'Professional hair styling work',
      category: 'Featured Style',
      fallback: 'https://placehold.co/800x800?text=Gallery+1'
    },
    {
      id: 2,
      src: '/images/gallery/gallery-2.jpg',
      alt: 'Professional hair styling work',
      category: 'Featured Style',
      fallback: 'https://placehold.co/800x800?text=Gallery+2'
    },
    {
      id: 3,
      src: '/images/gallery/gallery-3.jpg',
      alt: 'Professional hair styling work',
      category: 'Featured Style',
      fallback: 'https://placehold.co/800x800?text=Gallery+3'
    },
    {
      id: 4,
      src: '/images/gallery/gallery-4.jpg',
      alt: 'Professional hair styling work',
      category: 'Featured Style',
      fallback: 'https://placehold.co/800x800?text=Gallery+4'
    },
    {
      id: 5,
      src: '/images/gallery/gallery-5.jpg',
      alt: 'Professional hair styling work',
      category: 'Featured Style',
      fallback: 'https://placehold.co/800x800?text=Gallery+5'
    },
    {
      id: 6,
      src: '/images/gallery/gallery-6.jpg',
      alt: 'Professional hair styling work',
      category: 'Featured Style',
      fallback: 'https://placehold.co/800x800?text=Gallery+6'
    },
    {
      id: 7,
      src: '/images/gallery/gallery-7.jpg',
      alt: 'Professional hair styling work',
      category: 'Featured Style',
      fallback: 'https://placehold.co/800x800?text=Gallery+7'
    },
    {
      id: 8,
      src: '/images/gallery/gallery-8.jpg',
      alt: 'Professional hair styling work',
      category: 'Featured Style',
      fallback: 'https://placehold.co/800x800?text=Gallery+8'
    }
  ];

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section className="py-16 bg-gray-50" id="gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Style Gallery</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Browse through some of our recent work and get inspired for your next look.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => openLightbox(image)}
            >
              <div className="relative w-full h-full">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = image.fallback;
                  }}
                />
                {/* Overlay with category */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                  <div className="w-full p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-medium">{image.category}</p>
                  </div>
                </div>
                {/* Zoom icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <h3 className="text-white text-lg font-medium">{selectedImage.category}</h3>
              <p className="text-white/80">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;