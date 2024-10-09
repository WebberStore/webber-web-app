import React from 'react'
import { MdShoppingCart, MdAccountCircle, MdSearch } from 'react-icons/md'
import { FaLeaf } from 'react-icons/fa'

const Navbar = ({ name }) => {
  return (
    <nav className="bg text-black py-2 px-4 bg-[#fcf5f5]">
      <div className="container mx-auto flex ">
        <div className="flex space-x-5 px-2">
          <a
            href="/buyer/account"
            className="text-black flex items-right border-2 border-white rounded-lg  ml-10 hover:no-underline"
          >
            <span>{name}</span>
            <MdAccountCircle size="25px" className="mr-1 ml-1" />
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
