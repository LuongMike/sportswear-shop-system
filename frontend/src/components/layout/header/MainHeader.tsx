import NavigationMenu from "./navbar/NavigationMenu";
import Logo from "./navbar/Logo";
import HeaderIcons from "./navbar/HeaderIcons";

const MainHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 relative w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Navigation Menu */}
          <div className="hidden lg:block flex-1 mx-8 relative z-10">
            <NavigationMenu />
          </div>

          {/* Right Icons */}
          <HeaderIcons />

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
