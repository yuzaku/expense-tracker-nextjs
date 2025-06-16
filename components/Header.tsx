import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

const Header = async () => {
  const user = await currentUser();
  
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Traxpenses
              </h1>
              <p className="text-sm text-gray-500">Personal Finance Tracker</p>
            </div>
          </div>
         
          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              {/* Custom styled Sign In Button */}
              <SignInButton mode="modal">
                <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              {/* User Info - only show if user data is available */}
              {user && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Welcome back,</p>
                  <p className="font-semibold text-gray-900">{user.firstName}</p>
                </div>
              )}
              
              {/* Custom UserButton wrapper with fallback */}
              <div className="flex items-center space-x-3">
                {user && !user.imageUrl ? (
                  // Custom avatar fallback if no image
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.firstName?.[0]?.toUpperCase() || user.emailAddresses?.[0]?.toString().toUpperCase() || 'U'}
                    </span>
                  </div>
                ) : null}
                
                {/* Clerk UserButton with custom styling */}
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full",
                      userButtonPopoverCard: "bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl",
                      userButtonPopoverActionButton: "hover:bg-gray-50 transition-colors",
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;