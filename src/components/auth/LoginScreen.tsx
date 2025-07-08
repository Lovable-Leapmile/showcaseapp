
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleIdentificationChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, '');
    setIdentificationNumber(numericValue);
    
    // Auto-generate password (last 6 digits)
    if (numericValue.length >= 6) {
      setPassword(numericValue.slice(-6));
    } else {
      setPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identificationNumber || identificationNumber.length < 6) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid identification number (at least 6 digits).",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length !== 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be exactly 6 digits.",
        variant: "destructive",
      });
      return;
    }

    // Simulate login success
    toast({
      title: "Login Successful",
      description: "Welcome to AMS Showcase!",
    });
    
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-100 h-32 mx-auto mb-6 flex items-center justify-center">
            <img 
              src="https://ams-bucket.blr1.cdn.digitaloceanspaces.com/Ace-ams.png" 
              alt="AMS Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access AMS Showcase</p>
        </div>

        {/* Login Form */}
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identification">Identification Number</Label>
                <Input
                  id="identification"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter your identification number"
                  value={identificationNumber}
                  onChange={(e) => handleIdentificationChange(e.target.value)}
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Last 6 digits of mobile number"
                  value={password}
                  readOnly
                  className="rounded-lg bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Password is automatically generated from the last 6 digits of your identification number
                </p>
              </div>

              <Button
                type="submit"
                className="w-full rounded-lg py-3 text-base font-medium"
                disabled={!identificationNumber || identificationNumber.length < 6}
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Enter your identification number to auto-generate your password</p>
        </div>
      </div>
    </div>
  );
};
