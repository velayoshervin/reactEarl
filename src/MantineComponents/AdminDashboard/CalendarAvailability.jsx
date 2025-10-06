import React, { useEffect, useState } from "react";
import { DataTable } from "mantine-datatable";
import dayjs from "dayjs";
import { loadDefaultCalendar } from "../../ItemsAxios";
import { updateCalendar } from "../../ItemsAxios";
import {
  Box,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  Button,
  Text,
  Tooltip,
  Badge,
  LoadingOverlay,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import { DatePickerInput } from "@mantine/dates";
import { IconPlus } from "@tabler/icons-react";
import { IconCalendar } from "@tabler/icons-react";
import axios from "axios";

const CalendarAvailability = () => {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [resData, setResData] = useState();
  const [payload, setPayload] = useState();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [searchDate, setSearchDate] = useState();
  const [loading, setLoading] = useState(false);
  const [toBlock, setToBlock] = useState();

  // Modal state
  const [opened, setOpened] = useState(false);
  const [modalData, setModalData] = useState({});

  const [addData, setAddData] = useState({
    status: "",
    reason: "",
  });

  const [searchMode, setSearchMode] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [excludedDates, setExcludedDates] = useState();

  // Open modal with row data
  function handleEdit(row) {
    setModalData(row);
    setOpened(true);
  }
  async function handleResetSearch() {
    setSearchDate(null);
    setPage(1);
    setSearchMode(false);
    setCurrentFilters({});

    try {
      const res = await loadDefaultCalendar({ page: 1 });
      setResData(res.data);
      setRecords(res.data?.content || []);
    } catch (err) {
      console.error(err);
    }
  }

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (searchMode && currentFilters.date) {
          // Fetch with search filters
          res = await axios.get(
            "http://localhost:8080/public/api/calendar/blocked-date",
            {
              params: {
                date: currentFilters.date,
                page: page - 1, // Convert to 0-based for API
                size: 10,
              },
              withCredentials: true,
            }
          );
        } else {
          // Fetch normal paginated data
          res = await loadDefaultCalendar({ page });
        }

        console.log("Updated pageElements:", res.data);
        setResData(res.data);
        setRecords(res.data?.content || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [page, payload, searchMode, currentFilters]);

  function handleFormSubmit(e) {
    e.preventDefault();
    updateCalendar(modalData)
      .then((res) => {
        setPayload(modalData);
        console.log("res status: " + res.status + " update data: " + res.data);
        notifications.show({
          title: "record saved",
          message: "record has been saved",
          autoClose: 2000,
        });

        setTimeout(() => setOpened(false), 2000);
      })
      .catch((err) => console.log(err));
  }

  async function handleSearchDate() {
    if (!searchDate) return;

    setLoading(true);
    try {
      const formattedDate = dayjs(searchDate).format("YYYY-MM-DD");
      const res = await axios.get(
        "http://localhost:8080/public/api/calendar/blocked-date",
        {
          params: {
            date: formattedDate,
            page: 0, // Always start from first page when searching
            size: 10, // Match your page size
          },
          withCredentials: true,
        }
      );

      if (res.data) {
        setResData(res.data);
        setRecords(res.data?.content || []);
        setPage(1); // Reset to first page
        setSearchMode(true); // Enable search mode
        setCurrentFilters({ date: formattedDate }); // Store current filters
      }
    } catch (err) {
      console.log(err.response);
      notifications.show({
        title: "Search failed",
        message: "Error searching dates",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

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

  async function handleBlockDate() {
    if (!toBlock) {
      notifications.show({
        title: "Error",
        message: "Please select a date",
        color: "red",
      });
      return;
    }
    if (!addData.status || !addData.reason) {
      notifications.show({
        title: "Error",
        message: "Please select status and provide a reason",
        color: "red",
      });
      return;
    }
    try {
      const payload = {
        date: dayjs(toBlock).format("YYYY-MM-DD"), // Format as YYYY-MM-DD for LocalDate
        status: addData.status,
        reason: addData.reason,
        booking: null, // Since it's @OneToOne optional relationship
      };

      const res = await axios.post(
        "http://localhost:8080/public/api/calendar",
        payload,
        {
          withCredentials: true, // Add credentials if needed
        }
      );
      if (res.status === 201) {
        notifications.show({
          title: "Success",
          message: "Date blocked successfully",
          color: "green",
        });

        setOpenAddModal(false);
        setToBlock(null);
        setAddData({});
        setPage(1);
      }
    } catch (err) {
      console.error(err);
      notifications.show({
        title: "Error",
        message: "failed",
        color: "red",
      });
    }
  }

  return (
    <>
      <div className="my-table border border-gray-300 w-fit mx-auto overflow-clip box-content rounded px-8 bg-white py-6">
        <>
          <Modal
            opened={openAddModal}
            onClose={() => setOpenAddModal(false)}
            title="Block a date"
          >
            <div>
              <DatePickerInput
                label="Pick date"
                className="min-w-48 max-w-60"
                clearable
                leftSection={<IconCalendar size={18} stroke={1.5} />}
                value={toBlock}
                onChange={setToBlock}
                minDate={dayjs().add(2, "day").toDate()}
                excludeDate={isDateExcluded}
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
              ></DatePickerInput>
              <Select
                label="Status"
                placeholder="Select status"
                value={addData.status}
                data={["BOOKED", "BLOCKED", "MAINTENANCE", "HOLIDAY", "OTHER"]}
                onChange={(value) =>
                  setAddData((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
                required
              />
              <TextInput
                label="Reason"
                placeholder="reason for blocking date"
                value={addData.reason}
                onChange={(event) =>
                  setAddData((prev) => ({
                    ...prev,
                    reason: event.currentTarget.value,
                  }))
                }
                required
              />
              <Button fullWidth className="py-2 mt-1" onClick={handleBlockDate}>
                Block date
              </Button>
            </div>
          </Modal>
          <div className="flex justify-end gap-4 items-center pb-2">
            <div className="flex items-center gap-2">
              <Text
                span
                size="sm"
                onClick={handleResetSearch}
                style={{ cursor: "pointer" }}
                td="underline"
                className="hover:no-underline" // Or keep it always underlined
              >
                Latest
              </Text>
              <Text size="sm">Search By date:</Text>
              <DatePickerInput
                className="min-w-48 max-w-60"
                clearable
                leftSection={<IconCalendar size={18} stroke={1.5} />}
                value={searchDate}
                onChange={setSearchDate}
              ></DatePickerInput>
              <Badge size="lg" onClick={handleSearchDate}>
                <span className="cursor-pointer">search</span>
              </Badge>
            </div>
            <Tooltip label="block a date " color="blue">
              <ActionIcon
                variant="gradient"
                size="md"
                aria-label="Gradient action icon"
                gradient={{ from: "blue", to: "cyan", deg: 92 }}
                onClick={() => setOpenAddModal(true)}
              >
                <IconPlus size={14}></IconPlus>
              </ActionIcon>
            </Tooltip>
          </div>
        </>
        <Box pos="relative">
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ color: "pink", type: "bars" }}
          />
          <DataTable
            withColumnBorders
            withTableBorder
            minHeight={200}
            horizontalSpacing="lg"
            verticalSpacing="md"
            recordsPerPage={10}
            styles={{
              header: {
                color: "white", // change text color
                backgroundColor: "#898AC4", // change header background
                fontWeight: 700,
              },
            }}
            totalRecords={resData?.totalElements}
            page={page} // 1-based
            records={records}
            paginationText={({ from, to, totalRecords }) =>
              `Records ${from}-${to} of ${totalRecords}`
            }
            striped
            stripedColor="#EFF6FF"
            onPageChange={(p) => setPage(p)}
            columns={[
              {
                accessor: "date",
                width: 240,
                render: ({ date }) => dayjs(date).format("MMM D YYYY"),
              },
              { accessor: "status", width: 200 },
              { accessor: "reason", width: 200 },
              { accessor: "bookingId", width: 100, textAlignment: "center" },
              {
                accessor: "action",
                title: <Box mr={6}>Row actions</Box>,
                render: (row) => (
                  <>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(row)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </>
                ),
              },
            ]}
          />
        </Box>
      </div>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Edit record for ${dayjs(modalData.date).format("MMM D YYYY")}`}
        size="md"
        centered
      >
        <div>
          <p>Booking ID: {modalData.bookingId}</p>
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleFormSubmit}>
          <TextInput label="date" value={modalData.date} readOnly />
          <Select
            label="Status"
            placeholder="Select status"
            value={modalData.status}
            data={[
              "BOOKED",
              "BLOCKED",
              "AVAILABLE",
              "RESCHEDULED",
              "MAINTENANCE",
              "HOLIDAY",
            ]}
            onChange={(value) =>
              setModalData((prev) => ({
                ...prev,
                status: value,
              }))
            }
            required
          />
          <TextInput
            label="Reason"
            placeholder="reason for blocking date"
            value={modalData.reason}
            onChange={(event) =>
              setModalData((prev) => ({
                ...prev,
                reason: event.currentTarget.value,
              }))
            }
            required
          />
          <Button fullWidth className="py-2 mt-1" type="submit">
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default CalendarAvailability;
