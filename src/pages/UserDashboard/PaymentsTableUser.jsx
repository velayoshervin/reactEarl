// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Table,
//   Pagination,
//   Loader,
//   Center,
//   Text,
//   Group,
//   Paper,
//   Box,
//   Tooltip,
//   Avatar,
//   Select,
//   Title,
// } from "@mantine/core";
// import { queryClient } from "../../AxiosTanstack";
// import { DataTable } from "mantine-datatable";
// import "mantine-datatable/styles.layer.css";

// const PaymentsTableUser = () => {
//   const [payments, setPayments] = useState([]);
//   const [page, setPage] = useState(1);
//   const [size] = useState(10); // rows per page
//   // eslint-disable-next-line no-unused-vars
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [totalElements, setTotalElements] = useState(0);
//   // eslint-disable-next-line no-unused-vars
//   const [pageIsLast, setPageIsLast] = useState(false);
//   // eslint-disable-next-line no-unused-vars
//   const [user, setUser] = useState(null); // user state to hold the current user info
//   const [userId, setUserId] = useState();

//   useEffect(() => {
//     // Get the current user from the query cache
//     const currentUser = queryClient.getQueryData(["currentUser"]);
//     if (currentUser) {
//       setUser(currentUser);
//       console.log(currentUser);
//       setUserId(currentUser.userId);
//       console.log("userId", userId);
//     }
//   }, []);

//   useEffect(() => {
//     // Only fetch payments if userId is available and has changed
//     if (userId) {
//       fetchPayments(page);
//     }
//   }, [page, userId]);

//   const fetchPayments = async (pageNum) => {
//     setLoading(true);
//     try {
//       // Note: API pages usually start from 0, but Mantine DataTable uses 1-based
//       const apiPage = pageNum - 1;
//       const response = await axios.get(
//         `http://localhost:8080/paymongo/payments/user/${userId}?page=${apiPage}&size=${size}`
//       );

//       const data = response.data;
//       setPayments(data.content);
//       setTotalPages(data.totalPages);
//       setTotalElements(data.totalElements);
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Center style={{ height: "200px" }}>
//         <Loader />
//       </Center>
//     );
//   }

//   if (payments.length === 0) {
//     return (
//       <Center>
//         <Text>No payments found.</Text>
//       </Center>
//     );
//   }

//   return (
//     <>
//       <DataTable
//         columns={[
//           {
//             accessor: "quotationReference",
//             title: "Quotation #",
//             textAlign: "left",
//           },
//           {
//             accessor: "amountFormatted",
//             title: "Amount Paid",
//             textAlign: "right",
//             render: ({ amountFormatted }) =>
//               `₱ ${amountFormatted.toLocaleString()}`,
//           },
//           {
//             accessor: "totalAmountDue",
//             title: "Total Due",
//             textAlign: "right",
//             render: ({ totalAmountDue }) =>
//               `₱ ${totalAmountDue.toLocaleString()}`,
//           },
//           {
//             accessor: "remainingBalanceFormatted",
//             title: "Remaining Balance",
//             textAlign: "right",
//             render: ({ remainingBalanceFormatted }) =>
//               `₱ ${remainingBalanceFormatted.toLocaleString()}`,
//           },
//           { accessor: "paymentType", title: "Payment Type" },
//           { accessor: "status", title: "Status" },
//           { accessor: "paidAtFormatted", title: "Paid At" },
//           { accessor: "createdAtFormatted", title: "Created At" },
//           { accessor: "description", title: "Description" },
//         ]}
//         styles={{
//           header: {
//             color: "white", // change text color
//             backgroundColor: "#D6A99D", // change header background
//             fontWeight: 700,
//           },
//         }}
//         minHeight={200}
//         height={680}
//         withTableBorder
//         verticalSpacing="md"
//         records={payments}
//         // Pagination properties
//         totalRecords={totalElements}
//         recordsPerPage={size}
//         page={page}
//         onPageChange={setPage}
//         paginationSize="md"
//         paginationActiveBackgroundColor="grape"
//         paginationText={({ from, to, totalRecords }) =>
//           `Showing ${from} to ${to} of ${totalRecords} payments`
//         }
//         recordsPerPageLabel="Payments per page:"
//         // Loading state
//         fetching={loading}
//         noRecordsText="No payments found"
//         borderRadius="sm"
//         withColumnBorders
//         striped
//         highlightOnHover
//       ></DataTable>
//     </>
//   );
// };

// export default PaymentsTableUser;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Pagination,
  Loader,
  Center,
  Text,
  Group,
  Paper,
  Box,
  Tooltip,
  Avatar,
  Select,
  Title,
  Badge,
  Card,
  Progress,
  Stack,
  Divider,
} from "@mantine/core";
import { queryClient } from "../../AxiosTanstack";
import { DataTable } from "mantine-datatable";
import "mantine-datatable/styles.layer.css";
import {
  IconReceipt,
  IconCalendar,
  IconCash,
  IconWallet,
} from "@tabler/icons-react";

const PaymentsTableUser = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const currentUser = queryClient.getQueryData(["currentUser"]);
    if (currentUser) {
      setUser(currentUser);
      setUserId(currentUser.userId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPayments(page);
    }
  }, [page, userId]);

  const fetchPayments = async (pageNum) => {
    setLoading(true);
    try {
      const apiPage = pageNum - 1;
      const response = await axios.get(
        `http://localhost:8080/paymongo/payments/user/${userId}?page=${apiPage}&size=${size}`
      );

      const data = response.data;
      setPayments(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return "green";
      case "pending":
        return "yellow";
      case "failed":
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getPaymentTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "card":
        return "💳";
      case "gcash":
        return "📱";
      case "bank":
        return "🏦";
      default:
        return "💰";
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "300px" }}>
        <Stack align="center" spacing="md">
          <Loader size="lg" />
          <Text color="dimmed">Loading your payment history...</Text>
        </Stack>
      </Center>
    );
  }

  if (payments.length === 0) {
    return (
      <Center style={{ height: "300px" }}>
        <Stack align="center" spacing="md">
          <IconReceipt size={48} color="#ccc" />
          <Text size="lg" color="dimmed">
            No payments found
          </Text>
          <Text size="sm" color="dimmed">
            Your payment history will appear here
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {/* Header */}
      <Group position="apart" mb="xl">
        <Stack spacing={4}>
          <Group spacing="sm">
            <IconCash size={24} color="#4A6DA7" />
            <Title order={3} color="#2C3E50">
              Payment History
            </Title>
          </Group>
          <Text size="sm" color="dimmed">
            Track your payments and balances
          </Text>
        </Stack>

        <Badge
          size="lg"
          variant="filled"
          color="blue"
          leftSection={<IconWallet size={14} />}
        >
          {totalElements} Payments
        </Badge>
      </Group>

      <DataTable
        columns={[
          {
            accessor: "quotationReference",
            title: "QUOTATION",
            textAlign: "left",
            width: 120,
            render: ({ quotationReference }) => (
              <Group spacing="xs">
                <IconReceipt size={16} color="#4A6DA7" />
                <Text weight={600}>#{quotationReference}</Text>
              </Group>
            ),
          },
          {
            accessor: "amountFormatted",
            title: "AMOUNT PAID",
            textAlign: "right",
            width: 140,
            render: ({ amountFormatted }) => (
              <Stack spacing={2} align="flex-end">
                <Text weight={700} size="sm" color="green">
                  ₱{amountFormatted.toLocaleString()}
                </Text>
                <Text size="xs" color="dimmed">
                  Payment
                </Text>
              </Stack>
            ),
          },
          {
            accessor: "totalAmountDue",
            title: "TOTAL DUE",
            textAlign: "right",
            width: 130,
            render: ({ totalAmountDue }) => (
              <Stack spacing={2} align="flex-end">
                <Text weight={600} size="sm">
                  ₱{totalAmountDue.toLocaleString()}
                </Text>
                <Text size="xs" color="dimmed">
                  Total
                </Text>
              </Stack>
            ),
          },
          {
            accessor: "remainingBalanceFormatted",
            title: "BALANCE",
            textAlign: "right",
            width: 130,
            render: ({ remainingBalanceFormatted, totalAmountDue }) => {
              const paidAmount = totalAmountDue - remainingBalanceFormatted;
              const progress =
                totalAmountDue > 0 ? (paidAmount / totalAmountDue) * 100 : 0;

              return (
                <Stack spacing={4} align="flex-end" style={{ minWidth: 120 }}>
                  <Text
                    weight={600}
                    size="sm"
                    color={remainingBalanceFormatted === 0 ? "green" : "orange"}
                  >
                    ₱{remainingBalanceFormatted.toLocaleString()}
                  </Text>
                  <Progress
                    value={progress}
                    size="sm"
                    color={remainingBalanceFormatted === 0 ? "green" : "blue"}
                    style={{ width: 80 }}
                  />
                  <Text size="xs" color="dimmed">
                    {Math.round(progress)}% paid
                  </Text>
                </Stack>
              );
            },
          },
          {
            accessor: "paymentType",
            title: "METHOD",
            width: 120,
            render: ({ paymentType }) => (
              <Group spacing="xs">
                <Text size="sm">{getPaymentTypeIcon(paymentType)}</Text>
                <Text size="sm" transform="capitalize">
                  {paymentType}
                </Text>
              </Group>
            ),
          },
          {
            accessor: "status",
            title: "STATUS",
            width: 120,
            render: ({ status }) => (
              <Badge color={getStatusColor(status)} variant="filled" size="md">
                {status}
              </Badge>
            ),
          },
          {
            accessor: "paidAtFormatted",
            title: "PAID DATE",
            width: 140,
            render: ({ paidAtFormatted }) => (
              <Group spacing="xs">
                <IconCalendar size={14} color="#666" />
                <Text size="sm">{paidAtFormatted}</Text>
              </Group>
            ),
          },
          {
            accessor: "description",
            title: "NOTES",
            render: ({ description }) => (
              <Tooltip label={description} withinPortal>
                <Text
                  size="sm"
                  color="dimmed"
                  style={{
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {description || "No description"}
                </Text>
              </Tooltip>
            ),
          },
        ]}
        styles={{
          root: {
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
          },
          header: {
            backgroundColor: "#4A6DA7",
            color: "white",
            fontWeight: 600,
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          },
          row: {
            "&:hover": {
              backgroundColor: "#f8f9fa",
            },
          },
          cell: {
            borderBottom: "1px solid #e9ecef",
          },
        }}
        minHeight={400}
        height={600}
        withTableBorder
        verticalSpacing="md"
        records={payments}
        totalRecords={totalElements}
        recordsPerPage={size}
        page={page}
        onPageChange={setPage}
        paginationSize="md"
        paginationActiveBackgroundColor="#4A6DA7"
        paginationText={({ from, to, totalRecords }) => (
          <Text size="sm" color="dimmed">
            Showing{" "}
            <Text span weight={600}>
              {from}-{to}
            </Text>{" "}
            of{" "}
            <Text span weight={600}>
              {totalRecords}
            </Text>{" "}
            payments
          </Text>
        )}
        fetching={loading}
        noRecordsText="No payments records found"
        borderRadius="md"
        striped
        highlightOnHover
      />

      {/* Summary Footer */}
      {payments.length > 0 && (
        <Box mt="md" pt="md" style={{ borderTop: "1px solid #e9ecef" }}>
          <Group position="apart">
            <Text size="sm" color="dimmed">
              Page {page} of {totalPages}
            </Text>
            <Text size="sm" color="dimmed">
              {size} payments per page
            </Text>
          </Group>
        </Box>
      )}
    </Card>
  );
};

export default PaymentsTableUser;
