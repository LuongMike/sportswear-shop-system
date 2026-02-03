import { useEffect, useState, useRef } from "react";
import AnnouncementBanner from "./AnnouncementBanner";
import MainHeader from "./MainHeader";
import TopBanner from "./TopBanner";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const topBannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const topBannerHeight = topBannerRef.current?.offsetHeight || 0;
          setIsSticky(scrollY > topBannerHeight);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="relative">
        {/* Top Banner - Miễn phí vận chuyển */}
        <div ref={topBannerRef}>
          <TopBanner />
        </div>

        {/* Main Header - Logo + Navigation + Icons */}
        <div
          className={`transition-all duration-300 ease-out ${
            isSticky ? "fixed top-0 left-0 w-full z-50 " : "relative bg-white"
          }`}
        >
          <MainHeader />
        </div>

        {/* Announcement Banner - Black Friday */}
        {/* <div className={`${isSticky ? "relative z-40" : ""}`}>
        </div> */}
      </header>

      {/* Spacer khi sticky để tránh content jump */}
      {isSticky && <div className="h-16"></div>}
    </>
  );
};

export default Header;
