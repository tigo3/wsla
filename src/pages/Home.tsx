
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Layers, LineChart, Paintbrush } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-6 border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">Wsla</h1>
          <div className="space-x-3">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-14">
              <div className="lg:w-1/2 space-y-6">
                <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
                  Your <span className="gradient-text">Personal Hub</span> for All Your Links
                </h2>
                <p className="text-lg text-gray-700">
                  Create a customizable landing page to share all your important links with your audience.
                  Simple to set up, easy to use, and beautiful to look at.
                </p>
                <div className="space-x-4 pt-4">
                  <Button size="lg" className="px-6" asChild>
                    <Link to={isAuthenticated ? "/dashboard" : "/register"} className="flex items-center gap-2">
                      {isAuthenticated ? "Go to Dashboard" : "Get Started — It's Free"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-6" asChild>
                    <Link to="/example">
                      View Example
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gradient-to-br from-brand-purple/10 to-brand-purple-dark/10 p-4 rounded-2xl">
                  <div className="bg-white rounded-xl shadow-xl p-6 border">
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                      <h3 className="text-xl font-bold text-gray-900">@username</h3>
                      <p className="text-gray-700 text-center mt-1">Your personal bio goes here</p>
                    </div>
                    <div className="space-y-3">
                      <div className="w-full h-12 bg-brand-purple text-white rounded-lg flex items-center justify-center">
                        My Website
                      </div>
                      <div className="w-full h-12 bg-brand-purple text-white rounded-lg flex items-center justify-center">
                        Twitter
                      </div>
                      <div className="w-full h-12 bg-brand-purple text-white rounded-lg flex items-center justify-center">
                        YouTube
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Everything You Need</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Paintbrush className="h-10 w-10 text-brand-purple mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-900">Customizable</h3>
                <p className="text-gray-700">
                  Choose from various themes, button styles, and fonts to match your personal brand.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <LineChart className="h-10 w-10 text-brand-purple mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-900">Analytics</h3>
                <p className="text-gray-700">
                  Track visits to your profile and clicks on your links to measure engagement.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Layers className="h-10 w-10 text-brand-purple mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-900">Easy to Use</h3>
                <p className="text-gray-700">
                  Simple, intuitive interface makes it quick to set up and manage your links.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-10 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold gradient-text">Wsla</h2>
              <p className="text-gray-700 mt-1">Share your links, your way.</p>
            </div>
            <div>
              <p className="text-gray-700">
                &copy; {new Date().getFullYear()} Wsla. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
