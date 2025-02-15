import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut, Settings } from "lucide-react";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useAuthenticator();

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center mb-8">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        JobTracker
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-6 text-gray-700">
        <Link to="/add" className="hover:text-blue-500">Add Application</Link>
        <Link to="/applications" className="hover:text-blue-500">My Applications</Link>
        <Link to="/interviews" className="hover:text-blue-500">Upcoming Interviews</Link>
      </div>

      {/* User Profile */}
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
          <img src="/avatar.png" alt="User Avatar" className="w-8 h-8 rounded-full border" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
            <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100">
              <Settings size={16} className="mr-2" /> Settings
            </Link>
            <button onClick={signOut} className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-gray-100">
              <LogOut size={16} className="mr-2" /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu size={24} />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col items-center md:hidden">
          <Link to="/add" className="w-full py-2 text-center hover:bg-gray-100">Add Application</Link>
          <Link to="/applications" className="w-full py-2 text-center hover:bg-gray-100">My Applications</Link>
          <Link to="/interviews" className="w-full py-2 text-center hover:bg-gray-100">Upcoming Interviews</Link>
          <Link to="/settings" className="w-full py-2 text-center hover:bg-gray-100">Settings</Link>
          <button className="w-full py-2 text-red-500 text-center hover:bg-gray-100">Sign Out</button>
        </div>
      )}
    </nav>
  );
}
