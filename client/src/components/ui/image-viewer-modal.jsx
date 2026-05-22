import { IoMdArrowRoundDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { HOST } from "@/utils/constants";

const ImageViewerModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(`${HOST}/${imageUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full z-10 transition-colors"
        >
          <IoClose className="text-2xl" />
        </button>

        {/* Download button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="absolute top-4 left-4 bg-[#8417ff] hover:bg-[#741bda] text-white p-2 rounded-full z-10 transition-colors"
        >
          <IoMdArrowRoundDown className="text-2xl" />
        </button>

        {/* Image */}
        <img
          src={`${HOST}/${imageUrl}`}
          alt="Full size"
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ImageViewerModal;
