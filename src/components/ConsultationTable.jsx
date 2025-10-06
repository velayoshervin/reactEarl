import React, { useEffect, useState } from "react";
import { DataTable } from "mantine-datatable";
import axios from "axios";
import dayjs from "dayjs";
import { Group, Button, Text } from "@mantine/core";
import {
  IconX,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";

const ConsultationTable = () => {
  const [consultations, setConsultations] = useState([]);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/protected/consultation/all",
          { params: { page, size: 20 }, withCredentials: true }
        );
        console.log("consultation res", res.data);
        setConsultations(res.data.content || []);
        setPageData(res.data);
      } catch (err) {
        console.error("Failed to fetch consultations", err.response || err);
      }
    };

    fetchPage();
  }, [page]);

  const handleAccept = async (row) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/protected/consultation/approve`,
        null,
        {
          params: { consultationId: row.consultationId },
          withCredentials: true,
        }
      );
      setConsultations((prev) =>
        prev.map((c) =>
          c.consultationId === row.consultationId
            ? { ...c, status: res.data.status }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (row) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/protected/consultation/reject`,
        null,
        {
          params: { consultationId: row.consultationId },
          withCredentials: true,
        }
      );
      setConsultations((prev) =>
        prev.map((c) =>
          c.consultationId === row.consultationId
            ? { ...c, status: res.data.status }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <DataTable
        columns={[
          { accessor: "fullName", title: "requested by" },
          { accessor: "email", title: "email" },
          {
            accessor: "contact",
            title: "contact",
            render: (row) => <span>+09{row.contact}</span>,
          },
          {
            accessor: "eventDate",
            title: "day of event",
            render: (row) => dayjs(row.eventDate).format("MMM DD, YYYY"),
          },
          { accessor: "eventType", title: "event" },
          {
            accessor: "created",
            title: "requested at",
            render: (row) => dayjs(row.created).format("MMM DD, YYYY HH:mm"),
          },
          {
            accessor: "updated",
            title: "updated at",
            render: (row) => dayjs(row.updated).format("MMM DD, YYYY HH:mm"),
          },

          {
            accessor: "action",
            title: "status",

            render: (row) => {
              if (row.status === "SUBMITTED") {
                return (
                  <Group>
                    <Button variant="default" onClick={() => handleReject(row)}>
                      {" "}
                      <IconX color="red"></IconX>
                    </Button>
                    <Button
                      onClick={() => handleAccept(row)}
                      style={{ backgroundColor: "teal", color: "white" }}
                      leftSection={<IconCheck />}
                    >
                      Accept
                    </Button>
                  </Group>
                );
              } else if (row.status === "APPROVED") {
                return (
                  <Button
                    subtle
                    leftSection={<IconCircleCheck></IconCircleCheck>}
                  >
                    Approved{" "}
                  </Button>
                );
              } else if (row.status === "REJECTED") {
                return (
                  <Button
                    subtle
                    leftSection={<IconCircleX></IconCircleX>}
                    style={{ backgroundColor: "#f87171" }}
                  >
                    Rejected{" "}
                  </Button>
                );
              }
            },
          },
        ]}
        records={consultations}
        totalRecords={pageData?.totalElements || 0}
        recordsPerPage={pageData?.size || 20}
        page={page + 1}
        onPageChange={(p) => setPage(p - 1)}
      />
    </div>
  );
};

export default ConsultationTable;
