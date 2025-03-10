import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchForm from "./modules/SearchForm";
const districts = [
  { id: 1, name: "Chilanzar", description: "Описание Chilanzar" },
  { id: 2, name: "Yunsabad", description: "Описание Yunsabad" },
  { id: 3, name: "Mirzo Ulugbek", description: "Описание Mirzo Ulugbek" },
  { id: 4, name: "Yakkasaray", description: "Описание Yakkasaray" },
  { id: 5, name: "Shayxontoxur", description: "Описание Shayxontoxur" },
  { id: 6, name: "Olmazor", description: "Описание Olmazor" },
  { id: 7, name: "Bektemir", description: "Описание Bektemir" },
  { id: 8, name: "Yashnobod", description: "Описание Yashnobod" },
  { id: 9, name: "Mirobod", description: "Описание Mirobod" },
  { id: 10, name: "Sergeli", description: "Описание Sergeli" },
  { id: 11, name: "Uchtepa", description: "Описание Uchtepa" },
  { id: 12, name: "Yangihayot", description: "Описание Yangihayot" },
  { id: 13, name: "Tashkent District", description: "Описание Tashkent District" },
  { id: 14, name: "Samarkand", description: "Описание Samarkand" },
  { id: 15, name: "Bukhara", description: "Описание Bukhara" },
  { id: 16, name: "Khiva", description: "Описание Khiva" },
  { id: 17, name: "Fergana", description: "Описание Fergana" },
  { id: 18, name: "Namangan", description: "Описание Namangan" },
  { id: 19, name: "Andijan", description: "Описание Andijan" },
  { id: 20, name: "Nukus", description: "Описание Nukus" },
  { id: 21, name: "Urgench", description: "Описание Urgench" },
  { id: 22, name: "Navoi", description: "Описание Navoi" },
  { id: 23, name: "Jizzakh", description: "Описание Jizzakh" },
  { id: 24, name: "Termez", description: "Описание Termez" },
];

export default function Report() {
  const [visibleDistricts, setVisibleDistricts] = useState(12);
  const [filteredData, setFilteredData] = useState(districts);
  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };

  return (
    <div className="DirectorReport pt-[150px] p-4">
      <SearchForm data={districts} onSearch={setFilteredData} name={'Omborlar'}  showDatePicker={false}/>
      <div className="grid grid-cols-2 gap-4">
        {filteredData.slice(0, visibleDistricts).map((district) => (
          <Link
            key={district.id}
            to={`/director/report/${district.name}`}
            className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <h4>{district.name}</h4>
            <p>{district.description}</p>
          </Link>
        ))}
      </div>
      {visibleDistricts < filteredData.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreDistricts}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Yana
          </button>
        </div>
      )}
    </div>
  );
}