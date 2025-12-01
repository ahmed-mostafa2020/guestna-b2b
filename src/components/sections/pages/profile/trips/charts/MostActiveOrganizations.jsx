import { useTranslations } from "next-intl";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import EmptyBookings from "../../myBookings/EmptyBookings";

const MostActiveOrganizations = ({ mostActiveOrganizationsData }) => {
  const t = useTranslations();
  // Custom label to display percentage on top of bars
  const renderCustomLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#333"
        textAnchor="middle"
        fontSize="16"
        fontWeight="600"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="p-4 bg-white border h-fit rounded-xl border-border hover:shadow-card">
      <h2 className="pb-4 text-lg font-medium lg:text-xl text-titleColor">
        {t("profile.donutChart.title")}
      </h2>

      {mostActiveOrganizationsData.length ? (
        <ResponsiveContainer className="!h-[320px]" height={420}>
          <BarChart
            data={mostActiveOrganizationsData}
            margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              angle={15}
              textAnchor="end"
              height={100}
              tick={{ fill: "#666", fontSize: 13 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#666", fontSize: 12 }}
              label={{
                value: "Bookings",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#666" },
              }}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {mostActiveOrganizationsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#8B9FDE" />
              ))}
              <LabelList dataKey="percentage" content={renderCustomLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px]">
          <EmptyBookings subTitle={false} hasLink={false} />
        </div>
      )}
    </div>
  );
};

export default MostActiveOrganizations;
