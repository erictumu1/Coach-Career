function WelcomeBanner() {
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-customTealdark via-[#197571] to-customTeal rounded-xl shadow-xl transition-transform duration-300 hover:-translate-y-1">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
          Coach Career:
          <br />
          <span className="bg-gradient-to-r from-white via-customTeallight to-[#20938d] bg-clip-text text-transparent">
            Your AI Career Coach Agent.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-100 pt-4 max-w-xl mx-auto md:mx-0 leading-relaxed tracking-wide">
          <span className="block font-semibold text-white">
            Here to help you archieve your{" "}
            <span className=" text-customTeallight">career goals.</span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
