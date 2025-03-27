import React from 'react';
import { Input} from 'antd'; 
import {FaBox} from "react-icons/fa";

const { Search } = Input;

const SearchFormCustom = ({ 
  onSearch, 
  title, 
}) => {

  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300">
      <div className="flex justify-center md:justify-start items-center">
        <FaBox className="text-3xl text-white" />
        <span className="text-xl font-semibold ml-2 text-white">
          {title}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 w-full">
          <Search
            placeholder="Qidirish"
            enterButton
            className="custom-search max-w-md"
            onSearch={onSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFormCustom;
