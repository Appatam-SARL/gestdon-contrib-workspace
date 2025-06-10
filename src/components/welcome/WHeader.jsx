import React,{useState} from 'react'
import logo from '../../assets/logo_icon.png'
import { FaUserCircle } from "react-icons/fa";

const WHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="flex items-center justify-between px-6 py-2 bg-purple-100  shadow-md mb-12 w-full fixed top-0 left-0 z-10">
          <div className=" font-bold text-purple-700 flex items-center">
            <img src={logo} alt="logo" className='w-8' />
            <span className='text-2xl font-bold'>Contrib</span>
            </div>
          <div className="relative">
            <button
                type="button"
              variant="ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-purple-700 text-xl  rounded-[50px] cursor-pointer hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="User Menu"
            >
              <FaUserCircle className='w-8 h-8' />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-lg z-10">
                <a href="#" className="block px-4 py-2 cursor-pointer hover:bg-purple-100">Profil</a>
                <a href="#" className="block px-4 py-2 cursor-pointer hover:bg-purple-100">Déconnexion</a>
              </div>
            )}
          </div>
        </header>
  )
}

export default WHeader
