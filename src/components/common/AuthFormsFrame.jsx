const AuthFormsFrame = ({ title, children }) => {
  return (
    <div className="border border-[#313131] rounded-2xl bg-white transition-all duration-200 ease-in-out">
      <h1 className="px-4 py-6 text-lg font-semibold text-center text-black border-b border-black">
        {title}
      </h1>

      <div className="px-4 py-8">{children}</div>
    </div>
  );
};

export default AuthFormsFrame;
