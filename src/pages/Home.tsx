
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-6 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">Linkly</h1>
          <div className="space-x-2">
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
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                  Your <span className="gradient-text">Personal Hub</span> for All Your Links
                </h2>
                <p className="text-lg text-muted-foreground">
                  Create a customizable landing page to share all your important links with your audience.
                  Simple to set up, easy to use, and beautiful to look at.
                </p>
                <div className="space-x-4 pt-4">
                  <Button size="lg" asChild>
                    <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                      {isAuthenticated ? "Go to Dashboard" : "Get Started — It's Free"}
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/example" target="_blank" rel="noopener noreferrer">
                      View Example
                    </a>
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gradient-to-br from-brand-purple/10 to-brand-purple-dark/10 p-4 rounded-2xl">
                  <div className="bg-white rounded-xl shadow-xl p-6 border">
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                      <h3 className="text-xl font-bold">@username</h3>
                      <p className="text-muted-foreground text-center mt-1">Your personal bio goes here</p>
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
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Customizable</h3>
                <p className="text-muted-foreground">
                  Choose from various themes, button styles, and fonts to match your personal brand.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Analytics</h3>
                <p className="text-muted-foreground">
                  Track visits to your profile and clicks on your links to measure engagement.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Simple, intuitive interface makes it quick to set up and manage your links.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Linkly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
