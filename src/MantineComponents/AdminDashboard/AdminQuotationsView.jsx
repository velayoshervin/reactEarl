import React, { useEffect, useState } from "react";
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
  LoadingOverlay,
  Loader,
  Card,
  Divider,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconX, IconEdit, IconMessage } from "@tabler/icons-react";

import { DataTable } from "mantine-datatable";
import dayjs from "dayjs";
import "mantine-datatable/styles.layer.css";
import { useDisclosure } from "@mantine/hooks";
import { IconFileDescription, IconInfoCircle } from "@tabler/icons-react";

import api from "../../api";
import { queryClient } from "../../AxiosTanstack";
import UserHoverCard from "../../components/UserHoverCard";
import PCardContainer from "../../components/ProductComponents/PCardContainer";

const AdminQuotationsView = () => {
  const [quotations, setQuotations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [userId, setUserId] = useState();
  const [opened, { open, close }] = useDisclosure(false);
  const [editQuotation, setEditQuotation] = useState(false);

  const [paginatedResponse, setPaginatedResponse] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 5,
    last: false,
  });

  const fetchQuotationById = async (pageNumber) => {
    try {
      const res = await api.get(`http://localhost:8080/quotations/all`, {
        params: { pageNumber, size: pageSize },
        withCredentials: true,
      });
      setPaginatedResponse(res.data);
      console.log(res.data, "paginated Response");
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
    if (userId) {
      fetchQuotationById(page - 1);
    }
  }, [page, userId]);

  const ActionBadge = ({ color, icon, label }) => (
    <Tooltip label={label}>
      <Badge color={color} className="cursor-pointer hover:opacity-50">
        {icon}
      </Badge>
    </Tooltip>
  );

  const LineItemModal = ({ onEdit }) => (
    <Modal opened={opened} onClose={close} size="lg" withCloseButton={false}>
      <div className="py-2">
        <Group justify="space-between">
          <Text
            size="lg"
            fw={600}
            c="blue"
            style={{ textTransform: "uppercase" }}
          >
            Quotation #{selectedQuotation?.quotationId}
          </Text>

          <Text size="sm" c="dimmed">
            Submitted by:
          </Text>
          <div className="flex gap-1">
            <Text size="sm" c="dimmed">
              {selectedQuotation?.userDto?.firstname}
            </Text>
            <Text size="sm" c="dimmed">
              {selectedQuotation?.userDto?.lastname}
            </Text>
          </div>

          <Text size="sm" c="dimmed">
            <span>Event Date: </span>
            {dayjs(selectedQuotation?.requestedEventDate).format(
              "MMMM D, YYYY"
            )}
          </Text>
        </Group>
      </div>

      <Stack spacing="xs" mt="xs">
        {selectedQuotation?.lineItems?.map((lineItem) => {
          const firstPhoto = lineItem.item?.photos?.[0]?.url;

          return (
            <Card key={lineItem.id} shadow="xs" withBorder>
              <Group position="apart" align="flex-start">
                {/* Thumbnail */}
                {firstPhoto ? (
                  <img
                    src={firstPhoto}
                    alt={lineItem.description}
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 60,
                      borderRadius: "8px",
                      background: "#f1f3f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      color: "#999",
                    }}
                  >
                    No Image
                  </div>
                )}

                {/* Item Details */}
                <Stack spacing={1} style={{ flex: 1 }}>
                  <Text fw={500}>{lineItem.description}</Text>
                  <Text size="sm" c="dimmed">
                    {lineItem.quantity} ×{" "}
                    {Number(lineItem.priceAtQuotation).toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </Text>
                </Stack>

                {/* Subtotal */}
                <Text fw={600} size="sm" c="blue">
                  {(
                    Number(lineItem.priceAtQuotation) * lineItem.quantity
                  ).toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </Text>
              </Group>
            </Card>
          );
        })}
      </Stack>

      <Divider my="md" />

      {/* Total */}
      <Group position="apart">
        <Text fw={600}>Total</Text>
        <Text fw={700} size="lg" c="blue">
          {selectedQuotation?.lineItems
            ?.reduce(
              (sum, item) =>
                sum + Number(item.priceAtQuotation) * item.quantity,
              0
            )
            .toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
            })}
        </Text>
      </Group>

      {/* Footer Actions */}
      <div className="flex justify-end py-2 mt-4 gap-4">
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={close} color="red">
          Close
        </Button>
      </div>
    </Modal>
  );

  return (
    <div>
      <DataTable
        height={600}
        withTableBorder
        className="w-full rounded"
        verticalSpacing="lg"
        styles={{
          header: {
            color: "white", // change text color
            backgroundColor: "#898AC4", // change header background
            fontWeight: 700,
          },
        }}
        columns={[
          {
            accessor: "quotationId",
            title: "Quotation Id",
            textAlign: "center",
          },
          {
            accessor: "",
            title: "Submitted by",
            textAlign: "center",
            render: (row) => <UserHoverCard user={row.userDto} />,
          },
          {
            accessor: "requestedEventDate",
            title: "Event Date",
            textAlign: "center",
            render: ({ requestedEventDate }) =>
              requestedEventDate
                ? dayjs(requestedEventDate).format("dddd, MMM D YYYY")
                : "—",
          },
          {
            accessor: "status",
            title: "Status",
            textAlign: "center",
            render: (row) => {
              let color = "";

              switch (row.status) {
                case "RESERVED":
                  color = "green";
                  break;
                case "BOOKED":
                  color = "red";
                  break;
                case "PAID":
                  color = "yellow";
                  break;
                default:
                  color = "gray"; // fallback
              }

              return <Badge color={color}>{row.status}</Badge>;
            },
          },
          {
            accessor: "creationTime",
            title: "Created At",
            textAlign: "center",

            render: ({ creationTime }) =>
              dayjs(creationTime).format("dddd,MMM D YYYY, h:mm A"),
          },
          {
            accessor: "LineItems",
            textAlign: "center",
            render: (row) => {
              return (
                <Button
                  color="#748DAE"
                  onClick={() => {
                    setSelectedQuotation(row); // set the clicked row
                    open(); // open modal
                  }}
                >
                  <IconFileDescription size={16} className="mr-2" />
                  Summary
                </Button>
              );
            },
          },
          {
            accessor: "actions",
            title: "Actions",
            render: (row) => {
              return (
                <div className="grid grid-cols-2 gap-2">
                  <ActionBadge
                    color="green"
                    icon={<IconCheck size={12} />}
                    label="Approve"
                  />
                  <ActionBadge
                    color="red"
                    icon={<IconX size={12} />}
                    label="Reject"
                  />
                  <ActionBadge
                    color="teal"
                    icon={<IconMessage size={12} />}
                    label="Message"
                  />
                  <ActionBadge
                    color="yellow"
                    icon={<IconEdit size={12} />}
                    label="Edit"
                  />
                </div>
              );
            },
          },
        ]}
        records={quotations}
        totalRecords={paginatedResponse.totalElements ?? 0}
        page={page}
        onPageChange={(p) => {
          alert("Page changed to:", p);
          console.log("Page changed to:", p);
          setPage(p);
        }}
        recordsPerPage={pageSize}
      />
      {selectedQuotation && (
        <LineItemModal
          quotation={selectedQuotation}
          opened={opened}
          onClose={close}
          onEdit={() => {
            setEditQuotation(true);
            close();
          }}
        />
      )}
      <Modal
        opened={editQuotation}
        size={"full"}
        onClose={() => setEditQuotation(false)}
      >
        <PCardContainer quotation={selectedQuotation}></PCardContainer>
      </Modal>
    </div>
  );
};

export default AdminQuotationsView;
