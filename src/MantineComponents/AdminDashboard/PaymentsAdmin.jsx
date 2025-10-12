// import React, { useState, useEffect } from "react";
// import { DataTable } from "mantine-datatable";
// import {
//   Center,
//   Loader,
//   Text,
//   Title,
//   Button,
//   Popover,
//   ScrollArea,
//   Code,
// } from "@mantine/core";
// import axios from "axios";

// const PaymentsAdmin = () => {
//   const [payments, setPayments] = useState([]);
//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [totalElements, setTotalElements] = useState(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchPayments(page);
//   }, [page]);

//   const fetchPayments = async (pageNum) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/paymongo/payments?page=${pageNum}&size=${size}`
//       );
//       const data = response.data;
//       setPayments(data.content || []);
//       setTotalElements(data.totalElements || 0);
//     } catch (err) {
//       console.error("Error fetching payments:", err);
//       setPayments([]);
//       setTotalElements(0);
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

//   const columns = [
//     { accessor: "id", title: "ID" },
//     { accessor: "quotationReference", title: "Quotation #" },
//     { accessor: "userId", title: "User ID" },
//     { accessor: "externalReference", title: "External Reference" },
//     { accessor: "paymongoPaymentId", title: "PayMongo Payment ID" },
//     { accessor: "balanceTransactionId", title: "Balance Transaction ID" },
//     { accessor: "status", title: "Status" },
//     { accessor: "paymentType", title: "Payment Type" },
//     {
//       accessor: "amount",
//       title: "Amount",
//       render: ({ amount }) => `₱ ${Number(amount || 0).toLocaleString()}`,
//     },
//     {
//       accessor: "fee",
//       title: "Fee",
//       render: ({ fee }) => `₱ ${Number(fee || 0).toLocaleString()}`,
//     },
//     {
//       accessor: "netAmount",
//       title: "Net Amount",
//       render: ({ netAmount }) => `₱ ${Number(netAmount || 0).toLocaleString()}`,
//     },
//     {
//       accessor: "remainingBalance",
//       title: "Remaining Balance",
//       render: ({ remainingBalance }) =>
//         `₱ ${Number(remainingBalance || 0).toLocaleString()}`,
//     },
//     {
//       accessor: "totalDue",
//       title: "Total Due",
//       render: ({ totalDue }) => `₱ ${Number(totalDue || 0).toLocaleString()}`,
//     },
//     { accessor: "currency", title: "Currency" },
//     { accessor: "description", title: "Description" },
//     { accessor: "statementDescriptor", title: "Statement Descriptor" },
//     { accessor: "customerName", title: "Customer Name" },
//     { accessor: "customerEmail", title: "Customer Email" },
//     { accessor: "customerPhone", title: "Customer Phone" },
//     { accessor: "sourceType", title: "Source Type" },
//     { accessor: "sourceId", title: "Source ID" },
//     { accessor: "origin", title: "Origin" },
//     {
//       accessor: "paidAt",
//       title: "Paid At",
//       render: ({ paidAt }) => (paidAt ? new Date(paidAt).toLocaleString() : ""),
//     },
//     {
//       accessor: "createdAt",
//       title: "Created At",
//       render: ({ createdAt }) =>
//         createdAt ? new Date(createdAt).toLocaleString() : "",
//     },
//     {
//       accessor: "updatedAt",
//       title: "Updated At",
//       render: ({ updatedAt }) =>
//         updatedAt ? new Date(updatedAt).toLocaleString() : "",
//     },
//     {
//       accessor: "rawPayload",
//       title: "Payload",
//       render: ({ rawPayload }) => (
//         <Popover width={600} position="bottom" withArrow shadow="md">
//           <Popover.Target>
//             <Button size="xs" variant="outline">
//               View JSON
//             </Button>
//           </Popover.Target>
//           <Popover.Dropdown>
//             <ScrollArea style={{ height: 400 }}>
//               <Code block>
//                 {rawPayload ? JSON.stringify(rawPayload, null, 2) : "{}"}
//               </Code>
//             </ScrollArea>
//           </Popover.Dropdown>
//         </Popover>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Title order={3}>Payments</Title>
//       <DataTable
//         columns={columns}
//         records={payments}
//         page={page + 1} // 1-based
//         onPageChange={(p) => setPage(p - 1)}
//         recordsPerPage={size}
//         totalRecords={totalElements}
//         paginationProps={{
//           nextDisabled: payments.length < size,
//           previousDisabled: page <= 0,
//         }}
//         minHeight={300}
//         fetching={loading}
//         noRecordsText="No payments found"
//         withTableBorder
//         borderRadius="sm"
//         striped
//         highlightOnHover
//       />
//     </>
//   );
// };

// export default PaymentsAdmin;
import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import {
  Center,
  Loader,
  Text,
  Title,
  Button,
  Popover,
  ScrollArea,
  Code,
  Badge,
  Group,
} from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";
import axios from "axios";

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  const fetchPayments = async (pageNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/paymongo/payments?page=${pageNum}&size=${size}`
      );
      const data = response.data;
      setPayments(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₱${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "green";
      case "pending":
        return "yellow";
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "200px" }}>
        <Loader />
      </Center>
    );
  }

  const columns = [
    {
      accessor: "id",
      title: "ID",
      width: 80,
    },
    {
      accessor: "quotationReference",
      title: "Quotation #",
      width: 120,
      render: ({ quotationReference }) => (
        <Group spacing="xs">
          <IconReceipt size={14} />
          <Text>#{quotationReference}</Text>
        </Group>
      ),
    },
    {
      accessor: "customerName",
      title: "Customer",
      width: 150,
    },
    {
      accessor: "customerEmail",
      title: "Email",
      width: 200,
    },
    {
      accessor: "amount",
      title: "Amount",
      width: 120,
      render: ({ amount }) => formatCurrency(amount),
    },
    {
      accessor: "netAmount",
      title: "Net (Centavo)",
      width: 140,
      render: ({ netAmount }) => (
        <Text weight={600}>{Number(netAmount || 0).toLocaleString()} ¢</Text>
      ),
    },
    {
      accessor: "fee",
      title: "Fee",
      width: 120,
      render: ({ fee }) => formatCurrency(fee),
    },
    {
      accessor: "remainingBalance",
      title: "Balance",
      width: 120,
      render: ({ remainingBalance }) => formatCurrency(remainingBalance),
    },
    {
      accessor: "paymentType",
      title: "Type",
      width: 100,
    },
    {
      accessor: "status",
      title: "Status",
      width: 100,
      render: ({ status }) => (
        <Badge color={getStatusColor(status)}>{status}</Badge>
      ),
    },
    {
      accessor: "paidAt",
      title: "Paid Date",
      width: 120,
      render: ({ paidAt }) => formatDate(paidAt),
    },
    {
      accessor: "externalReference",
      title: "External Ref",
      width: 150,
    },
    {
      accessor: "paymongoPaymentId",
      title: "PayMongo ID",
      width: 180,
    },
  ];

  return (
    <div>
      <Title order={3} mb="md">
        Payments
      </Title>

      <DataTable
        columns={columns}
        horizontalSpacing={"xl"}
        verticalSpacing={"sm"}
        records={payments}
        page={page + 1}
        onPageChange={(p) => setPage(p - 1)}
        recordsPerPage={size}
        totalRecords={totalElements}
        minHeight={400}
        fetching={loading}
        noRecordsText="No payments found"
        withTableBorder
        borderRadius="sm"
        striped
        highlightOnHover
        styles={{
          header: {
            backgroundColor: "#f8f9fa",
          },
        }}
      />
    </div>
  );
};

export default PaymentsAdmin;
