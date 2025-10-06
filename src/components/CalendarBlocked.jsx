import React, { useEffect, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { Tooltip } from "@mantine/core";
import axios from "axios";
import dayjs from "dayjs";

const BlockedDatePicker = ({ eventDate, setEventDate, disabled }) => {
  useEffect(() => {}, [eventDate]);

  const [excludedDates, setExcludedDates] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let res;
        res = await axios.get(
          "http://localhost:8080/public/api/calendar/today"
        );

        const blockedDateObjects = res?.data;
        const toExclude = blockedDateObjects.map((dates) => dates?.date);
        setExcludedDates(toExclude);
        console.log("to exclude:", toExclude);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const isDateExcluded = (date) => {
    if (!excludedDates || !Array.isArray(excludedDates)) return false;

    return excludedDates.some((excludedDate) => {
      if (!excludedDate) return false;
      return dayjs(date).isSame(dayjs(excludedDate), "day");
    });
  };
  const isBooked = (date) => {
    return isDateExcluded(date); // Same logic as excludeDate
  };

  return (
    <DatePickerInput
      disabled={disabled}
      //   label="Select event date"
      placeholder="Pick a date"
      value={eventDate}
      onChange={(date) => {
        console.log(typeof date);
        console.log(date);

        console.log();
        if (isDateExcluded(date)) {
          showNotification({
            title: "Date unavailable",
            message:
              "The selected date is already booked or unavailable. Please choose another date.",
            color: "red",
            icon: <IconX size={16} />,
          });
        } else {
          let selectedDate = date;

          if (typeof date === "string") {
            selectedDate = new Date(date); // Convert string to Date
          }
          setEventDate(selectedDate);
          console.log("Converted Date:", selectedDate);
        }
      }}
      clearable
      minDate={new Date()} // prevent past dates
      //   excludeDate={(date) => isBooked(date)}
      leftSection={<IconCalendar size={18} stroke={1.5} />}
      leftSectionPointerEvents="none"
      numberOfColumns={1}
      dropdownType="popover"
      renderDay={(date) => {
        const booked = isBooked(date);
        const day = new Date(date).getDate();
        return (
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full
        ${booked ? "bg-red-500 text-white" : "hover:bg-gray-200"}
      `}
          >
            {day}
          </div>
        );
      }}
    />
  );
};

// Example usage
const CalendarBlocked = ({ eventDate, setEventDate, disabled }) => {
  return (
    <div className="p-4 max-w-md mx-auto">
      <BlockedDatePicker
        eventDate={eventDate}
        setEventDate={setEventDate}
        disabled={disabled}
      />
    </div>
  );
};

export default CalendarBlocked;
