import { Badge, Card, CardContent } from "@mui/material";
import { memo } from "react";

const ActivitiesTable = ({ data }) => {
  const getTripTypeColor = (type) => {
    switch (type) {
      case "ACTIVITY":
        return "bg-green-100 text-white";
      case "HALF_DAY":
        return "bg-green-200 text-white";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTripTypeLabel = (type) => {
    switch (type) {
      case "ACTIVITY":
        return "نشاط";
      case "HALF_DAY":
        return "نصف يوم";
      case "FULL_DAY":
        return "يوم كامل";
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()} ريال`;
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      {/* Desktop Table */}
      <Card className="hidden shadow-lg md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className=" bg-table-header">
                  <th className="px-6 py-4 font-semibold text-right">
                    اسم الرحلة
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">النوع</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    التاريخ
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">السعر</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    المقاعد المتاحة
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">
                    المدينة
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">الفئة</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    المنظمة
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((trip, index) => (
                  <tr
                    key={trip._id}
                    className={`border-b border-table-border transition-colors hover:bg-accent/50 ${
                      index % 2 === 0 ? "bg-table-row-even" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {trip.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getTripTypeColor(trip.tripsType)}>
                        {getTripTypeLabel(trip.tripsType)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(trip.day)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      {formatPrice(trip.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {trip.availableSeats}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {trip.cities}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs">
                        {trip.categories}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {trip.organization}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {data.nodes.map((trip) => (
          <Card
            key={trip._id}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold leading-relaxed text-foreground">
                  {trip.name}
                </h3>
                <Badge className={getTripTypeColor(trip.tripsType)}>
                  {getTripTypeLabel(trip.tripsType)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatDate(trip.day)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">
                    {formatPrice(trip.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{trip.availableSeats} مقعد متاح</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{trip.cities}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {trip.categories}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {trip.organization}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default memo(ActivitiesTable);
