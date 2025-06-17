import React from 'react';

const About = () => {
  return (
    <section className="h-screen w-full bg-white flex items-center" id="about">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
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