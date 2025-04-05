
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowLeft } from 'lucide-react';

const ExamplePage = () => {
  const sampleLinks = [
    { title: 'Personal Website', url: 'https://example.com' },
    { title: 'Twitter / X', url: 'https://twitter.com' },
    { title: 'YouTube Channel', url: 'https://youtube.com' },
    { title: 'Instagram', url: 'https://instagram.com' },
    { title: 'Blog Articles', url: 'https://medium.com' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="container max-w-md mx-auto pt-4">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to home
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-purple to-brand-purple-dark rounded-full mb-4 flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <h1 className="text-2xl font-bold">@johndoe</h1>
              <p className="text-muted-foreground text-center mt-2">
                Digital creator & web developer sharing my journey and favorite resources.
              </p>
            </div>
            
            <div className="space-y-3">
              {sampleLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 bg-brand-purple hover:bg-brand-purple/90 text-white text-center rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {link.title}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Create Your Own</Link>
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          This is just an example. Create your own custom profile with Linkly.
        </p>
      </div>
    </div>
  );
};

export default ExamplePage;
