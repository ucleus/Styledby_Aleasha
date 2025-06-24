import React, { useEffect, useState } from 'react';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN;

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      if (!ACCESS_TOKEN || ACCESS_TOKEN === '1233437158243810') {
        setError('Instagram access token not configured properly.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=6&access_token=${ACCESS_TOKEN}`
        );
        
        const data = await response.json();
        
        if (data.error) {
          console.error('Instagram API Error:', data.error);
          setError(`Instagram API Error: ${data.error.message}`);
        } else {
          setPosts(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch Instagram posts:', err);
        setError('Failed to load Instagram posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [ACCESS_TOKEN]);

  // Fallback content when Instagram feed fails or is loading
  const fallbackImages = Array(6).fill(null).map((_, i) => ({
    id: i + 1,
    src: `https://placehold.co/400x400?text=Instagram+Photo+${i + 1}`,
    alt: `Instagram post ${i + 1}`,
    link: 'https://instagram.com/stylesbyaleasha'
  }));

  const displayPosts = posts.length > 0 ? posts : fallbackImages;

  return (
    <section className="py-16 bg-gray-50" id="instagram">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Follow Us on Instagram</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Stay up to date with our latest styles and inspiration by following us on Instagram.
          </p>
        </div>
        
        {error && (
          <div className="text-center mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-700">{error}</p>
            <p className="text-sm text-yellow-600 mt-2">
              Showing placeholder images. Please check your Instagram access token.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center mb-8">
            <p className="text-gray-600">Loading Instagram posts...</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {displayPosts.map((post, index) => (
            <a 
              key={post.id || index} 
              href={post.permalink || post.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block overflow-hidden aspect-square rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img 
                src={post.media_url || post.thumbnail_url || post.src} 
                alt={post.caption ? post.caption.substring(0, 100) + '...' : post.alt}
                className="w-full h-full object-cover transition-transform hover:scale-110"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x400?text=Instagram+Photo+${index + 1}`;
                }}
              />
            </a>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="https://instagram.com/stylesbyaleasha" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-lg"
          >
            @stylesbyaleasha
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;