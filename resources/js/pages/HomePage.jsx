import React from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Services from '../components/home/Services';
import Gallery from '../components/home/Gallery';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';
import InstagramFeed from '../components/home/InstagramFeed';

const HomePage = () => {
    return (
        <div>
            <Hero />
            <About />
            <Services />
            <Gallery />
            <InstagramFeed />
            <Testimonials />
            <CTA />
            <FAQ />
        </div>
    );
};

export default HomePage;