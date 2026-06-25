import formatDate from "@utils/formatters/FormateDate";
import formatCurrency from "@utils/formatters/FormatCurrency";

const WizardHero = ({ event, dynamicPrice, locale, t }) => {
  const backgroundUrl =
    event.thumbnail?.web ||
    event.thumbnail?.app ||
    (typeof event.image === "string"
      ? event.image
      : event.image?.web || event.image?.app) ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80";

  return (
    <div className="relative min-h-[220px] md:min-h-[280px] lg:min-h-[320px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url("${backgroundUrl}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-[2]" />

      <div className="relative z-20 text-center px-6 py-10 md:py-14 max-w-3xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-somar pb-2 drop-shadow-lg leading-tight">
          {event.name}
        </h1>

        {event.description && (
          <p className="text-gray-200 text-sm md:text-base font-somar max-w-xl mx-auto mb-6 opacity-90 leading-relaxed font-normal">
            {event.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-4">
          {event.day && (
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs md:text-sm px-4 py-2 rounded-full font-somar border border-white/20 shadow-lg">
              📅{" "}
              {formatDate(event.day, locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}

          {dynamicPrice !== undefined && (
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs md:text-sm px-4 py-2 rounded-full font-somar border border-white/20 shadow-lg font-ibm">
              💰{" "}
              {dynamicPrice > 0 ? (
                event.discountedPrice && Number(event.discountedPrice) < Number(event.price) ? (
                  <>
                    <span className="line-through opacity-60 text-xs">{formatCurrency(event.price)}</span>
                    {formatCurrency(event.discountedPrice)}
                  </>
                ) : (
                  formatCurrency(dynamicPrice)
                )
              ) : (
                t("common.free") || "Free"
              )}
            </span>
          )}

          {event.fromHour && (
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs md:text-sm px-4 py-2 rounded-full font-somar border border-white/20 shadow-lg">
              🕐 {event.fromHour} {event.toHour ? `- ${event.toHour}` : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardHero;
