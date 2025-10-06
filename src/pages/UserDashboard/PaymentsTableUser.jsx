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
} from "@mantine/core";
import { queryClient } from "../../AxiosTanstack";
import { DataTable } from "mantine-datatable";
import "mantine-datatable/styles.layer.css";

const PaymentsTableUser = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10); // rows per page
  // eslint-disable-next-line no-unused-vars
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [pageIsLast, setPageIsLast] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null); // user state to hold the current user info
  const [userId, setUserId] = useState();

  useEffect(() => {
    // Get the current user from the query cache
    const currentUser = queryClient.getQueryData(["currentUser"]);
    if (currentUser) {
      setUser(currentUser);
      console.log(currentUser);
      setUserId(currentUser.userId);
      console.log("userId", userId);
    }
  }, []);

  useEffect(() => {
    // Only fetch payments if userId is available and has changed
    if (userId) {
      fetchPayments(page);
    }
  }, [page, userId]);

  const fetchPayments = async (pageNum) => {
    setLoading(true);
    try {
      // Note: API pages usually start from 0, but Mantine DataTable uses 1-based
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

  if (loading) {
    return (
      <Center style={{ height: "200px" }}>
        <Loader />
      </Center>
    );
  }

  if (payments.length === 0) {
    return (
      <Center>
        <Text>No payments found.</Text>
      </Center>
    );
  }

  return (
    <>
      <DataTable
        columns={[
          {
            accessor: "quotationReference",
            title: "Quotation #",
            textAlign: "left",
          },
          {
            accessor: "amountFormatted",
            title: "Amount Paid",
            textAlign: "right",
            render: ({ amountFormatted }) =>
              `₱ ${amountFormatted.toLocaleString()}`,
          },
          {
            accessor: "totalAmountDue",
            title: "Total Due",
            textAlign: "right",
            render: ({ totalAmountDue }) =>
              `₱ ${totalAmountDue.toLocaleString()}`,
          },
          {
            accessor: "remainingBalanceFormatted",
            title: "Remaining Balance",
            textAlign: "right",
            render: ({ remainingBalanceFormatted }) =>
              `₱ ${remainingBalanceFormatted.toLocaleString()}`,
          },
          { accessor: "paymentType", title: "Payment Type" },
          { accessor: "status", title: "Status" },
          { accessor: "paidAtFormatted", title: "Paid At" },
          { accessor: "createdAtFormatted", title: "Created At" },
          { accessor: "description", title: "Description" },
        ]}
        styles={{
          header: {
            color: "white", // change text color
            backgroundColor: "#D6A99D", // change header background
            fontWeight: 700,
          },
        }}
        minHeight={200}
        height={680}
        withTableBorder
        verticalSpacing="md"
        records={payments}
        // Pagination properties
        totalRecords={totalElements}
        recordsPerPage={size}
        page={page}
        onPageChange={setPage}
        paginationSize="md"
        paginationActiveBackgroundColor="grape"
        paginationText={({ from, to, totalRecords }) =>
          `Showing ${from} to ${to} of ${totalRecords} payments`
        }
        recordsPerPageLabel="Payments per page:"
        // Loading state
        fetching={loading}
        noRecordsText="No payments found"
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
      ></DataTable>
    </>
  );
};

export default PaymentsTableUser;
