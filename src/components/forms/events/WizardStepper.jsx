const WizardStepper = ({ steps, currentStep, formTitle, t }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold font-somar transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-mainColor text-white shadow-md"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs md:text-sm font-somar font-medium whitespace-nowrap transition-colors duration-300 ${
                  index <= currentStep ? "text-mainColor" : "text-gray-400"
                }`}
              >
                {index === 0 ? formTitle : t(`eventTrips.stepper.${step}`)}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 md:w-20 h-0.5 mx-2 md:mx-4 transition-colors duration-300 ${
                  index < currentStep ? "bg-mainColor" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardStepper;
