import React from 'react';

const About = () => {
  return (
    <section className="py-16 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/images/about.jpg" 
                alt="Aleasha - Professional Hair Stylist"
                className="w-full h-full object-cover"
                onLoad={(e) => {
                  console.log('About image loaded successfully!');
                  e.target.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error('About image failed to load:', e.target.src);
                  // Fallback to gray background if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gray-200');
                }}
                style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold font-playfair mb-6">About Aleasha</h2>
            <p className="text-gray-700 mb-4">
              With over 10 years of experience in the hair styling industry, Aleasha has built a reputation for creating
              stunning, personalized styles that bring out the best in each client.
            </p>
            <p className="text-gray-700 mb-4">
              Specializing in color techniques, precision cuts, and formal styling, Aleasha continues to stay at the forefront
              of hair trends and techniques through ongoing education and training.
            </p>
            <p className="text-gray-700">
              Her warm, professional approach ensures that every client leaves feeling confident and beautiful, with a look
              that's perfectly tailored to their individual style and needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;