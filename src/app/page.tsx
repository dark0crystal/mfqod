// pages/index.tsx
import React from 'react';

const IndexPage = () => {
  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen">
      
      

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-96 flex items-center justify-center text-center text-white" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1920x1080)' }}>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Website</h2>
          <p className="text-lg mb-6">Discover the best services we offer to help you achieve your goals</p>
          <a href="#" className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg text-lg">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold mb-4">Feature One</h3>
              <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet lorem turpis.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold mb-4">Feature Two</h3>
              <p className="text-gray-700">Curabitur malesuada dolor at urna auctor, in facilisis nunc fringilla.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold mb-4">Feature Three</h3>
              <p className="text-gray-700">Nulla facilisi. Fusce auctor felis orci, id vestibulum lectus suscipit ac.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">What Our Clients Say</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-xs bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <p className="italic mb-4">"This service is amazing! It has completely changed the way I work."</p>
              <p className="font-semibold">Jane Doe</p>
              <p className="text-gray-500">CEO, Example Co.</p>
            </div>
            <div className="max-w-xs bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <p className="italic mb-4">"Fantastic customer service and great features. Highly recommended!"</p>
              <p className="font-semibold">John Smith</p>
              <p className="text-gray-500">Founder, Smith Ventures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Your Company. All Rights Reserved.</p>
          <p className="mt-4">
            <a href="#" className="hover:text-indigo-300">Privacy Policy</a> | 
            <a href="#" className="hover:text-indigo-300"> Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;

