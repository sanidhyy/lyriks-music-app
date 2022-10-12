import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";
import { AiFillGithub } from "react-icons/ai";

import { logo } from "../assets";
import { links } from "../assets/constants";

// Navbar Links
const NavLinks = ({ handleClick }) => (
  <div className="mt-10">
    {/* render each nav link */}
    {links.map((link) => (
      <NavLink
        key={link.name}
        to={link.to}
        className="flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400"
        onClick={() => handleClick && handleClick()}
      >
        {<link.icon className="w-6 h-6 mr-2" />}
        {link.name}
      </NavLink>
    ))}
    <a
      href="https://github.com/Technical-Shubham-tech/lyriks-music-app"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400"
    >
      <AiFillGithub className="w-6 h-6 mr-2" />
      Source Code
    </a>
  </div>
);

// Sidebar
const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // handle menu click
  const handleClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Menu */}
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#191624]">
        <Link to="/">
          {/* Brand Logo */}
          <img src={logo} alt="Lyriks" className="w-full h-14 object-contain" />
        </Link>
        <NavLinks />
      </div>

      {/* Mobile Menu Icon */}
      <div className="absolute md:hidden block top-6 right-3">
        {mobileMenuOpen ? (
          <RiCloseLine
            className="w-6 h-6 text-white mr-2"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : (
          <HiOutlineMenu
            className="w-6 h-6 text-white mr-2"
            onClick={() => setMobileMenuOpen(true)}
          />
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 h-screen w-2/3 bg-graident-to-tl from-white/10 to-[#483d8b] backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${
          mobileMenuOpen ? "left-0" : "-left-full"
        }`}
      >
        <Link to="/" onClick={handleClick}>
          {/* Brand Logo */}
          <img src={logo} alt="Lyriks" className="w-full h-14 object-contain" />
        </Link>
        <NavLinks handleClick={handleClick} />
      </div>
    </>
  );
};

export default Sidebar;
