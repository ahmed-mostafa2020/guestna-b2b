import Image from "next/image";

import successBooking from "@assets/successBooking.png";

const SuccessImage = () => {
  return (
    <div className="mx-auto centered animate-rotation lg:-mt-8 w-fit">
      <Image
        src={successBooking}
        width={600}
        height={600}
        alt="success booking"
        priority="true"
      />
    </div>
  );
};

export default SuccessImage;
