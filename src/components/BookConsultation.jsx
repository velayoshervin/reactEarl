import React, { useState, useEffect } from "react";
import { TextInput, Button, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";

const BookConsultation = ({ closeModal, userId, eventDate, setEventDate }) => {
  const [fullname, setFullname] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  // const [eventDate, setEventDate] = useState(null);
  const [occasion, setOccasion] = useState(null);

  const [excludedDates, setExcludedDates] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const isDateExcluded = (date) => {
    if (!excludedDates || !Array.isArray(excludedDates)) return false;

    return excludedDates.some((excludedDate) => {
      if (!excludedDate) return false;
      return dayjs(date).isSame(dayjs(excludedDate), "day");
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8080/public/api/calendar/today"
        );
        const blockedDateObjects = res?.data;
        const toExclude = blockedDateObjects.map((d) =>
          dayjs(d?.date).format("YYYY-MM-DD")
        );
        setExcludedDates(toExclude);
        console.log("to exclude:", toExclude);
      } catch (err) {
        console.error("Failed to fetch blocked dates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isBooked = (date) => isDateExcluded(date);

  const handleSubmit = async (payload) => {
    //   alert(JSON.stringify(payload));

    try {
      const res = await axios.post(
        "http://localhost:8080/protected/consultation",
        payload,
        { withCredentials: true }
      );
      console.log("Response:", res.data);
      showNotification({
        title: "Thank you!",
        message: "Your consultation request has been submitted.",
        color: "green",
        autoClose: 3000, // 3 seconds
      });
      closeModal();
      setEventDate(null);
      close();
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      userId,
      fullName: fullname,
      contact,
      email,
      address,
      eventDate,
      eventType: occasion,
    };
    handleSubmit(payload);
  };

  const handleChange = (e) => {
    // Keep only numbers, max 9 digits
    const digitsOnly = e.currentTarget.value.replace(/\D/g, "").slice(0, 9);
    setContact(digitsOnly);
  };

  return (
    <div className="bg-gray-50 flex justify-center">
      <div className="bg-white  w-full max-w-2xl p-8">
        {/* Modal header */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Book a Consultation
        </h2>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerInput
              leftSection={<IconCalendar size={18} stroke={1.5} />}
              clearable
              readOnly
              minDate={new Date()}
              leftSectionPointerEvents="none"
              label="Select event date"
              placeholder="Pick a date"
              value={eventDate}
              onChange={(date) => {
                if (isDateExcluded(date)) {
                  showNotification({
                    title: "Date unavailable",
                    message:
                      "The selected date is already booked or unavailable. Please choose another date.",
                    color: "red",
                    icon: <IconX size={16} />,
                  });
                } else {
                  setEventDate(date);
                }
              }}
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

            <TextInput
              label="Full name"
              placeholder="Enter your Name"
              value={fullname}
              onChange={(event) => setFullname(event.currentTarget.value)}
              required
            />

            <Select
              label="Event"
              placeholder="Pick value"
              data={["Birthday", "Wedding", "Debut", "Gatherings", "Others"]}
              value={occasion}
              onChange={setOccasion}
            />

            <TextInput
              className="text-[14px]"
              label="Contact number"
              placeholder="Enter your contact number"
              value={contact}
              onChange={handleChange}
              required
              leftSection={
                <span className="px-3 text-gray-500 select-none">+639</span>
              }
              styles={{
                leftSection: { pointerEvents: "none" },
              }}
              inputProps={{
                inputMode: "numeric",
              }}
            />

            <TextInput
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
            />

            <TextInput
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChange={(event) => setAddress(event.currentTarget.value)}
              required
            />
          </div>

          {/* Submit button */}
          <Text size={"sm"} c="dimmed" className="">
            Please fill out all fields
          </Text>
          <Button
            type="submit"
            fullWidth
            className="bg-red-600 hover:bg-red-700 text-white font-semibold mt-2"
          >
            Book now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookConsultation;
