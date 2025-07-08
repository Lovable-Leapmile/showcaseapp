
import { useEffect } from 'react';

interface WelcomePopupProps {
  userName: string;
}

export const WelcomePopup = ({ userName }: WelcomePopupProps) => {
  useEffect(() => {
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
        <div className="text-center space-y-6">
          {/* AMS Logo */}
          <div className="w-32 h-auto mx-auto">
            <img 
              src="https://ams-bucket.blr1.cdn.digitaloceanspaces.com/Ace-ams.png" 
              alt="AMS Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Welcome Illustration */}
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          {/* Welcome Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome!
            </h2>
            <p className="text-xl text-gray-600">
              Hello, <span className="font-semibold text-blue-600">{userName}</span>
            </p>
            <p className="text-sm text-gray-500">
              You have successfully signed in to AMS Showcase
            </p>
          </div>
          
          {/* Loading indicator */}
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
