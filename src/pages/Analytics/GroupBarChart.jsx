import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";

const GroupedBarChart = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveBar
      data={data}
      keys={["quotation", "booking", "reservation"]}
      indexBy="month"
      groupMode="grouped"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "set2" }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      theme={{
        textColor: theme.palette.text.primary, // ✅ matches MUI text
        fontSize: 12,
        axis: {
          domain: {
            line: { stroke: theme.palette.divider }, // ✅ axis lines
          },
          ticks: {
            line: { stroke: theme.palette.divider, strokeWidth: 1 },
            text: { fill: theme.palette.text.primary }, // ✅ tick labels
          },
          legend: {
            text: { fill: theme.palette.text.primary }, // ✅ axis legends
          },
        },
        grid: {
          line: { stroke: theme.palette.divider, strokeWidth: 0.5 }, // ✅ grid lines
        },
        legends: {
          text: { fill: theme.palette.text.primary }, // ✅ legend text
        },
        tooltip: {
          container: {
            background: theme.palette.background.paper, // ✅ tooltip bg
            color: theme.palette.text.primary,
            fontSize: 12,
          },
        },
      }}
      //   axisBottom={{
      //     tickSize: 5,
      //     tickPadding: 5,
      //     tickRotation: 0,
      //     legend: 'Months (Jan–Jun)',
      //     legendPosition: 'middle',
      //     legendOffset: 32,
      //   }}
      //   axisLeft={{
      //     tickSize: 5,
      //     tickPadding: 5,
      //     tickRotation: 0,
      //     legend: 'Count of Interactions',
      //     legendPosition: 'middle',
      //     legendOffset: -40,
      //   }}
      labelSkipWidth={13}
      labelSkipHeight={12}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemsSpacing: 3,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          symbolSize: 20,
        },
      ]}
      role="application"
      ariaLabel="Grouped bar chart of quotations, bookings, reservations"
    />
  );
};

export default GroupedBarChart;
