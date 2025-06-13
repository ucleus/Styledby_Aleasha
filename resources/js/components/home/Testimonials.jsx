import React from 'react';
import { Card } from '../ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    text: 'Aleasha completely transformed my hair! She listened to what I wanted and delivered beyond my expectations. So happy with my new look!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    text: 'Best haircut I\'ve ever had. Aleasha took the time to understand my style and gave me exactly what I was looking for. Highly recommend!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Jessica Martinez',
    text: 'I love my new color! Aleasha is so talented and really knows how to bring your vision to life. The salon atmosphere is also very welcoming and relaxing.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-playfair mb-4">Client Testimonials</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Don't just take our word for it - hear what our clients have to say about their experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold">- {testimonial.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;