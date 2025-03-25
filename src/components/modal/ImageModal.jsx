export default function ImageModal({ isOpen, onClose, imageUrl }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed p-2 md:p-8 bg-gray-900/70 inset-0 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative p-1 bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute -top-8 cursor-pointer -right-1 md:-right-6 bg-gray-600 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center"
          onClick={onClose}
        >
          <span className="text-white text-sm md:text-lg cursor-pointer">✕</span>
        </button>

        {/* Modal Image */}
        <div className="w-[300px] h-[200px] sm:w-[350px] sm:h-[250px] md:w-[600px] md:h-[400px] overflow-hidden rounded">
          <img
            src={imageUrl}
            alt="Modal"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
