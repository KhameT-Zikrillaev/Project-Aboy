import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

const CustomModal = ({ isOpen, onClose, title, children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 400); // Animatsiya tugaguncha kutish
    }
  }, [isOpen]);

  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose(); // Tashqi joy bosilganda modal yopiladi
    }
  };

  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 mt-[120px] flex p-2 items-center justify-center bg-black/15 bg-opacity-70 z-50 transition-opacity ease-in duration-400 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-gray-900 text-white h-full min-w-[320px] max-w-[1440px] w-full p-6 pb-0  rounded-lg shadow-lg relative transform transition-all max-h-[90vh] overflow-y-scroll ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* Modal header */}
        <div className="flex justify-between items-center  border-gray-600 pb-2">
          <div className="text-lg font-semibold text-gray-100 ">{title}</div>
          <button
            onClick={onClose}
            className="text-gray-100  cursor-pointer"
          >
            <MdOutlineCancel className="text-[25px] hover:text-red-400 transition"/>
          </button>
        </div>

        {/* Modal content */}
        <div className="py-2">{children}</div>
        
      </div>
    </div>
  );
};

export default CustomModal;
