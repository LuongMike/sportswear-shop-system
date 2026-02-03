import Logo from "./Logo";
import NavigationMenu from "./NavigationMenu";
import SearchBar from "./SearchBar";
import HeaderIcons from "./HeaderIcons";

const Navbar = () => {
  return (
    <div className="relative bg-black text-white z-50">
      <div className="flex items-center justify-between py-4 px-8">
        <Logo />
        <NavigationMenu />
        <div className="flex gap-6">
          <SearchBar />
          <HeaderIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
