import { Badge, Card, CardContent } from "@mui/material";
import { memo } from "react";

const PackagesTable = ({ data }) => {
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

  const formatDuration = (duration) => {
    return duration === 1 ? "يوم واحد" : `${duration} أيام`;
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      {/* Desktop Table */}
      <Card className="hidden shadow-lg md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header">
                  <th className="px-6 py-4 font-semibold text-right">
                    اسم الباقة
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">النوع</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    التاريخ
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">السعر</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    المقاعد المتاحة
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">المدة</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    عدد الأنشطة
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">
                    المنظمة
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((pkg, index) => (
                  <tr
                    key={pkg._id}
                    className={`border-b border-table-border transition-colors hover:bg-accent/50 ${
                      index % 2 === 0 ? "bg-table-row-even" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {pkg.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-muted text-muted-foreground">
                        باقة سياحية
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(pkg.day)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatPrice(pkg.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {pkg.availableSeats}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDuration(pkg.duration)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {pkg.activitiesCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {pkg.organization}
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
        {data.nodes.map((pkg) => (
          <Card
            key={pkg._id}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold leading-relaxed text-foreground">
                  {pkg.name}
                </h3>
                <Badge className="bg-muted text-muted-foreground">
                  باقة سياحية
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatDate(pkg.day)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{pkg.availableSeats} مقعد متاح</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatDuration(pkg.duration)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {pkg.activitiesCount} نشاط
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {pkg.organization}
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

export default memo(PackagesTable);
