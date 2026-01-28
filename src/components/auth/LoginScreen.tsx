import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import amsLogo from '@/assets/ams-logo.png';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileNumberChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, '');
    setMobileNumber(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber || mobileNumber.length < 10) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid mobile number (at least 10 digits).",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Invalid Password",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(mobileNumber, password);
      
      if (response.status === 'success') {
        // Store user data persistently
        authService.storeUserData({
          user_name: response.user_name,
          id: response.id,
          token: response.token
        });

        // Proceed to main app immediately
        onLogin();

        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user_name}!`,
        });
      } else {
        // Show the actual error message from the API response
        toast({
          title: "Login Failed",
          description: response.message || 'Login failed. Please try again.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Try to parse error response if it's a fetch error
      let errorMessage = "Unable to connect to the server. Please try again.";
      
      if (error instanceof Error && error.message.includes('HTTP error!')) {
        // For HTTP errors, we'll show a generic message since we can't access the response body here
        errorMessage = "Login failed. Please check your credentials and try again.";
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-28 sm:w-32 md:w-40 h-auto mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <img 
              src={amsLogo} 
              alt="AMS Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-gray-600">Sign in to access AMS Showcase</p>
        </div>

        {/* Login Form */}
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg sm:text-xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm sm:text-base">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => handleMobileNumberChange(e.target.value)}
                  className="rounded-lg text-sm sm:text-base h-10 sm:h-11"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Enter your Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg text-sm sm:text-base h-10 sm:h-11"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-lg py-3 text-sm sm:text-base font-medium h-10 sm:h-11"
                disabled={isLoading || !mobileNumber || !password}
              >
                {isLoading ? "Signing in..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>


        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6 space-y-2">
          <p>© 2024 All Rights Reserved | Leapmile Logistics Pvt.Ltd</p>
          <a 
            href="https://leapmile.com/terms-and-privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Terms and Condition & Privacy Policy / Cookies Policy
          </a>
        </div>
      </div>
    </div>
  );
};
