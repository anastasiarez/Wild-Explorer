

const AccountPage = () => {
    return (
        <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
        <Link className={linkClasses("profile")} to={"/account"}>
          {" "}
          My Profile{" "}
        </Link>

        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          {" "}
          My Bookings
        </Link>

        <Link className={linkClasses("places")} to={"/account/places"}>
          {" "}
          My Accomodations{" "}
        </Link>
      </nav>

    );
}

export default AccountPage;