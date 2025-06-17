import MarketingCardFront from "./MarketingCardFront";
import MarketingCardBack from "./MarketingCardBack";

const MarketingCard = ({ market }) => {
  return (
    <div className="group h-[510px] w-full [perspective:1000px] cursor-grab">
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front card */}
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
          <MarketingCardFront market={market} />
        </div>

        {/* Back card */}
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <MarketingCardBack market={market} />
        </div>
      </div>
    </div>
  );
};

export default MarketingCard;
