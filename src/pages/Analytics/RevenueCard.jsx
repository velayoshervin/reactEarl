import * as React from "react";
import { Box, Typography, Chip, Stack, Paper } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const RevenueCard = (bgColor) => {
  const revenue = 528976.82;
  const prevRevenue = 501641.73;
  const changePercent = ((revenue - prevRevenue) / prevRevenue) * 100;
  const changeAmount = revenue - prevRevenue;
  const isPositive = changeAmount >= 0;

  return (
    <Box
      gridColumn="span 4"
      backgroundColor={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
        <Typography variant="subtitle2" color="text.secondary">
          Revenue
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
          mb={1}
        >
          <Typography variant="h2" fontWeight="bold">
            ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              icon={isPositive ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              label={`${Math.abs(changePercent).toFixed(1)}%`}
              color={isPositive ? "error" : "success"}
              size="medium"
            />
            <Chip
              label={`$${Math.abs(changeAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
              variant="outlined"
              size="medium"
            />
          </Stack>
        </Stack>

        <Typography variant="body1" color="text.secondary">
          vs prev. $
          {prevRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
          Jun 1 - Aug 31, 2023
        </Typography>
      </Paper>
    </Box>
  );
};

export default RevenueCard;
