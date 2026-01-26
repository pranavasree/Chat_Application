import Lottie from "lottie-react";
import animationData from "@/assets/lottie-json";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 bg-[#1c1d25] flex flex-col justify-center items-center duration-1000 transition-all px-4">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        className="w-32 h-32 md:w-48 md:h-48 lg:w-52 lg:h-52"
      />
      <div className="text-opacity-80 text-white flex flex-col gap-3 md:gap-5 items-center mt-5 md:mt-10 text-xl md:text-3xl lg:text-4xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          Hi<span className="text-purple-500">!</span> Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Whispr
          </span>
          <span className="text-purple-500">.</span>
        </h3>
        <p className="text-sm md:text-lg text-gray-400 font-light">
          Select a contact to start chatting instantly
        </p>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
