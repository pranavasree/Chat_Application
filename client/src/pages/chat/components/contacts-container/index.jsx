import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";

const Logo = () => {
  return (
    <div className="flex p-3 md:p-5 justify-start items-center gap-2 md:gap-3">
      <svg
        className="w-10 h-10 md:w-11 md:h-11"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer hexagon */}
        <path
          d="M22 2L38.3923 11.5V30.5L22 40L5.60769 30.5V11.5L22 2Z"
          fill="url(#hexGradient)"
          stroke="url(#strokeGradient)"
          strokeWidth="1.5"
        />

        {/* Inner chat bubbles */}
        <g opacity="0.95">
          {/* Left bubble */}
          <rect
            x="12"
            y="16"
            width="12"
            height="8"
            rx="2"
            fill="white"
            opacity="0.9"
          />
          <path d="M15 24L17 26L19 24H15Z" fill="white" opacity="0.9" />

          {/* Right bubble */}
          <rect x="20" y="20" width="12" height="8" rx="2" fill="#4cc9f0" />
          <path d="M29 28L27 30L25 28H29Z" fill="#4cc9f0" />
        </g>

        {/* Notification dot */}
        <circle cx="34" cy="10" r="4" fill="#ff006e">
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        <defs>
          <linearGradient
            id="hexGradient"
            x1="5"
            y1="5"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8338ec" />
            <stop offset="0.5" stopColor="#5a4fcf" />
            <stop offset="1" stopColor="#4361ee" />
          </linearGradient>
          <linearGradient
            id="strokeGradient"
            x1="0"
            y1="0"
            x2="44"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#4cc9f0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
          Whispr
        </span>
        <span className="text-[9px] md:text-[10px] text-gray-400 -mt-1 tracking-widest">
          CONNECT INSTANTLY
        </span>
      </div>
    </div>
  );
};

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full flex flex-col h-screen">
      <div className="shrink-0">
        <Logo />
      </div>

      {/* Direct Messages Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-2 md:px-0">
        <div className="flex items-center justify-between pr-4 md:pr-10 pl-3 md:pl-5 mb-3">
          <Title text="Direct Messages" />
          <NewDM />
        </div>

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          {/* Contact items will go here */}
          <div className="px-2 md:px-3 space-y-1">
            <ContactItem name="John Doe" status="online" unread={3} />
            <ContactItem name="Jane Smith" status="offline" />
            <ContactItem name="Mike Johnson" status="online" unread={1} />
          </div>
        </div>
      </div>

      {/* Channels Section */}
      <div className="my-3 md:my-5">
        <div className="flex items-center justify-between pr-4 md:pr-10 pl-3 md:pl-5 mb-3">
          <Title text="Channels" />
          <button className="text-neutral-400 hover:text-white transition-colors">
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          {/* Channel items will go here */}
          <div className="px-2 md:px-3 space-y-1">
            <ChannelItem name="General" members={45} />
            <ChannelItem name="Random" members={32} />
            <ChannelItem name="Development" members={12} />
          </div>
        </div>
      </div>

      {/* Profile Info at Bottom */}
      <div className="mt-auto shrink-0">
        <ProfileInfo />
      </div>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 text-opacity-90 font-light text-xs md:text-sm">
      {text}
    </h6>
  );
};

const ContactItem = ({ name, status, unread }) => {
  return (
    <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg hover:bg-[#2a2b33] cursor-pointer transition-all group">
      <div className="relative shrink-0">
        <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm">
          {name.charAt(0)}
        </div>
        {status === "online" && (
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 bg-green-500 rounded-full border-2 border-[#1b1c24]"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs md:text-sm font-medium truncate">
          {name}
        </p>
        <p className="text-gray-400 text-[10px] md:text-xs truncate">
          {status === "online" ? "Online" : "Offline"}
        </p>
      </div>
      {unread && (
        <div className="h-4 w-4 md:h-5 md:w-5 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] md:text-xs font-bold">
            {unread}
          </span>
        </div>
      )}
    </div>
  );
};

const ChannelItem = ({ name, members }) => {
  return (
    <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg hover:bg-[#2a2b33] cursor-pointer transition-all group">
      <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-[#2a2b33] flex items-center justify-center text-purple-400 shrink-0">
        <svg
          className="w-5 h-5 md:w-6 md:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs md:text-sm font-medium truncate">
          #{name}
        </p>
        <p className="text-gray-400 text-[10px] md:text-xs">
          {members} members
        </p>
      </div>
    </div>
  );
};

export default ContactsContainer;
