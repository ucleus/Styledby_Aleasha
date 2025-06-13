import React, { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: 'What should I bring to my first appointment?',
    answer: 'For your first appointment, it\'s helpful to bring inspiration photos of styles you like. Come with clean, dry hair unless instructed otherwise for your specific service.'
  },
  {
    id: 2,
    question: 'How far in advance should I book my appointment?',
    answer: 'We recommend booking 1-2 weeks in advance for regular services and 3-4 weeks for special occasions or complex color services to ensure availability.'
  },
  {
    id: 3,
    question: 'What is your cancellation policy?',
    answer: 'We require 24-hour notice for cancellations. Late cancellations or no-shows may result in a charge of 50% of the service price.'
  },
  {
    id: 4,
    question: 'Do you offer hair care products for purchase?',
    answer: 'Yes, we carry a selection of professional-grade hair care products that we use and recommend for maintaining your style at home.'
  },
  {
    id: 5,
    question: 'How often should I get a haircut?',
    answer: 'This varies depending on your hair type and style, but generally every 4-6 weeks for short styles, 6-8 weeks for medium styles, and 8-12 weeks for longer styles.'
  }
];

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="py-16 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-playfair mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Have questions? Find answers to common inquiries about our services below.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200 py-4">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleItem(faq.id)}
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${openItem === faq.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openItem === faq.id && (
                <div className="mt-2 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;