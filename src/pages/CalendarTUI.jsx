import React, { useEffect, useRef, useState } from "react";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css"; // Stylesheet for calendar
import "./CalendarTUI.css";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconCalendarEvent,
  IconCalendarCog,
  IconClock,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import {
  SegmentedControl,
  Menu,
  Button,
  Modal,
  TextInput,
  Tooltip,
  Select,
  Checkbox,
  Avatar,
  Textarea,
  Autocomplete,
  MultiSelect,
  Loader,
  Group,
  Text,
  Divider,
} from "@mantine/core";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
import { useDisclosure } from "@mantine/hooks";
import { getContacts } from "../ItemsAxios";
// eslint-disable-next-line no-unused-vars
import { formatISO, subDays, subHours, subMinutes, set } from "date-fns";
import MultiSelectWithCheckbox from "../MantineComponents/mantine/MultiSelectWithCheckbox";
import axios from "axios";
import { notifications } from "@mantine/notifications";

function successNotif(message) {
  notifications.show({
    title: "Success",
    message: message,
    color: "green",
  });
}

function errorNotif(message) {
  notifications.show({
    title: "Error",
    message: message,
    color: "red",
  });
}

import { differenceInMinutes } from "date-fns";

function getReminderOptions(eventDateTime) {
  const options = [
    { label: "A week before", offset: { days: 7 } },
    { label: "3 days before", offset: { days: 3 } },
    { label: "A day before", offset: { days: 1 } },
    {
      label: "Morning of the event",
      custom: () => set(eventDateTime, { hours: 7, minutes: 0, seconds: 0 }),
    },
    { label: "1 hour before", offset: { hours: 1 } },
    { label: "30 minutes before", offset: { minutes: 30 } },
    { label: "15 minutes before", offset: { minutes: 15 } },
  ];

  return options.map((opt) => {
    let reminderTime;

    if (opt.offset) {
      if (opt.offset.days) {
        reminderTime = subDays(eventDateTime, opt.offset.days);
      } else if (opt.offset.hours) {
        reminderTime = subHours(eventDateTime, opt.offset.hours);
      } else if (opt.offset.minutes) {
        reminderTime = subMinutes(eventDateTime, opt.offset.minutes);
      }
    } else if (opt.custom) {
      reminderTime = opt.custom();
    }

    const diffMinutes = differenceInMinutes(eventDateTime, reminderTime);

    // Convert diffMinutes → ISO 8601 duration
    let value;
    if (diffMinutes % 1440 === 0) {
      value = `P${diffMinutes / 1440}D`; // whole days
    } else if (diffMinutes % 60 === 0) {
      value = `PT${diffMinutes / 60}H`; // whole hours
    } else {
      value = `PT${diffMinutes}M`; // minutes
    }

    return { value, label: opt.label };
  });
}

const CalendarTUI = ({ userId }) => {
  const calendarRef = useRef(null);
  const calendarInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const fetchCalendarData = async (userId) => {
    try {
      const response = await axios.get("http://localhost:8080/calendar/data", {
        params: { userId },
        withCredentials: true,
      });
      const data = response.data;
      console.log(data);

      console.log("📅 RAW API DATA:", data);
      console.log("📊 Calendars count:", data.calendars?.length);
      console.log("📊 Events count:", data.events?.length);

      const formattedCalendars = data.calendars.map((calendar) => ({
        id: calendar.calendarId.toString(),
        name: calendar.name,
        color: calendar.color,
        bgColor: calendar.color,
        dragBgColor: calendar.color,
        borderColor: darkenColor(calendar.color, 30), // Darker border for contrast
      }));

      const formattedEvents = data.events.map((event) => {
        const calendar = formattedCalendars.find(
          (cal) => cal.id === event.calendarId?.toString()
        );

        const start = new Date(event.startTime);
        const end = event.allDay ? new Date(start) : new Date(event.endTime);

        if (event.allDay) {
          end.setDate(start.getDate()); // Same day
          end.setHours(23, 59, 59, 999); // End of day
        }

        return {
          id: event.eventId.toString(),
          calendarId: event.calendarId?.toString() || "1",
          title: event.title,
          category: event.allDay ? "allday" : "time",
          start: start,
          end: end,
          isAllday: event.allDay,
          location: event.location,
          attendees: (event.attendees || []).map((a) => ({
            firstname: a.firstName || a.firstname,
            lastname: a.lastName || a.lastname,
            avatarUrl: a.avatarUrl || a.image || "/default-avatar.png",
          })),
          backgroundColor: calendar?.bgColor || "#3b82f6",
          borderColor: calendar?.borderColor || "#1d4ed8",
          raw: {
            creator: event.creator || {},
            eventCategory: event.eventCategory,
          },
        };
      });

      // ✅ ACTUALLY SET THE CALENDAR DATA HERE
      setCalendarData({
        calendars: formattedCalendars,
        events: formattedEvents,
      });

      console.log("Calendar data set:", data);
      console.log(calendarData);

      if (calendarInstance.current) {
        calendarInstance.current.clear();
        calendarInstance.current.setCalendars(formattedCalendars);
        calendarInstance.current.createEvents(formattedEvents);
        calendarInstance.current.render();
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getContacts();
        console.log("contacts:", response);
        console.log("contacts:", response.data);
        const users = Array.isArray(response?.data)
          ? response.data
          : Object.values(response?.data || {});

        const formattedData = users.map((user) => ({
          value: user.id.toString(),
          label: `${user.firstName} ${user.lastName}`, // Full name
          image: user.avatarUrl,
          email: user.email,
        }));

        setContacts(formattedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setContacts([]);
        setLoading(false);
        // err.data may be undefined
      }
    };

    fetchContacts();
  }, []);

  const renderMultiSelectOption = React.useCallback(
    ({ option }) => (
      <Group gap="sm">
        <Avatar src={option.image} size={36} radius="xl" />
        <div>
          <Text size="sm">{option.label}</Text>
          <Text size="xs" opacity={0.5}>
            {option.email}
          </Text>
        </div>
      </Group>
    ),
    []
  );

  function getContrastColor(hexColor) {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }

  useEffect(() => {
    if (calendarRef.current && !calendarInstance.current) {
      calendarInstance.current = new Calendar(calendarRef.current, {
        defaultView: "week",
        usageStatistics: false,
        date: new Date(),
        useCreationPopup: false,
        useFormPopup: true,
        timezone: {
          zones: [
            {
              timezoneName: "Asia/Manila",
              displayLabel: "GMT+08:00",
              tooltip: "Philippines Time",
            },
          ],
        },
        validRange: {
          start: new Date(), // Prevent selection of past dates
        },
        week: {
          dayNames: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          hourStart: 7,
          hourEnd: 24,
          taskView: false,
          alldayEventHeight: 50, // increase this (default is 25px)
        },
        template: {
          weekDayName(model) {
            // Convert TZDate to real local Date string
            const modelDate = new Date(model.dateInstance.d);
            const today = new Date();

            const modelDateStr = modelDate.toLocaleDateString("en-CA", {
              timeZone: "Asia/Manila",
            });
            const todayStr = today.toLocaleDateString("en-CA", {
              timeZone: "Asia/Manila",
            });

            const isToday = modelDateStr === todayStr;
            const bgColor = isToday ? "#262626" : "#f3f4f6";
            const textColor = isToday ? "#fff" : "#333";

            return `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: ${bgColor};
          padding: 10px;
          border-radius: 6px;
          gap: 2px;
          color: ${textColor};
        ">
          <span style="font-weight: bold; font-size: 14px;">${model.dayName}</span>
          <span style="font-size: 24px; font-weight: bold">${model.date}</span>
        </div>
      `;
          },

          allday(event) {
            if (!event) return "<div>All Day Event</div>";

            const bgColor = event.backgroundColor || "#3b82f6";
            const borderColor = event.borderColor || "#1d4ed8";
            const textColor = getContrastColor(bgColor);

            const attendees = event.attendees || [];

            // Overlapping avatars
            const attendeeAvatars = attendees
              .slice(0, 4)
              .map(
                (a, index) => `
    <span title="${a.firstname} ${a.lastname}" style="
      display:inline-block;
      width:30px;
      height:30px;
      border-radius:50%;
      overflow:hidden;
      margin-left:${index === 0 ? "0" : "-8"}px; /* Overlap except first one */
      border:2px solid ${bgColor}; /* Match event background for seamless overlap */
      position:relative;
      z-index:${10 - index}; /* First avatar on top */
    ">
      <img src="${a.avatarUrl || "/default-avatar.png"}" 
           style="width:100%; height:100%; object-fit:cover;" 
           onerror="this.src='/default-avatar.png'" />
    </span>
  `
              )
              .join("");

            const remaining =
              attendees.length > 4
                ? `<span style="
        display:inline-block;
        width:20px;
        height:20px;
        border-radius:50%;
        background:#00000033;
        color:#fff;
        font-size:9px;
        text-align:center;
        line-height:20px;
        margin-left:-8px;
        border:2px solid ${bgColor};
        position:relative;
        z-index:1;
      ">+${attendees.length - 4}</span>`
                : "";

            return `
    <div style="
      height:100%;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:0 6px;
      border-left:4px solid ${borderColor};
      background:${bgColor};
      color:${textColor};
      font-size:12px;
      gap:4px;
      overflow:hidden;
      box-sizing:border-box;
    ">
      <span style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink:1;">
        ${event.title || "All Day Event"}
      </span>
      <span style="display:flex; align-items:center; flex-shrink:0; margin-left:8px;">
        ${attendeeAvatars}${remaining}
      </span>
    </div>
  `;
          },
          time(event) {
            if (!event) return "<div>Event</div>";

            const bgColor = event.backgroundColor || "#3b82f6";
            const borderColor = event.borderColor || "#1d4ed8";
            const textColor = getContrastColor(bgColor);

            const title = event.title || "Event";
            const location = event.location || "";
            const attendees = event.attendees || [];

            // Overlapping avatars for time events
            const attendeeAvatars = attendees
              .slice(0, 4)
              .map(
                (a, index) => `
    <span title="${a.firstname} ${a.lastname}" style="
      display:inline-block;
      width:18px;
      height:18px;
      border-radius:50%;
      overflow:hidden;
      margin-left:${index === 0 ? "0" : "-6"}px; /* Overlap except first one */
      border:2px solid ${bgColor}; /* Match event background */
      position:relative;
      z-index:${10 - index}; /* First avatar on top */
    ">
      <img src="${a.avatarUrl || "/default-avatar.png"}" 
           style="width:100%; height:100%; object-fit:cover;" 
           onerror="this.src='/default-avatar.png'" />
    </span>
  `
              )
              .join("");

            const remaining =
              attendees.length > 4
                ? `<span style="
        display:inline-block;
        width:18px;
        height:18px;
        border-radius:50%;
        background:#00000033;
        color:#fff;
        font-size:8px;
        text-align:center;
        line-height:18px;
        margin-left:-6px;
        border:2px solid ${bgColor};
        position:relative;
        z-index:1;
      ">+${attendees.length - 4}</span>`
                : "";

            return `
    <div style="
      background: ${bgColor};
      color: ${textColor} !important;
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 12px;
      border-left: 4px solid ${borderColor};
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    ">
      <!-- Event Title -->
      <div style="font-weight: 600; margin-bottom: 2px; line-height: 1.2;">${title}</div>
      
      <!-- Location -->
      ${
        location
          ? `<div style="font-size: 11px; opacity: 0.8; display: flex; align-items: center; gap: 2px; margin-bottom: 4px;">
              <span>📍</span> ${location}
            </div>`
          : ""
      }
      
      <!-- Attendees -->
      ${
        attendees.length > 0
          ? `
            <div style="display: flex; align-items: center; margin-top: 4px;">
              <div style="display: flex; align-items: center; margin-left: 6px;">
                ${attendeeAvatars}${remaining}
              </div>
            </div>
          `
          : ""
      }
    </div>
  `;
          },
        },
      });

      //     template: {
      //       weekDayName(model) {
      //         // Convert TZDate to real local Date string
      //         const modelDate = new Date(model.dateInstance.d); // Safe unwrap
      //         const today = new Date();

      //         // Use toLocaleDateString with time zone for reliable match
      //         const modelDateStr = modelDate.toLocaleDateString("en-CA", {
      //           timeZone: "Asia/Manila",
      //         });
      //         const todayStr = today.toLocaleDateString("en-CA", {
      //           timeZone: "Asia/Manila",
      //         });

      //         const isToday = modelDateStr === todayStr;

      //         const bgColor = isToday ? "#262626" : "#f3f4f6";
      //         const textColor = isToday ? "#fff" : "#333";

      //         return `
      //   <div style="
      //     display: flex;
      //     flex-direction: column;
      //     align-items: center;
      //     background-color: ${bgColor};
      //     padding: 10px;
      //     border-radius: 6px;
      //     gap: 2px;
      //     color: ${textColor};
      //   ">
      //     <span style="font-weight: bold; font-size: 14px;">${model.dayName}</span>
      //     <span style="font-size: 24px; font-weight: bold">${model.date}</span>
      //   </div>
      // `;
      //       },
      //       time(event) {
      //         const avatarUrl = event.raw?.creator?.avatarUrl || "";
      //         const name = event.raw?.creator?.name || "Unknown";
      //         const title = event.title || "";

      //         return `
      //       <div style="display: flex; flex-direction: column align-items: center; gap: 6px;">
      //         <img
      //           src="${avatarUrl}"
      //           alt="${name}"
      //           style="width: 24px; height: 24px; border-radius: 9999px; object-fit: cover;"
      //         />
      //         <span style="font-size: 13px;">${title}</span>
      //       </div>
      //     `;
      //       },
      //     }

      fetchCalendarData(userId);

      calendarInstance.current.render();
      console.log("Calendar instance created", calendarInstance.current);

      calendarInstance.current.on("selectDateTime", (event) => {
        const selected = event.start;
        setSelectedDate(selected);
        //
        //   "start": "2025-07-29T16:00:00.000Z",
        //   "end": "2025-07-29T16:00:00.000Z",
        //   "isAllday": true,
        //   "nativeEvent": {
        //     "isTrusted": true
        //   },
        //   "gridSelectionElements": []

        if (
          event.guide &&
          typeof event.guide.clearGuideElement === "function"
        ) {
          event.guide.clearGuideElement();
        }

        if (event.stop) {
          event.stop(); // stops event propagation
        }

        setMenuPosition({
          x: event.nativeEvent.clientX,
          y: event.nativeEvent.clientY,
        });
        setMenuOpened(true);
        return false;
      });
    }

    // Optional cleanup
    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
        calendarInstance.current = null;
      }
    };
  }, [userId]);

  const [calendarView, setCalendarView] = useState("<week></week>");
  const [calendarHeader, setCalendarHeader] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  );

  const mousePosRef = useRef();
  const [menuOpened, setMenuOpened] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState("1");
  const [title, setTitle] = useState();
  const [allDay, setAllDay] = useState(false);
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState();
  const [selectedReminder, setSelectedReminder] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [invitedUserIds, setInvitedUserIds] = useState([]);
  const [calendarData, setCalendarData] = useState({
    calendars: [],
    events: [],
  });

  //   private Long calendarId;
  // private Long bookingId;
  // private String title;
  // private boolean allDay;
  // private LocalDateTime startTime;
  // private LocalDateTime endTime;
  // private String location;
  // private EventCategory eventCategory;
  // private Long creatorId;
  // private List<Long> attendeeIds;
  // private String reminderDurations;

  const handleFormAddEventSubmit = (userId) => {
    const reminder = selectedReminder.join(",");

    const start = startTime || new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = endTime || new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const formData = {
      calendarId: Number(selectedCalendarId),
      allDay: allDay,
      startTime: start,
      endTime: end,
      title: title,
      location: location,
      eventCategory: "EVENT",
      creatorId: userId,
      attendeeIds: invitedUserIds,
      reminderDurations: reminder,
    };

    console.log("Event to submit", formData);

    const createEvent = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/calendarEvents",
          formData,
          {
            withCredentials: true,
          }
        );

        console.log("cal-event", res.data);
        successNotif("event saved");
      } catch (err) {
        console.log(err?.response);
        errorNotif("something went wrong");
      }
    };

    createEvent();
  };

  const InvitedAvatars = React.useMemo(() => {
    return invitedUsers.map((user) => (
      <Tooltip
        key={user?.value}
        label=<>
          <Group gap="sm" className="">
            <Avatar src={user?.avatarUrl} size={36} radius="xl" />
            <div>
              <Text size="sm">{user.label}</Text>
              <Divider size="xs" color="gray" />
              <Text size="xs" opacity={0.5}>
                {user?.email}
              </Text>
            </div>
          </Group>
        </>
      >
        <Avatar src={user?.avatarUrl} alt={user.label} radius="xl" size={48} />
      </Tooltip>
    ));
  }, [invitedUsers]);

  const handleMouseDown = (e) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const calendarViewHandler = React.useCallback((value) => {
    setCalendarView(value);
    calendarInstance.current.changeView(value, true);
    setTimeout(() => {
      updateCalendarHeader();
    }, 0);
  }, []);

  const handleTodayClick = () => {
    calendarInstance.current.today();
    updateCalendarHeader();
  };

  const handlePrev = () => {
    calendarInstance.current.prev();
    updateCalendarHeader();
  };

  const handleNext = () => {
    calendarInstance.current.next();
    updateCalendarHeader();
  };

  const updateCalendarHeader = () => {
    const calendar = calendarInstance.current;
    const view = calendar.getViewName();
    const date = calendar.getDate().toDate();

    if (view === "month") {
      setCalendarHeader(
        date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      );
    } else if (view === "week") {
      const start = calendar.getDateRangeStart().toDate();
      const end = calendar.getDateRangeEnd().toDate();

      setCalendarHeader(
        `${start.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${end.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      );
    } else if (view === "day") {
      setCalendarHeader(
        date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    const start = 7 * 60; // 7:00 AM in minutes
    const end = 22 * 60; // 10:00 PM in minutes
    options.push({ value: "", label: "" });
    for (let mins = start; mins <= end; mins += 30) {
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
      const time = new Date();
      time.setHours(hours);
      time.setMinutes(minutes);

      const label = time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      options.push({ value: label, label });
    }

    return options;
  };

  const timeOptions = React.useMemo(() => generateTimeOptions(), []);

  const handleAddEvent = () => {
    open();
  };

  const handleManageDate = () => {};

  function darkenColor(hex, amount = 20) {
    let c = hex.replace("#", "");

    if (c.length === 3) {
      c = c
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const num = parseInt(c, 16);
    let r = (num >> 16) - amount;
    let g = ((num >> 8) & 0x00ff) - amount;
    let b = (num & 0x0000ff) - amount;

    r = Math.max(0, r);
    g = Math.max(0, g);
    b = Math.max(0, b);

    return `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <div className="w-full flex justify-end px-5 h-full bg-blue-50 gap-2 relative tui-calendar-container rounded-xl">
      <div className="w-[400px] h-full border border-gray-400 sticky rounded-xl hidden"></div>
      <div
        className="
      w-full p-2 rounded-xl overflow-scroll border bg-white h-[100vh] "
      >
        <div className="header flex justify-between px-10 bg-white items-center my-8 ">
          <p className="text-[24px] text-gray-900">{calendarHeader}</p>
          <div className="flex gap-2">
            <SegmentedControl
              data={[
                { label: "Month", value: "month" },
                { label: "Week", value: "week" },
                { label: "Day", value: "day" },
              ]}
              value={calendarView}
              onChange={calendarViewHandler}
            />
          </div>

          <div className="flex items-center gap-2">
            <IconChevronLeft
              size={24}
              className="cursor-pointer border border-gray-200 rounded bg-[#f5f6f7] "
              onClick={handlePrev}
            />
            <button
              className="cursor-pointer border border-gray-200 rounded bg-[#f5f6f7] px-2 text-[10px]"
              onClick={handleTodayClick}
            >
              Today
            </button>
            <IconChevronRight
              size={24}
              className="cursor-pointer border border-gray-200 rounded bg-[#f5f6f7] "
              onClick={handleNext}
            />
          </div>
        </div>
        <div
          ref={calendarRef}
          className="h-full relative"
          onMouseDown={handleMouseDown}
        >
          {menuOpened && (
            <Menu
              opened={menuOpened}
              onClose={() => setMenuOpened(false)}
              position="bottom-start"
              withArrow
              withinPortal
              shadow="md"
              width={200}
              styles={{
                dropdown: {
                  position: "fixed",
                  top: menuPosition.y,
                  left: menuPosition.x,
                },
              }}
            >
              <Menu.Target>
                <div
                  style={{
                    position: "fixed",
                    top: menuPosition.y,
                    left: menuPosition.x,
                  }}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item onClick={handleAddEvent} className="flex">
                  <div className="flex items-center gap-2">
                    <IconCalendarEvent size={16} />
                    <span className="text-sm">Add event</span>
                  </div>
                </Menu.Item>
                <Menu.Item onClick={handleManageDate}>
                  <div className="flex items-center gap-2">
                    <IconCalendarCog size={16} />
                    <span className="text-sm">Manage date</span>
                  </div>
                </Menu.Item>
                <Menu.Item color="red" onClick={() => setMenuOpened(false)}>
                  Close
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

          <>
            <Modal
              opened={opened}
              onClose={close}
              title="Add event"
              className="rounded-xl"
              size={"lg"}
              scrollAreaComponent="div"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFormAddEventSubmit(userId);
                }}
              >
                <TextInput
                  label="Event name"
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                ></TextInput>
                <div className="flex justify-between items-center py-4">
                  <div className="flex gap-2">
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <IconCalendar size={18} />
                    </p>
                    <p>
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(selectedDate)}
                    </p>
                  </div>
                  <div
                    id="calendars"
                    className="flex gap-2.5 items-center my-4"
                  >
                    <span>
                      {calendarData.calendars.find(
                        (c) => c.id === selectedCalendarId
                      )?.name || "No calendar selected"}
                    </span>
                    {calendarData?.calendars?.map((cal) => {
                      const isSelected = cal.id === selectedCalendarId;
                      console.log(
                        "calendarData.calendars:",
                        calendarData.calendars
                      );
                      console.log(
                        "type:",
                        typeof calendarData.calendars,
                        Array.isArray(calendarData.calendars)
                      );
                      return (
                        <Tooltip
                          key={cal.id}
                          label={cal.name}
                          color={cal.color}
                          withArrow
                          position="bottom"
                          withinPortal // Critical for modals
                          zIndex={1000} // Ensure it appears above modal
                        >
                          <button
                            type="button"
                            className="rounded-full w-4 h-4 transition duration-300"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedCalendarId(cal.id);
                            }}
                            style={{
                              backgroundColor: cal.color || "red",
                              boxShadow: `0 0 0 2px ${
                                isSelected ? "white" : cal.color
                              },
                          0 0 0 4px ${
                            isSelected ? darkenColor(cal.color) : cal.color
                          }`,
                            }}
                            aria-label={cal.name}
                          />
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
                <div id="time" className="flex">
                  <div id="time" className="flex items-center gap-2">
                    <IconClock size={18} />
                    <Select
                      data={timeOptions}
                      placeholder="Start time"
                      searchable
                      nothingFoundMessage="No time found"
                      withScrollArea
                      disabled={allDay}
                      value={startTime}
                      onChange={setStartTime}
                      styles={{
                        input: {
                          border: "none", // remove border
                          outline: "none", // remove outline (focus ring)
                          boxShadow: "none", // remove any shadow on focus
                          paddingLeft: 16,
                          paddingRight: 40, // leave space for dropdown icon
                          borderRadius: 9999, // pill shape
                        },
                        root: {
                          width: 120,
                          border: "1px solid #d1d5db",
                          borderRadius: 9999,
                        },
                        rightSection: {
                          pointerEvents: "none", // keeps icon clickable disabled (optional)
                        },
                      }}
                      radius="xl"
                    />
                    <Select
                      data={timeOptions}
                      placeholder="End time"
                      searchable
                      nothingFoundMessage="No time found"
                      withScrollArea
                      disabled={allDay}
                      value={endTime}
                      onChange={setEndTime}
                      styles={{
                        input: {
                          border: "none", // remove border
                          outline: "none", // remove outline (focus ring)
                          boxShadow: "none", // remove any shadow on focus
                          paddingLeft: 16,
                          paddingRight: 40, // leave space for dropdown icon
                          borderRadius: 9999, // pill shape
                        },
                        root: {
                          width: 120,
                          border: "1px solid #d1d5db",
                          borderRadius: 9999,
                        },
                        rightSection: {
                          pointerEvents: "none", // keeps icon clickable disabled (optional)
                        },
                      }}
                      radius="xl"
                    />
                    <Checkbox
                      label="All day event?"
                      checked={allDay}
                      onChange={(event) => {
                        setAllDay(event.currentTarget.checked);
                        setStartTime();
                        setEndTime();
                      }}
                    />
                  </div>
                </div>
                <TextInput
                  className="py-2"
                  label="Location"
                  value={location}
                  onChange={(event) => setLocation(event.currentTarget.value)}
                />
                <div
                  id="attendees"
                  className="my-2 gap-2  flex flex-col justify-between"
                >
                  <div className="flex items-center ">
                    <div id="participants" className="flex gap-1">
                      {InvitedAvatars}
                    </div>
                  </div>

                  {loading ? (
                    <div
                      style={{
                        padding: "30px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Loader size="sm" />
                    </div>
                  ) : (
                    <MultiSelect
                      data={contacts}
                      renderOption={renderMultiSelectOption}
                      maxDropdownHeight={300}
                      label=""
                      value={invitedUsers.map((u) => u.value)}
                      // value={invitedUsers.map(String)}
                      onChange={(values) => {
                        // const selected = contacts.filter((c) =>
                        //   values.includes(c.value)
                        // );

                        const selectedObjects = contacts.filter((c) =>
                          values.includes(c.value)
                        );
                        setInvitedUsers(selectedObjects);

                        const selectedIds = values.map(Number);
                        setInvitedUserIds(selectedIds);
                      }}
                      placeholder="invite people"
                      hidePickedOptions
                      searchable
                      withScrollArea={false}
                      limit={5}
                    />
                  )}
                </div>
                <div className="py-2">
                  <p>Remind me</p>
                  {selectedDate && (
                    <MultiSelectWithCheckbox
                      data={getReminderOptions(selectedDate)}
                      value={selectedReminder}
                      setValue={setSelectedReminder}
                      hidePickedOptions
                    />
                  )}
                </div>

                <Textarea
                  label="description"
                  value={description}
                  placeholder="add short description"
                  onChange={(event) =>
                    setDescription(event.currentTarget.value)
                  }
                ></Textarea>
                <button
                  className="rounded-2xl w-full border border-gray-300 bg-blue-500 text-white py-[6px] mt-4 "
                  type="submit"
                >
                  Submit
                </button>
              </form>
              <>
                <div id="invite-form" className=""></div>
              </>
            </Modal>
          </>
        </div>
      </div>
    </div>
  );
};

export default CalendarTUI;
