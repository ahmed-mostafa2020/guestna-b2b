import LargeSeparator from "./LargeSeparator";
import SmallSeparator from "./SmallSeparator";

const ResponsiveSeparator = () => {
  return (
    <>
      <div className="hidden lg:block">
        <LargeSeparator />
      </div>

      <div className="block lg:hidden">
        <SmallSeparator />
      </div>
    </>
  );
};

export default ResponsiveSeparator;
