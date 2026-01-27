
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';

interface AppBarProps {
  onLogout: () => void;
}

export const AppBar = ({ onLogout }: AppBarProps) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  return (
    <div className="w-full p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* AMS Logo */}
          <div className="flex items-center">
            <div className="w-20 sm:w-24 md:w-28 h-auto">
              <img 
                src="https://leapmile-website.blr1.cdn.digitaloceanspaces.com/AMS.png" 
                alt="AMS Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Confirm Logout</DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  Are you sure you want to logout? You will be redirected to the login screen.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsLogoutDialogOpen(false)}
                  className="text-sm"
                >
                  Cancel
                </Button>
                <Button onClick={handleLogoutConfirm} className="text-sm">
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
