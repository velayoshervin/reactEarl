import React, { useState, useEffect } from "react";
import { Calendar } from "@mantine/dates";
import { Button, Tooltip } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { showNotification } from "@mantine/notifications";

const AvailableCalendar = ({ onDateSelect, initialDate }) => {
  const [excludedDates, setExcludedDates] = useState([]);
  const [pickedDate, setPickedDate] = useState(null);

  const isDateExcluded = (date) => {
    if (!excludedDates || !Array.isArray(excludedDates)) return false;
    return excludedDates.some((excludedDate) =>
      dayjs(date).isSame(dayjs(excludedDate), "day")
    );
  };

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/public/api/calendar/today"
        );
        const blocked = res?.data.map((d) =>
          dayjs(d?.date).format("YYYY-MM-DD")
        );
        setExcludedDates(blocked);
      } catch (err) {
        console.error("Failed to fetch blocked dates:", err);
      }
    };
    fetchBlockedDates();
  }, []);

  useEffect(() => {
    if (initialDate) {
      setPickedDate(initialDate);
    }
  }, [initialDate]);

  const handleSelect = (date) => {
    if (!date) return;
    if (isDateExcluded(date)) {
      showNotification({
        title: "Date unavailable",
        message:
          "This date is already booked or unavailable. Please choose another.",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }
    setPickedDate(date);
    if (onDateSelect) onDateSelect(date);
  };

  return (
    <div className="bg-white w-full max-w-2xl mx-auto">
      <Calendar
        value={pickedDate}
        onChange={handleSelect}
        minDate={dayjs().add(4, "day").toDate()}
        renderDay={(date) => {
          const booked = isDateExcluded(date);
          const selected =
            pickedDate && dayjs(pickedDate).isSame(dayjs(date), "day");
          const day = new Date(date).getDate();
          return (
            <Tooltip
              label={booked ? "Booked or unavailable" : "Available"}
              color={booked ? "gray" : "green"}
              position="top"
              withArrow
            >
              <div
                onClick={() => {
                  if (!booked) {
                    setPickedDate(date);
                    onDateSelect(date);
                  }
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer
                  ${
                    booked
                      ? "bg-gray-400 text-white"
                      : selected
                      ? "bg-green-400 text-white"
                      : "hover:bg-gray-200"
                  }`}
              >
                {day}
              </div>
            </Tooltip>
          );
        }}
        styles={{
          calendarHeader: { fontSize: "1.5rem", fontWeight: 700 },
          calendarHeaderControl: {
            width: 40,
            height: 40,
            backgroundColor: "#f3f3f3",
            "&:hover": { backgroundColor: "#e5e5e5" },
          },
          day: { width: 40, height: 40, margin: "2px", borderRadius: "12px" },
        }}
      />
      {/* Selected date
      {pickedDate && (
        <p className="mt-6 text-center text-sm font-medium">
          Selected: {dayjs(pickedDate).format("MMMM D, YYYY")}
        </p>
      )}
      {/* Confirm button */}
      {/* <Button
        mt="md"
        size="lg"
        color="red"
        disabled={!pickedDate && !user}
        onClick={() => pickedDate && onDateSelect(pickedDate)}
      >
        Confirm Date
      </Button>{" "} */}
    </div>
  );
};

export default AvailableCalendar;
