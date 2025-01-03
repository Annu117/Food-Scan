import { useEffect, useState } from "react";
import logo from "../assets/logo1.png";

const Header = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="text-gray-600 w-full body-font bg-purple-200 fixed z-20 mx-auto px-6">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900">
          <img
            className="w-11 h-11 text-white rounded-full"
            alt="hero"
            src={logo}
          />
          <span className="ml-3 text-xl">FoodScan</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <ul className="flex justify-center space-x-4 py-4">
            <li>
              <a
                href="#home"
                className={`hover:text-indigo-500 ${
                  activeSection === "home" ? "text-indigo-500 font-bold" : "text-gray-600"
                }`}
              >
                Home
              </a>
            </li>
            <li
              className="relative group"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              {/* Link to Features page */}
              <a
                href="#features"
                className={`hover:text-indigo-500 ${
                  activeSection === "features" ? "text-indigo-500 font-bold" : "text-gray-600"
                } cursor-pointer`}
              >
                Features
              </a>

              {/* Dropdown Menu */}
              {isDropdownVisible && (
                <ul className="absolute top-full left-0 bg-white border border-gray-300 shadow-md rounded-md w-48 py-2">
                  {["Food-Detection", "Recipe-Retrival", "Nutrition-Comparision"].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item}`}
                        className="block px-4 py-2 text-gray-600 hover:bg-purple-200 hover:text-indigo-500"
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <a
                href="#diet-plan"
                className={`hover:text-indigo-500 ${
                  activeSection === "diet-plan" ? "text-indigo-500 font-bold" : "text-gray-600"
                }`}
              >
                Diet Plan
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
