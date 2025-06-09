import React from "react";

// Assets
import '../../assets/css/navbar.css';
import SearchSvg from '../../assets/svg/search.svg';

const Navbar = () => {
  return (
    <>
      <nav>
        <div className="ad-greetings">
          <div className="search-all">
            <div className="search-bar">
              <img src={SearchSvg} />
              <input
                type="text"
                placeholder="Search"
                id="search-all"
                name="search-all"
              />
            </div>
          </div>
        </div>
        <div className="controls">
          <div className="profile-pic">
            <img/>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
