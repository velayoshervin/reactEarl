import React, { useState, useEffect } from "react";
import api from "../../api";
import { DataTable } from "mantine-datatable";
import {
  Group,
  Avatar,
  Text,
  Badge,
  ActionIcon,
  Title,
  Card,
  Progress,
  Button,
  SimpleGrid,
} from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";

const AdminBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expandedIds, setExpandedIds] = useState([]);

  const getStatusColor = (status) => {
    if (!status) return "gray";
    switch (String(status).toUpperCase()) {
      case "BOOKED AND FULLY PAID":
      case "BOOKED_AND_FULLY_PAID":
        return "green";
      case "PENDING":
        return "yellow";
      default:
        return "gray";
    }
  };

  // Support both shapes: either record is a booking or record.booking exists
  const getBooking = (record) => record?.booking ?? record ?? {};

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const formattedDate = String(dateString).replace("_", ".");
      return new Date(formattedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "0.00";
    const num = Number(amount);
    if (Number.isNaN(num)) return "0.00";
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getPaymentMethodDisplay = (method) => {
    if (!method) return "Unknown";
    return (
      String(method).charAt(0).toUpperCase() +
      String(method).slice(1).replace(/_/g, " ")
    );
  };

  const renderExpanded = (record) => {
    const booking = getBooking(record);
    console.log("Expanded booking:", booking); // <-- check what's actually passed here

    const payments = booking.payments ?? [];

    return (
      <div
        style={{
          padding: "20px",
          background: "#f8f9fa",
          margin: "10px 0",
          borderRadius: "8px",
        }}
      >
        <Group justify="space-between" mb="md">
          <Title order={4}>
            Booking #{booking?.id} - {booking?.fullName}'s{" "}
            {booking?.eventDescription}
          </Title>
          <Group>
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="outline" size="sm">
              Print
            </Button>
          </Group>
        </Group>

        <SimpleGrid cols={2} spacing="lg">
          <div>
            <Text fw={500} mb="sm">
              Booking Information
            </Text>
            <Group mb="xs">
              <Badge color={getStatusColor(booking.bookingStatus)}>
                {booking.bookingStatus}
              </Badge>
            </Group>
            <Text size="sm">
              <strong>Customer:</strong> {booking.fullName}
            </Text>
            <Text size="sm">
              <strong>Email:</strong> {booking.userEmail}
            </Text>
            <Text size="sm">
              <strong>Event:</strong> {booking.eventDescription}
            </Text>
            <Text size="sm">
              <strong>Created:</strong> {formatDate(booking.createdAt)}
            </Text>
            <Text size="sm">
              <strong>Requested Date:</strong>{" "}
              {formatDate(booking.requestedDate)}
            </Text>
          </div>

          <Card withBorder>
            <Group justify="apart" mb="xs">
              <Text fw={500}>Payment Summary</Text>
              <Text size="sm">{booking.paymentPercentage ?? 0}% Paid</Text>
            </Group>
            <Progress
              value={booking.paymentPercentage ?? 0}
              mt="sm"
              size="lg"
            />
            <Group mt="md" justify="apart">
              <div>
                <Text size="sm">
                  <strong>Total:</strong> ₱
                  {formatCurrency(
                    booking.totalAmount ??
                      (booking.amountPaid != null && booking.balance != null
                        ? Number(booking.amountPaid) + Number(booking.balance)
                        : null)
                  )}
                </Text>
                <Text size="sm">
                  <strong>Paid:</strong> ₱{formatCurrency(booking.amountPaid)}
                </Text>
                <Text size="sm" c={booking.balance > 0 ? "red" : "green"}>
                  <strong>Balance:</strong> ₱{formatCurrency(booking.balance)}
                </Text>
              </div>
              <Button size="sm">Record Payment</Button>
            </Group>
          </Card>
        </SimpleGrid>

        <Card withBorder mt="md">
          <Text fw={500} mb="sm">
            Payment History ({payments.length} payments)
          </Text>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <Group
                key={payment.id}
                justify="apart"
                py="xs"
                style={{ borderBottom: "1px solid #e9ecef" }}
              >
                <div style={{ flex: 2 }}>
                  <Text size="sm" fw={500}>
                    {formatDate(payment.paymentDate)} •{" "}
                    {getPaymentMethodDisplay(payment.paymentMethod)}
                  </Text>
                  <Text size="xs" c="dimmed" style={{ whiteSpace: "pre-line" }}>
                    {payment.description}
                  </Text>
                  {payment.transactionId && (
                    <Text size="xs" c="dimmed">
                      TXN: {payment.transactionId}
                    </Text>
                  )}
                  {payment.customerName &&
                    payment.customerName !== booking.fullName && (
                      <Text size="xs" c="dimmed">
                        Paid by: {payment.customerName}
                      </Text>
                    )}
                </div>
                <div style={{ textAlign: "right", flex: 1 }}>
                  <Text fw={500}>₱{formatCurrency(payment.amount)}</Text>
                  {payment.fee > 0 && (
                    <Text size="xs" c="dimmed">
                      Fee: ₱{formatCurrency(payment.fee)}
                    </Text>
                  )}
                  {payment.netAmount != null && (
                    <Text size="xs" c="dimmed">
                      Net: ₱{formatCurrency(payment.netAmount)}
                    </Text>
                  )}
                </div>
                <Badge color="green" style={{ flex: 0.5 }}>
                  {payment.status}
                </Badge>
              </Group>
            ))
          ) : (
            <Text c="dimmed" size="sm" ta="center" py="md">
              No payments recorded yet
            </Text>
          )}
        </Card>
      </div>
    );
  };

  const columns = [
    {
      accessor: "expand",
      title: "",
      width: 40,
      render: (record) => {
        const id = getBooking(record).id;
        return (
          <ActionIcon
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              if (!id) return;
              setExpandedIds((current) =>
                current.includes(id)
                  ? current.filter((i) => i !== id)
                  : [...current, id]
              );
            }}
          >
            {expandedIds.includes(id) ? (
              <IconChevronUp size={16} />
            ) : (
              <IconChevronDown size={16} />
            )}
          </ActionIcon>
        );
      },
    },
    { accessor: "id", title: "ID", width: 80 },
    {
      accessor: "fullName",
      title: "CUSTOMER",
      width: 200,
      render: (record) => {
        const b = getBooking(record);
        return (
          <Group>
            <Avatar src={b.avatarUrl} alt={b.fullName} radius="xl" size="sm">
              {b.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {b.fullName}
              </Text>
              <Text size="xs" c="dimmed">
                {b.userEmail}
              </Text>
            </div>
          </Group>
        );
      },
    },
    {
      accessor: "bookingStatus",
      title: "STATUS",
      width: 180,
      render: (record) => (
        <Badge color={getStatusColor(getBooking(record).bookingStatus)}>
          {getBooking(record).bookingStatus}
        </Badge>
      ),
    },
    {
      accessor: "totalAmount",
      title: "TOTAL",
      width: 120,
      render: (record) => {
        const b = getBooking(record);
        const total =
          b.totalAmount ??
          (b.amountPaid != null && b.balance != null
            ? Number(b.amountPaid) + Number(b.balance)
            : null);
        return `₱${formatCurrency(total)}`;
      },
    },
    {
      accessor: "amountPaid",
      title: "PAID",
      width: 120,
      render: (r) => `₱${formatCurrency(getBooking(r).amountPaid)}`,
    },
    {
      accessor: "balance",
      title: "BALANCE",
      width: 120,
      render: (r) => (
        <Text color={getBooking(r).balance > 0 ? "red" : "green"} fw={500}>
          ₱{formatCurrency(getBooking(r).balance)}
        </Text>
      ),
    },
    {
      accessor: "paymentPercentage",
      title: "PROGRESS",
      width: 100,
      render: (r) => `${getBooking(r).paymentPercentage ?? 0}%`,
    },
    {
      accessor: "requestedDate",
      title: "EVENT DATE",
      width: 120,
      render: (r) => formatDate(getBooking(r).requestedDate),
    },
    {
      accessor: "eventDescription",
      title: "EVENT TYPE",
      width: 150,
      render: (r) => (
        <Text size="sm" lineClamp={1}>
          {getBooking(r).eventDescription}
        </Text>
      ),
    },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(
          `/booking?page=${page - 1}&size=${pageSize}`,
          { withCredentials: true }
        );

        if (res && res.data) {
          const data = res.data;
          console.log("Full API response:", data);
          // use data.content directly (your API already returns the booking objects)
          setContent(data.content || []);
          setTotalRecords(data.totalElements || 0);
          console.log("Set content length:", (data.content || []).length);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [page, pageSize]);

  return (
    <div>
      <DataTable
        columns={columns}
        records={content}
        fetching={isLoading}
        totalRecords={totalRecords}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={setPage}
        onRecordsPerPageChange={setPageSize}
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedIds,
            onRecordIdsChange: setExpandedIds,
          },
          content: renderExpanded,
        }}
        onRowClick={(record) => {
          const id = getBooking(record).id;
          if (!id) return;
          setExpandedIds((current) =>
            current.includes(id)
              ? current.filter((i) => i !== id)
              : [...current, id]
          );
        }}
      />
    </div>
  );
};

export default AdminBooking;
