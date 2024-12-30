import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaShoppingCart, FaBoxOpen } from "react-icons/fa";

const Header: React.FC = () => {
  const user = { name: "default" };

  return (
    <header className="p-4 text-gray-800">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center gap-5 text-2xl font-bold">
          <img
            className="w-[80px] h-[80px] rounded-full"
            src="https://i.pinimg.com/236x/43/c3/e9/43c3e9fa8fb20adee3321185e128a116.jpg"
            alt="a"
          />
          <Link to="/">Cinnamoroll DrugStore</Link>
        </div>

        <nav className="flex gap-8 ">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            <FaBoxOpen className="w-5 h-5" />
            <span>Products</span>
          </Link>

          <Link
            to="/orders"
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            <FaShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>

          <Link
            to="/cart"
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            <FaShoppingCart className="w-5 h-5" />
            <span>Cart</span>
          </Link>

          <div className="flex items-center space-x-2 hover:text-blue-400">
            <FaUser className="w-5 h-5" />
            <span>{user.name}</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
