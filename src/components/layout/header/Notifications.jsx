import { bellIcon } from "@assets/svg";

const Notifications = () => {
  return (
    <div className="relative">
      {bellIcon}
      <span className="h-4 w-4 centered text-center rounded-full bg-[#F93C65] text-white text-xs absolute -start-1 -top-[6px]">
        0
      </span>
    </div>
  );
};

export default Notifications;
