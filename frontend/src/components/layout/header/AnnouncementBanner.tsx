import { Link } from "react-router";

const AnnouncementBanner = () => {
  return (
    <div className="bg-linear-to-r from-red-600 to-red-700 text-white py-5 w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 text-sm font-medium">
            <span className="font-bold text-base">
              PUMA BLACK FRIDAY DEALS - GIẢM ĐẾN 50%*
            </span>
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <Link to="/collections/black-friday" className="hover:underline">
                XEM TẤT CẢ
              </Link>
              <span>|</span>
              <Link
                to="/collections/nam/black-friday"
                className="hover:underline"
              >
                MUA SẮM NAM
              </Link>
              <span>|</span>
              <Link
                to="/collections/nu/black-friday"
                className="hover:underline"
              >
                MUA SẮM NỮ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
