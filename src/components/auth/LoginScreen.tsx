
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

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
        // Show specific error message based on API response
        const errorMessage = response.message === 'invalid user' ? 'Invalid user' : 'Invalid credentials. Please try again.';
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "Unable to connect to the server. Please try again.",
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
          <div className="w-60 sm:w-72 md:w-80 h-auto mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <img 
              src="https://ams-bucket.blr1.cdn.digitaloceanspaces.com/Ace-ams.png" 
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

        <div className="text-center text-xs sm:text-sm text-gray-500 px-4">
          <p>Enter your mobile number and password to sign in</p>
        </div>
      </div>
    </div>
  );
};
