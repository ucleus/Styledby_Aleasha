import React from 'react';

const Gallery = () => {
  // Placeholder for image gallery
  const images = Array(6).fill(null).map((_, i) => ({
    id: i + 1,
    src: `https://placehold.co/600x400?text=Gallery+Image+${i + 1}`,
    alt: `Gallery image ${i + 1}`
  }));

  return (
    <section className="h-screen w-full bg-white flex items-center" id="gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-playfair mb-4">Style Gallery</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Browse through some of our recent work and get inspired for your next look.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="aspect-square overflow-hidden rounded-lg">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;