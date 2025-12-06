import { Card, Typography, Button, Chip, Stack } from "@mui/material";
import Image from "next/image";

const OrganizationCard = ({
  id,
  name,
  city,
  totalRevenue,
  childsCount,
  scheduledTrips,
  doneTrips,
  suspendedTrips,
  rating = "ممتاز",
  onViewDetails,
}) => {
  return (
    <Card
      className="p-8"
      sx={{
        borderRadius: "16px",
        border: "1px solid #6ec1e3",
        boxShadow: "none",
      }}
    >
      <Stack spacing="32px">
        {/* Header Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing="12px" alignItems="flex-start">
            <Image
              src="/assets/icons/bank.svg"
              alt="bank"
              width={27}
              height={25}
              className="mt-1"
            />
            
            <Stack spacing="8px" alignItems="flex-end">
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 500,
                  lineHeight: "24px",
                  color: "#1e1e1c",
                }}
              >
                {name}
              </Typography>
              
              <Stack direction="row" spacing="4px" alignItems="center">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={12}
                  height={14}
                />
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: "#6c7071",
                  }}
                >
                  {city}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          
          <Chip
            label={rating}
            sx={{
              backgroundColor: "transparent",
              color: "#033440",
              opacity: 0.7,
              fontSize: "14px",
              fontWeight: 500,
              height: "auto",
              padding: "0",
              "& .MuiChip-label": {
                padding: "0",
              },
            }}
          />
        </Stack>

        {/* Revenue and Students Section */}
        <Stack spacing="12px">
          {/* Total Revenue */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="px-4 py-3"
            sx={{
              borderRadius: "8px",
              backgroundColor: "rgba(75, 252, 78, 0.20)",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "20px",
                color: "#1e1e1c",
              }}
            >
              إجمالي الإيرادات
            </Typography>
            
            <Stack direction="row" spacing="2px" alignItems="center">
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  lineHeight: "20px",
                  color: "#1e1e1c",
                }}
              >
                {totalRevenue.toLocaleString()}
              </Typography>
              <Image
                src="/assets/icons/sar.svg"
                alt="SAR"
                width={16}
                height={18}
              />
            </Stack>
          </Stack>

          {/* Active Students */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="px-3 py-3"
            sx={{
              borderRadius: "8px",
              backgroundColor: "rgba(79, 220, 255, 0.20)",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "20px",
                color: "#00707f",
              }}
            >
              الطلاب النشطين
            </Typography>
            
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "1px",
                lineHeight: "20px",
                color: "#0b7f8f",
              }}
            >
              {childsCount}
            </Typography>
          </Stack>
        </Stack>

        {/* Trip Statistics */}
        <Stack direction="row" spacing="16px">
          {/* Scheduled Trips */}
          <Stack
            spacing="4px"
            alignItems="center"
            justifyContent="center"
            className="flex-1 py-4"
            sx={{
              borderRadius: "8px",
              backgroundColor: "rgba(235, 1, 1, 0.08)",
              boxShadow: "0px 0px 4px rgba(235, 1, 1, 0.16)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "1px",
                lineHeight: "24px",
                color: "#eb0101",
              }}
            >
              {scheduledTrips}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "20px",
                color: "#eb0101",
                opacity: 0.7,
              }}
            >
              مجدولة
            </Typography>
          </Stack>

          {/* Completed Trips */}
          <Stack
            spacing="4px"
            alignItems="center"
            justifyContent="center"
            className="flex-1 py-4"
            sx={{
              borderRadius: "8px",
              backgroundColor: "rgba(118, 161, 51, 0.16)",
              boxShadow: "0px 0px 4px rgba(118, 161, 51, 0.16)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "1px",
                lineHeight: "24px",
                color: "#76a133",
              }}
            >
              {doneTrips}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "20px",
                color: "#76a133",
                opacity: 0.7,
              }}
            >
              مكتملة
            </Typography>
          </Stack>

          {/* Suspended Trips */}
          <Stack
            spacing="4px"
            alignItems="center"
            justifyContent="center"
            className="flex-1 py-4"
            sx={{
              borderRadius: "8px",
              backgroundColor: "rgba(41, 145, 170, 0.08)",
              boxShadow: "0px 0px 4px rgba(41, 145, 170, 0.16)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "1px",
                lineHeight: "24px",
                color: "#2991aa",
              }}
            >
              {suspendedTrips}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "20px",
                color: "#2991aa",
                opacity: 0.7,
              }}
            >
              المعلقه
            </Typography>
          </Stack>
        </Stack>

        {/* View Details Button */}
        <Button
          variant="contained"
          onClick={() => onViewDetails?.(id)}
          sx={{
            backgroundColor: "#007473",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "20px",
            textTransform: "none",
            borderRadius: "8px",
            padding: "14px",
            "&:hover": {
              backgroundColor: "#005f5e",
            },
          }}
        >
          عرض التفاصيل
        </Button>
      </Stack>
    </Card>
  );
};

export default OrganizationCard;