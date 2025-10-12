import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Group,
  Text,
  Stack,
  Badge,
  Flex,
  Select,
  Box,
  Loader,
  Card,
  Divider,
  HoverCard,
  Avatar,
} from "@mantine/core";
import axios from "axios";
import { queryClient } from "../../AxiosTanstack";
import { DataTable } from "mantine-datatable";
import dayjs from "dayjs";
import "mantine-datatable/styles.layer.css";
import { useDisclosure } from "@mantine/hooks";
import { IconFileDescription, IconInfoCircle } from "@tabler/icons-react";
import PCardContainer from "../../components/ProductComponents/PCardContainer";
import Customization from "../../MantineComponents/mantine/Customization";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import AvailableCalendar from "../../components/AvailableCalendar";
import { IconCalendarEvent } from "@tabler/icons-react";

const QuotationsTable = () => {
  const [quotations, setQuotations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [userId, setUserId] = useState();
  const [selectValue, setSelectValue] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [totalPayment, setTotalPayment] = useState(undefined);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [editQuotation, setEditQuotation] = useState(false);

  const [selectedEditQuotation, setSelectedEditQuotation] = useState();

  const [paginatedResponse, setPaginatedResponse] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 5,
    last: false,
  });

  // 🧭 Payment options generator
  const getPaymentOptions = useCallback((quotation, totalPayment) => {
    if (!quotation) return [];

    console.log("🔄 getPaymentOptions:", {
      status: quotation.status,
      totalPayment,
      total: quotation.total,
    });

    const formatCurrency = (v) =>
      v.toLocaleString("en-PH", { style: "currency", currency: "PHP" });

    const total = quotation.total ?? 0;

    if (quotation.status === "RESERVED") {
      return [
        {
          value: "book",
          label: formatCurrency(total * 0.2),
          tag: "Pay additional 20% to confirm booking",
        },
        {
          value: "pay Remaining",
          label: formatCurrency(total * 0.9),
          tag: "Pay remaining 90% balance",
        },
      ];
    }

    if (quotation.status === "BOOKED") {
      if (totalPayment == null)
        return [
          {
            value: "pay Remaining",
            label: "Loading...",
            tag: "Fetching payment info...",
          },
        ];

      return [
        {
          value: "pay Remaining",
          label: formatCurrency(total - totalPayment),
          tag: "Pay remaining balance",
        },
      ];
    }

    if (quotation.status === "PAID") return [];

    // Default (DRAFT)
    return [
      {
        value: "reservation",
        label: formatCurrency(total * 0.1),
        tag: "10% reservation fee",
      },
      {
        value: "book",
        label: formatCurrency(total * 0.2),
        tag: "20% booking fee",
      },
      { value: "pay Full", label: formatCurrency(total), tag: "Pay in full" },
    ];
  }, []);

  const paymentOptions = useMemo(() => {
    if (!selectedQuotation) return [];
    const options = getPaymentOptions(selectedQuotation, totalPayment);
    console.log("💾 Final payment options:", options);
    return options;
  }, [selectedQuotation, totalPayment, getPaymentOptions]);

  const fetchQuotationById = async (pageNumber) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/quotations/${userId}`,
        {
          params: { pageNumber, size: pageSize },
          withCredentials: true,
        }
      );
      setPaginatedResponse(res.data);
      setQuotations(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const user = queryClient.getQueryData(["currentUser"]);
    if (user) {
      setCurrentUser(user);
      setUserId(user.userId);
    }
  }, []);

  useEffect(() => {
    if (userId) fetchQuotationById(page - 1);
  }, [page, userId]);

  // 🟢 Payment modal trigger
  const openPaymentModal = async (quotation) => {
    setSelectedQuotation(quotation);
    setEventDate(
      quotation.requestedEventDate
        ? dayjs(quotation.requestedEventDate).toDate()
        : null
    );
    setIsLoadingPayments(true);
    setPaymentModalOpen(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/quotations/totalPayments`,
        {
          params: { quotationId: quotation.quotationId },
          withCredentials: true,
        }
      );
      console.log("✅ Payments API response:", res.data);
      setTotalPayment(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch total payments:", err);
      setTotalPayment(null);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handlePartialPayment = async (quotationId, amount, paymentType) => {
    const payload = {
      quotationId,
      amount,
      eventDate: eventDate ? eventDate.toISOString() : null,
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/public/checkout/partial-payment",
        payload,
        { params: { paymentType }, withCredentials: true }
      );

      const { checkout_url } = res.data;
      if (checkout_url) window.location.href = checkout_url;
      else alert("Failed to get checkout URL.");
    } catch (err) {
      console.error("Partial pay error:", err.response);
    }
  };

  const handlePay = async (quotationId, eventDate, amount) => {
    try {
      const eventTime = dayjs(eventDate).format("YYYY-MM-DD");
      const res = await axios.post(
        `http://localhost:8080/public/checkout/${quotationId}`,
        {},
        { params: { eventDate: eventTime, amount }, withCredentials: true }
      );
      const { checkout_url } = res.data;
      if (checkout_url) window.location.href = checkout_url;
      else alert("Failed to get checkout URL.");
    } catch (err) {
      console.error(err);
      alert("Error creating PayMongo checkout session.");
    }
  };

  const renderSelectOption = ({ option }) => {
    const colorMap = { reservation: "green", book: "red", paid: "yellow" };
    return (
      <div className="flex flex-col w-full gap-2 hover:text-blue-600 ">
        <div className="flex items-center justify-end">
          <Badge color={colorMap[option.value]}>{option.value}</Badge>
        </div>
        {isLoadingPayments ? (
          <Loader size={30} />
        ) : (
          <Box pos="relative">
            <p className="hover:underline">{option.label}</p>
            <Text size="xs">{option.tag}</Text>
          </Box>
        )}
      </div>
    );
  };
  const handleRebook = (quotation) => {
    modals.open({
      title: "Change Event Date",
      children: (
        <div>
          <Text mb="md">
            Select new event date for quotation #{quotation.quotationId}
          </Text>

          <AvailableCalendar
            initialDate={quotation.requestedEventDate}
            onDateSelect={(date) => {
              handleDateChange(quotation.quotationId, date);
              modals.closeAll(); // Close modal after selection
            }}
          />
        </div>
      ),
    });
  };
  const handleDateChange = async (quotationId, newDate) => {
    console.log("📅 Date change debug:", {
      quotationId,
      newDate,
      formattedDate: dayjs(newDate).format("YYYY-MM-DD"),
    });

    try {
      const formattedDate = dayjs(newDate).format("YYYY-MM-DD");

      const response = await axios.patch(
        `http://localhost:8080/quotations/${quotationId}/date/${formattedDate}`,
        {}, // Empty body
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Date change successful:", response.data);

      notifications.show({
        title: "Date Updated",
        message: "Your event date has been changed successfully",
        color: "green",
      });

      fetchQuotationById(page - 1); // Refresh
    } catch (error) {
      console.error("❌ Date change error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message,
        headers: error.response?.headers,
      });

      if (error.response?.status === 403) {
        notifications.show({
          title: "Access Denied",
          message: "Please log in again to continue",
          color: "red",
        });
        // window.location.href = '/login';
      } else {
        notifications.show({
          title: "Date Change Failed",
          message: error.response?.data?.message || "Could not update date",
          color: "red",
        });
      }
    }
  };

  const handleCancel = async (quotation) => {
    modals.openConfirmModal({
      title: "Cancel Quotation",
      children: (
        <div>
          <Text>Are you sure you want to cancel this quotation?</Text>
          <Text size="sm" c="dimmed" mt="sm">
            Quotation #{quotation.quotationId} - {quotation.eventType}
          </Text>
        </div>
      ),
      labels: { confirm: "Cancel Quotation", cancel: "Keep Active" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await axios.patch(
            `http://localhost:8080/quotations/${quotation.quotationId}/cancel`,
            {},
            { withCredentials: true }
          );

          notifications.show({
            title: "Quotation Cancelled",
            message: "The quotation has been cancelled successfully",
            color: "green",
          });

          queryClient.invalidateQueries(["quotations"]);
        } catch (error) {
          notifications.show({
            title: "Cancellation Failed",
            message:
              error.response?.data?.message || "Unable to cancel quotation",
            color: "red",
          });
        }
      },
    });
  };

  return (
    <>
      {/* 🟩 Data Table */}
      <DataTable
        height={600}
        withTableBorder
        verticalSpacing="lg"
        styles={{
          header: {
            color: "white",
            backgroundColor: "#898AC4",
            fontWeight: 700,
          },
        }}
        columns={[
          { accessor: "quotationId", title: "Booking Id", textAlign: "center" },
          {
            accessor: "requestedEventDate",
            title: "Event Date",
            textAlign: "center",
            render: ({ requestedEventDate }) =>
              requestedEventDate
                ? dayjs(requestedEventDate).format("dddd, MMM D YYYY")
                : "—",
          },
          { accessor: "pax", title: "Guest count", textAlign: "center" },
          { accessor: "eventType", title: "Event", textAlign: "center" },
          { accessor: "total", title: "Total amount", textAlign: "center" },
          {
            accessor: "Fullname",
            title: "Full name",
            textAlign: "center",
            render: (row) => (
              <div className="flex items-center">
                <Avatar src={row.user.avatarUrl || null}>
                  {" "}
                  {!row.user.avatar &&
                    row.user.firstname[0] + row.user.lastname[0]}
                </Avatar>
                <div className="flex">
                  <Text size="sm">{row.user.firstname}</Text> <span> </span>{" "}
                  <Text size="sm">{row.user.lastname}</Text>
                </div>
              </div>
            ),
          },
          {
            accessor: "status",
            title: "Status",
            textAlign: "center",
            render: (row) => {
              const colorMap = {
                RESERVED: "green",
                BOOKED: "red",
                PAID: "yellow",
                default: "gray",
              };
              return (
                <Badge color={colorMap[row.status] || colorMap.default}>
                  {row.status}
                </Badge>
              );
            },
          },
          {
            accessor: "Edit",
            title: "Edit",
            render: (row) => (
              <Button
                size="xs"
                onClick={() => {
                  setSelectedEditQuotation(row);
                  alert(JSON.stringify(row));
                  console.log(row);
                }}
              >
                Edit
              </Button>
            ),
          },

          {
            accessor: "reschedule",
            title: "Rebook",
            render: (row) => {
              const isDisabled =
                !row.status ||
                !["PAID", "RESERVED", "BOOKED"].includes(row.status);

              return (
                <Button
                  size="xs"
                  disabled={isDisabled}
                  onClick={() => {
                    handleRebook(row);
                  }}
                >
                  Rebook
                </Button>
              );
            },
          },
          {
            accessor: "cancel",
            title: "Cancel",
            render: (row) => {
              const isDisabled =
                !row.status ||
                !["DRAFT", "SUBMITTED", "PENDING_PAYMENT"].includes(row.status);

              return (
                <Button
                  size="xs"
                  color="red"
                  disabled={isDisabled}
                  onClick={() => handleCancel(row)}
                >
                  Cancel
                </Button>
              );
            },
          },
          {
            accessor: "actions",
            title: "Actions",
            render: (row) => {
              const disabledStatuses = [
                "SUBMITTED",
                "PAID",
                "COMPLETED",
                "REJECTED",
                "CANCELLED",
              ];
              const isDisabled = disabledStatuses.includes(row.status);

              const statusLabels = {
                SUBMITTED: "PENDING APPROVAL",
                PAID: "PAID / BOOKED",
                COMPLETED: "COMPLETED",
                REJECTED: "REJECTED",
                CANCELLED: "CANCELLED",
              };

              const buttonText = statusLabels[row.status] || "PAY";

              return (
                <Button
                  size="xs"
                  color="#687FE5"
                  disabled={isDisabled}
                  onClick={isDisabled ? undefined : () => openPaymentModal(row)}
                >
                  {buttonText}
                </Button>
              );
            },
          },
        ]}
        records={quotations}
        totalRecords={paginatedResponse.totalElements ?? 0}
        page={page}
        onPageChange={setPage}
        recordsPerPage={pageSize}
      />

      {/* 🟦 Payment Modal */}
      <Modal
        opened={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title={`Quotation ${selectedQuotation?.quotationId || ""}`}
        size="lg"
      >
        {selectedQuotation && (
          <Flex direction="column" gap="md">
            <Text fw={600}>Payment Option/s</Text>

            {isLoadingPayments ? (
              <Flex align="center" gap="xs">
                <Loader size="sm" />
                <Text size="sm">Loading payment info...</Text>
              </Flex>
            ) : (
              <Select
                clearable
                data={paymentOptions}
                value={selectValue}
                onChange={setSelectValue}
                renderOption={renderSelectOption}
                placeholder="Select a payment option"
              />
            )}

            <Button
              color="green"
              disabled={!selectValue || !eventDate}
              onClick={() => {
                const total = selectedQuotation.total;
                if (selectValue === "pay Full")
                  handlePay(selectedQuotation.quotationId, eventDate, total);
                else if (selectValue === "pay Remaining" && totalPayment)
                  handlePay(
                    selectedQuotation.quotationId,
                    eventDate,
                    total - totalPayment
                  );
                else if (selectValue === "reservation")
                  handlePartialPayment(
                    selectedQuotation.quotationId,
                    total * 0.1,
                    "reservation"
                  );
                else if (selectValue === "book")
                  handlePartialPayment(
                    selectedQuotation.quotationId,
                    total * 0.2,
                    "book"
                  );
              }}
            >
              Confirm Payment
            </Button>
          </Flex>
        )}
      </Modal>
      <Customization quotation={selectedEditQuotation} />
    </>
  );
};

export default QuotationsTable;
