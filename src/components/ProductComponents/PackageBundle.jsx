import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  ScrollArea,
  Textarea,
  Box,
  Flex,
  Divider,
  Switch,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import axios from "axios";
import { notifications } from "@mantine/notifications";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(amount);

const SelectedRecordsTable = ({ selectedRecords }) => {
  const totalPrice = selectedRecords.reduce((sum, rec) => sum + rec.price, 0);

  return (
    <Box mt="md" p="sm" withBorder>
      <Flex px="xs" py="xs" bg="gray.0" fw={500}>
        <Box w={30}>#</Box>
        <Box w={200}>Name</Box>
        <Box w={100}>Category</Box>
        <Box w={100}>Type</Box>
        <Box w={80} ml="auto" style={{ textAlign: "right" }}>
          Price
        </Box>
      </Flex>
      <Divider my="xs" />
      <ScrollArea h={150} scrollbarVisibility="always">
        {selectedRecords.map((rec, i) => (
          <Flex key={i} px="xs" py="xs" align="center">
            <Box w={30}>{i + 1}</Box>
            <Box
              w={200}
              style={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {rec.name}
            </Box>
            <Box w={100}>{rec.category}</Box>
            <Box w={100}>{rec.type}</Box>
            <Box w={80} ml="auto" style={{ textAlign: "right" }}>
              {formatPrice(rec.price)}
            </Box>
          </Flex>
        ))}
      </ScrollArea>
      <Divider my="xs" />
      <Flex px="xs" py="xs" fw={500}>
        <Box ml="auto" style={{ textAlign: "right" }}>
          Total: {formatPrice(totalPrice)}
        </Box>
      </Flex>
    </Box>
  );
};

const PackageBundle = () => {
  const batchSize = 50;
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollViewportRef = useRef(null);
  const [endReached, setEndReached] = useState(false);
  const [bundleName, setBundleName] = useState("");
  const [customizable, setCustomizable] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setFetching(true);
        const res = await axios.get(
          "http://localhost:8080/public/api/items/all-record",
          { withCredentials: true }
        );
        const data = res?.data || [];
        setItems(data);
        setRecords(data.slice(0, batchSize));
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchItems();
  }, []);

  let timeout;

  const loadMoreRecords = () => {
    if (records.length >= items.length) {
      setEndReached(true);
      return;
    }

    setLoading(true);
    timeout = setTimeout(() => {
      setRecords((prev) => [
        ...prev,
        ...items.slice(prev.length, prev.length + batchSize),
      ]);
      setLoading(false);
    }, 1000);
  };

  const reset = () => {
    setRecords(items.slice(0, batchSize));
    setSelectedRecords([]);
    setEndReached(false);
    scrollViewportRef.current?.scrollTo(0, 0);
    setSearchQuery("");
  };

  useEffect(() => {
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const handleSubmitBundle = async () => {
    try {
      const payload = {
        name: bundleName || "",
        description: description || "",
        customizable,
        items: selectedRecords.map((item) => ({ itemId: item.itemId })),
      };

      const response = await axios.post(
        "http://localhost:8080/api/package-bundle",
        payload,
        { withCredentials: true }
      );

      notifications.show({
        title: "Success",
        message: "Your package bundle has been saved!",
        color: "green",
        autoClose: 3000,
      });

      setSelectedRecords([]);
      setBundleName("");
      setDescription("");
      setCustomizable(false);
    } catch (err) {
      console.error(err);
      notifications.show({
        title: "Failed",
        message: "Your package bundle was not saved!",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="bg-white p-2 rounded">
      <div className="p-4 mx-auto">
        <Text size="lg">Create Package Bundle</Text>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* ✅ Filter input from Mantine */}
          <TextInput
            placeholder="Search by name..."
            mb="xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />

          <DataTable
            idAccessor="itemId"
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            borderRadius="sm"
            records={
              searchQuery
                ? items.filter((i) =>
                    i.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : records
            }
            fetching={loading}
            onScrollToBottom={loadMoreRecords}
            scrollViewportRef={scrollViewportRef}
            height={500}
            columns={[
              { accessor: "name" },
              //   { accessor: "description" },
              { accessor: "category" },
              { accessor: "type" },
              { accessor: "price" },
            ]}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            fontSize="xs"
            verticalSpacing="xs"
            horizontalSpacing="xs"
          />

          {endReached && (
            <Paper p="xs" mt="xs" withBorder>
              <Text size="xs" align="center" color="dimmed" italic>
                — End of records —
              </Text>
            </Paper>
          )}

          <Paper p="md" mt="sm" withBorder>
            <Group justify="space-between">
              <Text size="sm">
                Showing {records.length} of {items.length}
              </Text>
            </Group>
          </Paper>
        </div>

        <Paper p="md" shadow="xs" withBorder>
          <TextInput
            label="Package bundle name:"
            value={bundleName}
            onChange={(event) => setBundleName(event.currentTarget.value)}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
          <div className="py-2">
            <Switch
              label="Customizable"
              color="blue"
              checked={customizable}
              onChange={(e) => setCustomizable(e.currentTarget.checked)}
            />
          </div>

          <Text fw={500} mb="sm">
            Selected Records ({selectedRecords.length})
          </Text>

          {selectedRecords.length > 0 && (
            <SelectedRecordsTable selectedRecords={selectedRecords} />
          )}

          <Group mt="sm">
            <Button variant="light" onClick={reset}>
              Reset
            </Button>
            <Button onClick={handleSubmitBundle}>Submit</Button>
          </Group>
        </Paper>
      </div>
    </div>
  );
};

export default PackageBundle;

// import React, { useState, useRef, useEffect } from "react";

// import {
//   Button,
//   Group,
//   Paper,
//   Text,
//   TextInput,
//   ScrollArea,
//   Textarea,
//   Box,
//   Flex,
//   Divider,
//   Switch,
// } from "@mantine/core";
// import { DataTable } from "mantine-datatable";
// import axios from "axios";
// import { notifications } from "@mantine/notifications";

// const formatPrice = (amount) =>
//   new Intl.NumberFormat("en-PH", {
//     style: "currency",
//     currency: "PHP",
//     minimumFractionDigits: 0,
//   }).format(amount);

// const SelectedRecordsTable = ({ selectedRecords }) => {
//   // Calculate total price
//   const totalPrice = selectedRecords.reduce((sum, rec) => sum + rec.price, 0);

//   return (
//     <Box mt="md" p="sm" withBorder>
//       {/* Header Row */}
//       <Flex px="xs" py="xs" bg="gray.0" fw={500}>
//         <Box w={30}>#</Box>
//         <Box w={200}>Name</Box>
//         <Box w={100}>Category</Box>
//         <Box w={100}>Type</Box>
//         <Box w={80} ml="auto" style={{ textAlign: "right" }}>
//           Price
//         </Box>
//       </Flex>
//       <Divider my="xs" />

//       {/* Scrollable Data Rows */}
//       <ScrollArea h={150}>
//         {selectedRecords.map((rec, i) => (
//           <Flex key={i} px="xs" py="xs" align="center">
//             <Box w={30}>{i + 1}</Box>
//             <Box
//               w={200}
//               style={{ overflow: "hidden", textOverflow: "ellipsis" }}
//             >
//               {rec.name}
//             </Box>
//             <Box w={100}>{rec.category}</Box>
//             <Box w={100}>{rec.type}</Box>
//             <Box w={80} ml="auto" style={{ textAlign: "right" }}>
//               {formatPrice(rec.price)}
//             </Box>
//           </Flex>
//         ))}
//       </ScrollArea>

//       <Divider my="xs" />

//       {/* Total Row */}
//       <Flex px="xs" py="xs" fw={500}>
//         <Box>#</Box>
//         <Box>Name</Box>
//         <Box>Category</Box>
//         <Box>Type</Box>
//         <Box ml="auto" style={{ textAlign: "right" }}>
//           Total: {formatPrice(totalPrice)}
//         </Box>
//       </Flex>
//     </Box>
//   );
// };

// const PackageBundle = () => {
//   const batchSize = 50;
//   const [loading, setLoading] = useState(false);
//   const [items, setItems] = useState([]);
//   const [fetching, setFetching] = useState(false);
//   const [selectedRecords, setSelectedRecords] = useState([]);
//   const [records, setRecords] = useState([]);
//   const scrollViewportRef = useRef(null);
//   const [endReached, setEndReached] = useState(false);
//   const [bundleName, setBundleName] = useState("");
//   const [customizable, setCustomizable] = useState(false);
//   const [description, setDescription] = useState("");

//   const handleSubmitBundle = () => {
//     const handleSubmit = async () => {
//       try {
//         const payload = {
//           name: bundleName || "",
//           description: description || "",
//           customizable,
//           items: selectedRecords.map((item) => ({ itemId: item.itemId })),
//         };
//         const response = await axios.post(
//           "http://localhost:8080/api/package-bundle",
//           payload,
//           {
//             withCredentials: true,
//           }
//         );
//         notifications.show({
//           title: "Success",
//           message: "Your package bundle has been saved!",
//           color: "green", // optional: success (green), red, blue, yellow, etc.
//           autoClose: 3000, // optional: auto close in milliseconds
//         });
//         setSelectedRecords([]);
//         setBundleName("");
//         setDescription("");
//         setCustomizable(false);

//         console.log(response?.data);
//       } catch (err) {
//         console.error(err);

//         notifications.show({
//           title: "Failed",
//           message: "Your package bundle not saved!",
//           color: "red", // optional: success (green), red, blue, yellow, etc.
//           autoClose: 3000, // optional: auto close in milliseconds
//         });
//       }
//     };
//     handleSubmit();
//   };
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setFetching(true);
//         const res = await axios.get(
//           "http://localhost:8080/public/api/items/all-record",
//           { withCredentials: true }
//         );
//         if (res) {
//           console.log(res);
//           const data = res?.data;
//           setItems(res.data);
//           setRecords(data.slice(0, batchSize));
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setFetching(false);
//       }
//     };

//     fetchItems();
//   }, []);

//   let timeout;

//   const loadMoreRecords = () => {
//     if (records.length >= items.length) {
//       setEndReached(true);
//       return;
//     }

//     setLoading(true);
//     timeout = setTimeout(() => {
//       setRecords((prev) => [
//         ...prev,
//         ...items.slice(prev.length, prev.length + batchSize),
//       ]);
//       setLoading(false);
//     }, 1000);
//   };

//   const reset = () => {
//     setRecords(items.slice(0, batchSize));
//     setSelectedRecords([]); // reset selections to avoid mismatch
//     setEndReached(false);
//     scrollViewportRef.current?.scrollTo(0, 0);
//   };

//   useEffect(() => {
//     return () => {
//       if (timeout) clearTimeout(timeout);
//     };
//   }, []);

//   return (
//     <div className=" bg-white p-2 rounded">
//       <div className="p-4 mx-auto">
//         <Text size="lg">Create Package Bundle</Text>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div div style={{ maxWidth: 800, margin: "0 auto" }}>
//           <DataTable
//             idAccessor="itemId"
//             striped
//             highlightOnHover
//             withTableBorder
//             withColumnBorders
//             borderRadius="sm"
//             records={records}
//             fetching={loading}
//             onScrollToBottom={loadMoreRecords}
//             scrollViewportRef={scrollViewportRef}
//             height={500}
//             columns={[
//               { accessor: "name" },
//               { accessor: "description" },
//               { accessor: "category" },
//               { accessor: "type" },
//               { accessor: "price" },
//             ]}
//             selectedRecords={selectedRecords}
//             onSelectedRecordsChange={setSelectedRecords}
//             fontSize="xs"
//             verticalSpacing="xs"
//             horizontalSpacing="xs"
//           />
//           {endReached && (
//             <Paper p="xs" mt="xs" withBorder>
//               <Text size="xs" align="center" color="dimmed" italic>
//                 — End of records —
//               </Text>
//             </Paper>
//           )}
//           <Paper p="md" mt="sm" withBorder>
//             <Group justify="space-between">
//               <Text size="sm">
//                 Showing {records.length} records of {items.length}
//                 {records.length < items.length &&
//                   ", scroll to bottom to load more"}
//               </Text>
//             </Group>
//           </Paper>
//         </div>

//         <Paper p="md" shadow="xs" withBorder>
//           <TextInput
//             label="Package bundle name:"
//             value={bundleName || ""}
//             onChange={(event) => setBundleName(event.currentTarget.value)}
//           ></TextInput>
//           <Textarea
//             label="description"
//             value={description}
//             onChange={(event) => setDescription(event.currentTarget.value)}
//           ></Textarea>
//           <div className="py-2">
//             <Switch
//               label="Customizable"
//               color="blue"
//               checked={customizable}
//               onChange={(e) => setCustomizable(e.currentTarget.checked)}
//             />
//           </div>

//           <Text fw={500} mb="sm">
//             Selected Records ({selectedRecords.length})
//           </Text>
//           {selectedRecords.length > 0 && (
//             <SelectedRecordsTable
//               selectedRecords={selectedRecords}
//             ></SelectedRecordsTable>
//           )}
//           <Button variant="light" onClick={reset}>
//             Reset records
//           </Button>

//           <Button onClick={handleSubmitBundle}>Submit</Button>
//         </Paper>
//       </div>
//     </div>
//   );
// };

// export default PackageBundle;
