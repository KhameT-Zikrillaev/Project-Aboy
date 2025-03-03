import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Бургер-иконка для мобильных устройств */}
      {!isSidebarOpen && (
        <button
          className="md:hidden fixed top-8 left-4 z-50 p-2 bg-gray-600 text-white rounded shadow-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      )}

      {/* Сайдбар */}
      <div
        className={`bg-[#17212b] shadow-lg text-white w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition duration-300 ease-in-out mt-[105px] z-40 rounded-r-2xl`}
      >
        {/* Кнопка закрытия (крестик) для мобильных устройств */}
        <button
          className="md:hidden absolute top-3 right-3 p-2 bg-gray-700 rounded-full text-white shadow-md "
          onClick={() => setIsSidebarOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <nav className="mt-4">
          <ul className="space-y-3">
            <li>
              <Link
                to="/admin/admin-panel/statistics"
                className={`block py-3 px-4 rounded-lg transition duration-200 font-medium border-b-2 border-gray-900  ${
                  location.pathname === '/admin/admin-panel/statistics'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                Статистика
              </Link>
            </li>
            <li>
              <Link
                to="/admin/admin-panel/users"
                className={`block py-3 px-4 rounded-lg transition duration-200 font-medium border-b-2 border-gray-900  ${
                  location.pathname === '/admin/admin-panel/users'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                Пользователи
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Затемнение фона при открытом сайдбаре на мобильных устройствах */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBar;
