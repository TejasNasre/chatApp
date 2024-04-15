import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { IoLogInSharp, IoLogOutSharp } from "react-icons/io5";

const Header = () => {
  const { user, handleUserLogout } = useAuth();
  return (
    <div id="header--wrapper">
      {user ? (
        <>
          Welcome To Dev Talk {user.name}
          <IoLogOutSharp className="header--link" onClick={handleUserLogout} />
        </>
      ) : (
        <>
          <Link to="/">
            <IoLogInSharp className="header--link" />
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;
