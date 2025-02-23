import React, { useState, useffect} from "react";
import { Link } from "react-router-dom";
import "./NavbarStyle.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
	const [click, setClick] = useState(false);
	const handleClick = () => setClick(!click);
	const [color, setColor] = useState(false);
	const changeColor = () => {
		if (window.scrollY >= 100) {
			setColor(true);
		} else {
			setColor(false);
		}
	};
  
	window.addEventListener("scroll", changeColor);

	return (
		<div className={color ? "header header-bg" : "header"}>
			<Link to="/">
				{" "}
				<h1>Personal Website</h1>
			</Link>
			<ul className={click ? "nav-menu active" : "nav-menu"}>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/calendar">Calendar</Link>
				</li>
				<li>
					<Link to="/projects">Projects</Link>
				</li>
				<li>
					<Link to="/contact">Contact</Link>
				</li>
			</ul>
			<div className="hamburger" onClick={handleClick}>
				{click ? (
					<FaTimes size={20} style={{ color: "#000" }} />
				) : (
					<FaBars size={20} style={{ color: "#000" }} />
				)}
			</div>
		</div>
	);
};

export default Navbar;
