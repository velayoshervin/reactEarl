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
} from "@mantine/core";
import axios from "axios";
import { queryClient } from "../../AxiosTanstack";
import CalendarBlocked from "../../components/CalendarBlocked";
import { DataTable } from "mantine-datatable";
import dayjs from "dayjs";
import "mantine-datatable/styles.layer.css";
import { useDisclosure } from "@mantine/hooks";
import { IconFileDescription, IconInfoCircle } from "@tabler/icons-react";
import PCardContainer from "../../components/ProductComponents/PCardContainer";
const QuotationsTable = () => {
  const [quotations, setQuotations] = useState([]);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  //   const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState();
  const [userId, setUserId] = useState();
  const [selectValue, setSelectValue] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [totalPayment, setTotalPayment] = useState();
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editQuotation, setEditQuotation] = useState(false);

  useEffect(() => {
    console.log("totalPayment updated:", totalPayment);
    console.log("selectedQuotation status:", selectedQuotation?.status);
  }, [totalPayment, selectedQuotation]);

  const [paginatedResponse, setPaginatedResponse] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 5,
    last: false,
  });

  const getPaymentOptions = (quotation, totalPayment) => {
    if (!quotation) return [];

    const baseOptions = [
      {
        value: "reservation",
        label: (quotation.total * 0.1).toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
        }),
        tag: "10% reservation fee",
      },
      {
        value: "book",
        label: (quotation.total * 0.2).toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
        }),
        tag: "20% booking fee",
      },
      {
        value: "pay Full",
        label: quotation.total.toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
        }),
        tag: "Pay in full",
      },
    ];

    if (quotation.status === "RESERVED") {
      return [
        {
          value: "book",
          label: (quotation.total * 0.2).toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
          }),
          tag: "Pay additional 20% to confirm booking (20% of total due)",
        },
        {
          value: "pay Remaining",
          label: (quotation.total * 0.9).toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
          }),
          tag: "Pay remaining 90% balance (full payment)",
        },
      ];
    }

    if (quotation.status === "BOOKED") {
      if (totalPayment == null) {
        return [
          {
            value: "pay Remaining",
            label: "Loading...",
            tag: "Fetching payment info...",
          },
        ];
      }
      if (totalPayment > 0)
        return [
          {
            value: "pay Remaining",
            label: (quotation.total - totalPayment / 100).toLocaleString(
              "en-PH",
              {
                style: "currency",
                currency: "PHP",
              }
            ),
            tag: "Pay remaining balance",
          },
        ];
    }

    if (quotation.status === "PAID") {
      return []; // fully paid, no more options
    }

    return baseOptions; // fallback for DRAFT, SUBMITTED, APPROVED, etc.
  };

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
      console.log(res.data, "paginated Response");
      setQuotations(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTotalPaymentsForSelectedQuotation = async () => {
    try {
      setIsLoadingPayments(true);

      const res = await axios.get(
        `http://localhost:8080/quotations/totalPayments`,
        {
          params: { quotationId: selectedQuotation?.quotationId },
          withCredentials: true,
        }
      );
      setTotalPayment(res?.data);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPayments(false);
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

  // 🟢 Payment modal trigger
  const openPaymentModal = async (quotation) => {
    setSelectedQuotation(quotation);

    if (quotation.requestedEventDate) {
      setEventDate(dayjs(quotation.requestedEventDate).toDate());
    } else {
      setEventDate(null);
    }

    setSelectValue(null);
    if (quotation.status === "BOOKED") {
      await fetchTotalPaymentsForSelectedQuotation();
    }
    setPaymentModalOpen(true);
  };

  const handlePartialPayment = async (quotationId, amount, paymentType) => {
    console.log("eventdate", typeof eventDate);
    console.log(eventDate);
    console.log(paymentType);
    console.log(selectValue);

    let iso = eventDate.toISOString();
    alert(iso);

    const payload = {
      quotationId,
      amount,
      eventDate: eventDate ? eventDate.toISOString() : null,
    };

    console.log("partial-payment payload", payload);

    try {
      const res = await axios.post(
        "http://localhost:8080/public/checkout/partial-payment",
        payload,
        {
          params: { paymentType },
          withCredentials: true,
        }
      );

      const { checkout_url } = res.data;
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        alert("Failed to get checkout URL.");
      }
    } catch (err) {
      console.log("err in handle partial pay", err.response);
    }
  };

  const handlePay = async (quotationId, eventDate, amount) => {
    try {
      const eventTime = dayjs(eventDate).format("YYYY-MM-DD");

      const res = await axios.post(
        `http://localhost:8080/public/checkout/${quotationId}`,
        {},
        {
          params: {
            eventDate: eventTime,
            amount,
          },
          withCredentials: true,
        }
      );

      console.log("handlePay", amount);

      const { checkout_url } = res.data;
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        alert("Failed to get checkout URL.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating PayMongo checkout session.");
    }
  };

  const renderSelectOption = ({ option }) => {
    const colorMap = {
      reservation: "green",
      book: "red",
      paid: "yellow",
    };

    return (
      <div className="flex flex-col w-full gap-2 hover:text-blue-600 ">
        <div className="flex items-center justify-end">
          <Badge color={colorMap[option.value]} className="hover:underline">
            {option.value}
          </Badge>
        </div>

        {isLoadingPayments ? (
          <Loader size={30}></Loader>
        ) : (
          <Box pos="relative">
            <p className="hover:underline">{option.label}</p>
            <Text size="xs">{option.tag}</Text>
          </Box>
        )}
      </div>
    );
  };

  return (
    <>
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
            title: "Booking Id",
            textAlign: "center",
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
            accessor: "pax",
            title: "Guest count",
            textAlign: "center",
          },
          {
            accessor: "eventType",
            title: "Event",
            textAlign: "center",
          },
          {
            accessor: "venue",
            title: "Venue",
            textAlign: "center",
            render: (row) => (row.venue ? row.venue.name : "—"),
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
              dayjs(creationTime).format("MMM D YYYY, h:mm A"),
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
              if (row.status === "PAID") {
                return (
                  <Button color="687FE5" disabled>
                    PAID / BOOKED
                  </Button>
                );
              }

              return (
                <Button color="#687FE5" onClick={() => openPaymentModal(row)}>
                  Reserve / Book
                </Button>
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

      {/* 🟢 Payment Modal */}
      <Modal
        opened={paymentModalOpen}
        key={refreshKey}
        onClose={() => setPaymentModalOpen(false)}
        title={
          <>
            <div
              className="flex items-center gap-4"
              key={`modal-content-${totalPayment}`}
            >
              <Text>{`Quotation ${selectedQuotation?.quotationId}`}</Text>{" "}
              {selectedQuotation?.status === "RESERVED" && (
                <Group>
                  <Badge color="green">RESERVED</Badge>{" "}
                  <Text size="xs">
                    {" "}
                    You have already paid the reservation fee.
                  </Text>
                </Group>
              )}
              {selectedQuotation?.status === "BOOKED" && (
                <Group>
                  <Badge color="ORANGE">BOOKED</Badge>{" "}
                  <Text size="xs"> You have already paid the booking fee.</Text>
                </Group>
              )}
            </div>
          </>
        }
        size="lg"
      >
        {selectedQuotation && (
          <Flex direction="column" gap="md">
            {/* Line Items Table */}
            <Table striped highlightOnHover verticalSpacing="md">
              <Table.Thead className="bg-[#6D94C5]">
                <Table.Tr>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Subtotal</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {selectedQuotation.lineItems?.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.description}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>
                      {Number(item.priceAtQuotation).toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </Table.Td>
                    <Table.Td>
                      {(
                        Number(item.priceAtQuotation) * item.quantity
                      ).toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              <Table.Tfoot>
                <Table.Tr>
                  <Table.Th colSpan={3} style={{ textAlign: "right" }}>
                    Total
                  </Table.Th>
                  <Table.Th>
                    {selectedQuotation.lineItems
                      ?.reduce(
                        (sum, item) =>
                          sum + Number(item.priceAtQuotation) * item.quantity,
                        0
                      )
                      .toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                  </Table.Th>
                </Table.Tr>
              </Table.Tfoot>
            </Table>

            {/* Event Date Picker */}
            <Flex align="center" gap="xs">
              <Text size="sm">Event Date:</Text>
              <CalendarBlocked
                eventDate={eventDate}
                setEventDate={setEventDate}
                disabled={!!selectedQuotation?.requestedEventDate}
              />
              <Text size="sm">Payment Option/s</Text>

              {/* Payment Options */}
              {selectedQuotation?.status === "BOOKED" && isLoadingPayments ? (
                <>
                  <Loader size="sm" color="blue" />
                  <Text size="sm" ml="xs">
                    Loading payment info...
                  </Text>
                </>
              ) : (
                <Select
                  clearable
                  data={getPaymentOptions(selectedQuotation, totalPayment)}
                  // data={getPaymentOptions(selectedQuotation)}
                  disabled={isLoadingPayments}
                  value={selectValue}
                  onChange={setSelectValue}
                  renderOption={renderSelectOption}
                  key={`select-${refreshKey}`}
                />
              )}
            </Flex>

            {/* Confirm Payment Button */}
            <div className="flex justify-center text-center ">
              <IconInfoCircle size={18} className="ml-6"></IconInfoCircle>
              <Text size="sm" c="dimmed">
                You will be redirected to our secure payment partner{" "}
                <span className="text-green-700 font-semibold">
                  (PAYMONGO){" "}
                </span>
                to complete your payment.
              </Text>
            </div>

            <Button
              className="w-[80%]"
              color="green"
              disabled={!selectValue || !eventDate}
              onClick={() => {
                if (selectValue === "pay Full") {
                  let amount = selectedQuotation?.total;

                  handlePay(selectedQuotation.quotationId, eventDate, amount);
                } else if (selectValue === "pay Remaining") {
                  if (totalPayment) {
                    let alreadyPaidPesos = totalPayment / 100; // convert from centavos → pesos
                    let amount = selectedQuotation.total - alreadyPaidPesos;
                    alert(amount, " and ", alreadyPaidPesos);

                    handlePay(selectedQuotation.quotationId, eventDate, amount);
                  }
                } else if (selectValue === "reservation") {
                  const amount = selectedQuotation.total * 0.1;
                  handlePartialPayment(
                    selectedQuotation.quotationId,
                    amount,
                    "reservation"
                  );
                } else if (selectValue === "book") {
                  const amount = selectedQuotation.total * 0.2;
                  handlePartialPayment(
                    selectedQuotation.quotationId,
                    amount,
                    "book"
                  );
                }
              }}
            >
              Confirm Payment
            </Button>
          </Flex>
        )}
      </Modal>
    </>
  );
};

export default QuotationsTable;
