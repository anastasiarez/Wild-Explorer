import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const AccountNav = () => {
  const { pathname } = useLocation();
  let subpage = pathname.split("/")?.[2];
  if (subpage === undefined) {
    subpage = "profile";
  }

  function linkClasses(type = null) {
    let classes = "inline-flex gap-1 py-2 px-6 rounded-full";

    if (type === subpage) {
      classes += "bg-primary text-white rounded-full";
    } else {
      classes += "bg-gray-200";
    }
    return classes;
  }

  return (
    <nav className="w-full flex justify-center mt-10 gap-10 mb-10">
      <Link
        className={`${linkClasses("profile")} py-2 px-4 bg-primary text-white rounded-full`}
        to={"/account"}
      >
        My Profile
      </Link>

      <Link
        className={`${linkClasses("bookings")} py-2 px-4 bg-primary text-white rounded-full`}
        to={"/account/bookings"}
      >
        My Bookings
      </Link>

      <Link
        className={`${linkClasses("places")} py-2 px-4 bg-primary text-white rounded-full`}
        to={"/account/places"}
      >
        My Places
      </Link>
    </nav>
  );
};

export default AccountNav;
