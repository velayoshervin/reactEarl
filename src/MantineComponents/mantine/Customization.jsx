import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import {
  Accordion,
  Checkbox,
  Group,
  Text,
  Stack,
  ScrollArea,
  NumberInput,
  HoverCard,
  Select,
  Avatar,
  TextInput,
  MultiSelect,
  AspectRatio,
  Card,
  Image,
  ActionIcon,
  Textarea,
  Stepper,
  Pagination,
  Skeleton,
  NumberFormatter,
} from "@mantine/core";
import { Modal } from "@mantine/core";
import dayjs from "dayjs";
import {
  IconAlertCircle,
  IconCalendarEvent,
  IconPhoto,
  IconVideo,
  IconX,
} from "@tabler/icons-react";

import { Navigate } from "react-router-dom";

import { LoadingOverlay, Button, Box, Loader, Title } from "@mantine/core";
import FoodCard from "./FoodCard";
import { Tabs } from "@mantine/core";
import AvailableCalendar from "../../components/AvailableCalendar";
import { modals } from "@mantine/modals";
import ReactPlayer from "react-player";
import { Carousel } from "@mantine/carousel";
import { notifications } from "@mantine/notifications";

import { queryClient } from "../../AxiosTanstack";
// const user = queryClient.getQueryData(["currentUser"]);
// console.log("Customization=", user);

const formatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const isQuantifiable = (item) => {
  const nonQuantifiable = [
    "Performer",
    "Host",
    "Styling",
    "Hair & Makeup",
    "Coordination",
  ];
  return !nonQuantifiable.includes(item.category);
};

const Customization = ({ quotation }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setSelectedPackages] = useState();
  const [user, setUser] = useState();

  console.log("Quotation passed from edit", quotation);

  useEffect(() => {
    const userData = queryClient.getQueryData(["currentUser"]);
    setUser(userData);
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8080/public/api/packages"
        );
        console.log(res.data);
        if (res) setPackages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (quotation) {
      const pkg = packages.find((p) => p.packageId === quotation.packageId);
      setSelectedPackages(pkg);
      setOpenModal(true);
    }
  }, [quotation, packages]);

  return (
    <>
      {!quotation && (
        <div>
          {" "}
          {packages.map((p, index) => (
            <Button
              key={index}
              onClick={() => {
                setSelectedPackages(p);
                setOpenModal(true);
              }}
            >
              {p.packageName}
            </Button>
          ))}
        </div>
      )}

      <PackageAccordion
        packageData={selectedPackage}
        quotation={quotation}
        opened={openModal}
        close={() => setOpenModal(false)}
        user={user}
      />
    </>
  );
};

const AddOnsForm = ({ selectedAddOns, setSelectedAddOns }) => {
  const [loadingAddOns, setLoadingAddOns] = useState();
  const [page, setPage] = useState(1);
  const [addOns, setAddOns] = useState([]);
  const [filter, setFilter] = useState("All");
  const [totalPages, setTotalPages] = useState();

  console.log("selected add-ons size:", selectedAddOns.length);
  console.log("selected Add-on:", selectedAddOns);

  const toggleAddOn = (item) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((i) => i.itemId === item.itemId);
      if (exists) return prev.filter((i) => i.itemId !== item.itemId); // remove
      return [
        ...prev,
        {
          ...item,
          quantity: isQuantifiable(item) ? 1 : undefined, // default 1 for quantifiable
        },
      ];
    });
  };

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        setLoadingAddOns(true);

        const type = "add-on";

        let encodedFilter = encodeURIComponent(filter.trim());

        let url =
          filter === "All"
            ? "http://localhost:8080/public/api/items/addOns"
            : `http://localhost:8080/public/api/items/${type}/${encodedFilter}`;

        const res = await axios.get(url, {
          withCredentials: true,
          params: {
            page: page - 1,
            size: 8,
          },
        });

        if (res) {
          console.log(res.data);
          const data = res.data;
          console.log("Response data:", res.data);
          console.log(data.content);
          setAddOns(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAddOns(false);
      }
    };

    fetchAddOns();
  }, [page, filter]);

  const filters = [
    "All",
    "Coordination",
    "Decoration",
    "Furniture",
    "Ceiling",
    "Hair & Makeup",
    "Food Enhancement",
    "Sound System",
    "Cakes",
    "Equipment",
    "Flowers",
    "Transport",
    "Lighting",
    "Styling",
    "Host",
    "Performer",
  ];

  const openGallery = (item) =>
    modals.open({
      withCloseButton: false,
      size: "80%",
      overlayBlur: 0,
      overlayColor: "rgba(0,0,0,1)",
      backdropFilter: "blur(20px)",
      styles: {
        modal: {
          padding: 0, // remove outer modal padding
          height: "auto",
        },
        body: {
          padding: 0, // remove inner body padding
          overflow: "visible", // remove scroll
          height: "100%",
        },
      },

      children: (
        <div className="flex flex-wrap gap-4 justify-center">
          <Carousel withIndicators height="100%" flex={1}>
            {item.photos?.length ? (
              item.photos.map((p, index) => (
                <Carousel.Slide key={index}>
                  <AspectRatio ratio={16 / 9} mah={1200}>
                    <Image key={p.photoId} src={p.url} alt={item.name} />
                  </AspectRatio>
                </Carousel.Slide>
              ))
            ) : (
              <p className="mx-auto">No photos available</p>
            )}
          </Carousel>
        </div>
      ),
    });

  const openVideos = (item) =>
    modals.open({
      withCloseButton: false,
      size: "80%",
      overlayBlur: 0,
      overlayColor: "rgba(0,0,0,1)",
      backdropFilter: "blur(20px)",
      styles: {
        modal: {
          padding: 0, // remove outer modal padding
          height: "auto",
        },
        body: {
          padding: 0, // remove inner body padding
          overflow: "visible", // remove scroll
          height: "100%",
        },
      },
      children: (
        <div className="flex flex-col gap-4 justify-center">
          <Carousel withIndicators height="100%" flex={1}>
            {item.videos?.length ? (
              item.videos.map((v, index) => (
                <Carousel.Slide key={index}>
                  <video width="100%" height="100%" controls>
                    <source src={v.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Carousel.Slide>
              ))
            ) : (
              <p className="mx-auto">No videos available</p>
            )}
          </Carousel>
        </div>
      ),
    });

  return (
    <>
      {loadingAddOns ? (
        <Skeleton className="h-32 w-full" count={4} />
      ) : (
        <div className="py-4">
          <div className="filters flex !gap-2 flex-wrap py-2">
            {filters.map((filter, index) => (
              <button
                className=" border border-gray-300 rounded-3xl px-4 min-w-[80px] text-[12px]"
                key={index}
                onClick={() => {
                  setFilter(filter);
                  setPage(1);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 pb-4">
            {addOns?.map((a) => (
              <Card
                key={a?.itemId}
                shadow="sm"
                className="border border-gray-300 rounded"
              >
                <div className=" gap-2 relative">
                  <AspectRatio
                    ratio={16 / 9}
                    maw={200}
                    className="rounded-xl overflow-clip relative"
                  >
                    <Image
                      alt={JSON.stringify(a)}
                      src={
                        a.photos?.[0]?.url ||
                        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
                      }
                      fit="cover"
                    ></Image>

                    <div className="flex gap-1 absolute left-1/2 top-18 z-10">
                      <ActionIcon
                        onClick={() => {
                          openGallery(a);
                        }}
                        color="yellow"
                        className="border border-white"
                      >
                        <IconPhoto></IconPhoto>
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        className="border border-white"
                        onClick={() => {
                          openVideos(a);
                        }}
                      >
                        <IconVideo></IconVideo>
                      </ActionIcon>
                    </div>
                  </AspectRatio>
                  <div>
                    <div className="flex flex-col justify-center">
                      <Text>{a.name}</Text>
                    </div>
                    <Text>{formatter.format(a.price)}</Text>

                    <Button
                      size="xs"
                      color={
                        selectedAddOns.find((i) => i.itemId === a.itemId)
                          ? "red"
                          : "green"
                      }
                      className="!w-full"
                      onClick={() => toggleAddOn(a)}
                    >
                      {selectedAddOns.find((i) => i.itemId === a.itemId)
                        ? "Remove"
                        : "Add"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </div>
      )}
    </>
  );
};

const FoodItem = ({ data }) => {
  return (
    <div className="flex">
      <Avatar src={data.imageUrl || null}></Avatar>
      <div>
        <Text>{data.label}</Text>
        <Text>{data.description}</Text>
      </div>
    </div>
  );
};

const CategorySelect = memo(({ category, items, value, onChange }) => (
  <MultiSelect
    key={category}
    label={category.toUpperCase()}
    placeholder={`Select ${category} dishes`}
    data={items}
    value={value}
    onChange={(values) => onChange(category, values)}
    searchable
    clearable
    itemComponent={FoodItem}
    nothingFound="No items"
    mt="md"
  />
));

const FoodForm = ({
  groupedFoods,
  setGroupedFoods,
  selectedByCategory,
  setSelectedByCategory,
  quotation,
}) => {
  const [foods, setFoods] = useState([]);

  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    if (quotation?.customFoodByCategory) {
      console.log(
        "Loading saved food selections:",
        quotation.customFoodByCategory
      );

      const savedSelections = {};
      Object.entries(quotation.customFoodByCategory).forEach(
        ([category, items]) => {
          savedSelections[category] = items.map((item) =>
            item.itemId.toString()
          );
        }
      );

      setSelectedByCategory(savedSelections);
    }
  }, [quotation]);

  useEffect(() => {
    const fetchFoods = async () => {
      const res = await axios.get(
        "http://localhost:8080/public/api/items/food",
        { withCredentials: true }
      );
      setFoods(res.data);

      // Split by category
      const grouped = res.data.reduce((acc, item) => {
        const category = item.category?.toLowerCase() || "uncategorized";
        if (!acc[category]) acc[category] = [];
        if (!acc[category]) acc[category] = [];
        acc[category].push({
          value: item.itemId.toString(),
          label: item.name,
          description: item.description,
          imageUrl: item.photos?.[0],
        });
        return acc;
      }, {});

      setGroupedFoods(grouped);
    };

    fetchFoods();
  }, []);

  const handleSelect = (category, values) => {
    setSelectedByCategory((prev) => ({
      ...prev,
      [category]: values,
    }));
  };

  const getSummary = () => {
    try {
      if (!selectedByCategory || typeof selectedByCategory !== "object") {
        return [];
      }

      return Object.entries(selectedByCategory)
        .filter(([category, values]) => {
          return (
            Array.isArray(values) &&
            values.length > 0 &&
            groupedFoods &&
            groupedFoods[category] &&
            Array.isArray(groupedFoods[category])
          );
        })
        .map(([category, values]) => ({
          category,
          items: (groupedFoods[category] || [])
            .filter((f) => f && f.value && values.includes(f.value))
            .filter(Boolean), // Remove any null/undefined
        }))
        .filter(({ items }) => items && items.length > 0);
    } catch (error) {
      console.error("Error in getSummary:", error);
      return [];
    }
  };
  // const getSummary = () => {
  //   console.log("🔍 DEBUG getSummary:");
  //   console.log("🔍 selectedByCategory:", selectedByCategory);
  //   console.log("🔍 groupedFoods keys:", Object.keys(groupedFoods));
  //   console.log("🔍 groupedFoods:", groupedFoods);

  //   return Object.entries(selectedByCategory)
  //     .filter(([_, values]) => values.length > 0)
  //     .map(([category, values]) => ({
  //       category,
  //       items: (groupedFoods[category] || []).filter(
  //         (f) => f && f.value && values.includes(f.value)
  //       ),
  //       // items: groupedFoods[category]?.filter((f) => values.includes(f.value)),
  //     }));
  // };

  const summary = getSummary();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        {" "}
        <Text size="xl">Included in the Package</Text>
        <Text size="xs" c="dimmed">
          Please select the dishes and foods to be served on your event
        </Text>
        <div>
          <Select
            placeholder="select food category"
            label="Category"
            value={activeCategory}
            onChange={setActiveCategory}
            data={Object.keys(groupedFoods).map((c) => ({
              value: c,
              label: c.toUpperCase(),
            }))}
          />
          <MultiSelect
            label={activeCategory.toUpperCase()}
            data={groupedFoods[activeCategory] || []}
            value={selectedByCategory[activeCategory] || []}
            onChange={(values) => handleSelect(activeCategory, values)}
            searchable
            renderOption={({ option }) => <FoodItem data={option} />}
          />
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg p-3 mt-4 col-span-2">
        <Title order={4}>Selected Food Summary</Title>
        <ScrollArea
          h={400}
          mt="sm"
          styles={{
            scrollbar: {
              '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                backgroundColor: "#B3CDE0",
              },
              '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb': {
                backgroundColor: "#B3CDE0",
              },
            },
          }}
        >
          {summary.length === 0 ? (
            <Text size="sm" c="dimmed">
              No items selected
            </Text>
          ) : (
            summary.map(({ category, items }) => (
              <div key={category} className="mt-2">
                <Text fw={600}>{category.toUpperCase()}</Text>
                <ul className="grid grid-cols-3 gap-1">
                  {items.map((item) => (
                    <Card key={item.itemId} shadow="md">
                      <div className="flex">
                        <AspectRatio ratio={1080 / 720} maw={100} mx="auto">
                          <Image
                            src={
                              item.photos?.[0] ||
                              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
                            }
                          ></Image>
                        </AspectRatio>

                        <div>
                          <li key={item.value}>{item.label}</li>
                        </div>
                      </div>
                    </Card>
                  ))}
                </ul>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

const DataForm = ({
  requestedDate,
  setRequestedDate,
  eventType,
  setEventType,
  celebrants,
  setCelebrants,
  pax,
  setPax,
  selectedVenue,
  setSelectedVenue,
  customerName,
  setCustomerName,
  contactNumber,
  setContactNumber,
  address,
  setAddress,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/venue", {
          withCredentials: true,
        });
        if (res && res.data) {
          // Map your venue data to match Select format
          const fromVenue = res.data.map((venue) => ({
            value: venue.venueId.toString(), // or venue.name if you prefer
            label: venue.name,
            image: venue.imageUrl, // optional if you want to show an image
            address: venue.address,
          }));

          setVenues(fromVenue);
        }

        setIsLoading(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-5">
      <div className="col-span-2">
        <div className="flex gap-2 mx-auto">
          <HoverCard shadow="xs" id="dateP" className="flex-1">
            <HoverCard.Target>
              <div>
                <p className="text-[14px] pb-[2px]">Event date:</p>
                <Button
                  variant="default"
                  className="!border !border-gray-400"
                  leftSection={<IconCalendarEvent />}
                >
                  <Text fw={100} c="dimmed" size="xs">
                    {" "}
                    {!requestedDate && <span>Pick Event date</span>}
                    {requestedDate &&
                      dayjs(requestedDate).format("ddd,MMMM D, YYYY")}
                  </Text>
                </Button>
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <AvailableCalendar
                onDateSelect={setRequestedDate}
              ></AvailableCalendar>
            </HoverCard.Dropdown>
          </HoverCard>
          <Select
            label="Venue"
            style={{ width: 300 }}
            value={selectedVenue}
            onChange={setSelectedVenue}
            placeholder="(Optional) Select venue"
            data={!isLoading ? venues : null}
            clearable
            renderOption={({ option }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Avatar
                  src={option?.image || "leticiaPhoto"}
                  size={80}
                  style={{
                    border: "2px solid white", // white border ring
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", // subtle shadow
                  }}
                />
                <div className="flex flex-col">
                  <span>{option?.label}</span>
                  <Text size="xs" c="dimmed">
                    {option?.address}
                  </Text>
                </div>
              </div>
            )}
          ></Select>
        </div>
        <div className="flex gap-2">
          <Select
            className="flex-1"
            label="Event"
            withAsterisk
            data={[
              "Wedding",
              "Birthdays",
              "Baptismal",
              "BabyShower",
              "Party",
              "Reunion",
              "Corporate",
            ]}
            value={eventType}
            onChange={setEventType}
            clearable
          ></Select>
          <NumberInput
            min={0}
            label="Enter number of guests"
            value={pax}
            onChange={setPax}
          />
        </div>

        <TextInput
          label="Celebrant/s"
          value={celebrants}
          onChange={(event) => setCelebrants(event.currentTarget.value)}
        ></TextInput>

        <TextInput
          label="Customer's fullname"
          value={customerName}
          onChange={(event) => setCustomerName(event.currentTarget.value)}
        ></TextInput>
        <TextInput
          label="Customer's contact number"
          placeholder="Enter 9-digit number"
          leftSection={<span className="text-[14px]">+639</span>}
          value={contactNumber}
          onChange={(event) => {
            const numbersOnly = event.currentTarget.value
              .replace(/\D/g, "")
              .slice(0, 9);
            setContactNumber(numbersOnly);
          }}
          styles={{
            input: {
              paddingLeft: "3.5rem",
              textAlign: "left",
            },
            section: {
              width: "3.5rem",
              justifyContent: "center",
            },
          }}
        />

        <Textarea
          withAsterisk
          label="Address"
          value={address}
          onChange={(event) => setAddress(event.currentTarget.value)}
        ></Textarea>
      </div>
    </div>
  );
};

const PackageAccordion = ({ packageData, opened, close, user, quotation }) => {
  const [skipMenu, setSkipMenu] = useState(false);
  const [bundles, setBundles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const [requestedDate, setRequestedDate] = useState();
  const [eventType, setEventType] = useState();
  const [celebrants, setCelebrants] = useState();
  const [pax, setPax] = useState();
  const [selectedVenue, setSelectedVenue] = useState();
  const [customerName, setCustomerName] = useState();
  const [contactNumber, setContactNumber] = useState();
  const [address, setAddress] = useState();
  const [loading, setLoading] = useState(false);

  const [selectedByCategory, setSelectedByCategory] = useState({});

  const [groupedFoods, setGroupedFoods] = useState({});

  const nextStep = () => setActiveStep((current) => Math.min(current + 1, 4));
  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  const getSelectedItemsTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  //   useEffect(() => {
  //     // original
  //     if (!packageData) return;

  //     setSelectedItems([]);
  //     setSelectedAddOns([]);
  //     setSelectedByCategory({});
  //     setActiveStep(0);

  //     if (packageData?.packageBundles) {
  //       const initialized = packageData.packageBundles.map((bundle) => ({
  //         ...bundle,
  //         selected: true,
  //         items: bundle.items.map((item) => ({ ...item, selected: true })),
  //       }));
  //       setBundles(initialized);
  //     }
  //   }, [packageData]);

  useEffect(() => {
    //added -quotation is introduced
    if (!packageData) return;

    setActiveStep(0);
    // setSelectedAddOns([]);
    setSelectedByCategory({});

    if (packageData?.packageBundles) {
      const initialized = packageData.packageBundles.map((bundle) => {
        const bundleItems = bundle.items.map((item) => {
          // check if item is in quotation
          const isSelected =
            quotation?.lineItems?.some(
              (li) => li.item.itemId === item.itemId
            ) ?? true;
          return { ...item, selected: isSelected };
        });

        const isBundleSelected = bundleItems.some((i) => i.selected);
        return {
          ...bundle,
          selected: isBundleSelected,
          items: bundleItems,
        };
      });
      setBundles(initialized);
    }

    // flatten selected items
    const selectedFromBundles = packageData.packageBundles.flatMap((bundle) =>
      bundle.items
        .filter((item) =>
          quotation?.lineItems?.some((li) => li.itemId === item.itemId)
        )
        .map((item) => ({ ...item, bundleName: bundle.name, source: "bundle" }))
    );
    setSelectedItems(selectedFromBundles || []);
  }, [packageData, quotation]);

  useEffect(() => {
    // Flatten all selected items from bundles whenever bundles change
    const selectedFromBundles = bundles.flatMap((bundle) =>
      bundle.items
        .filter((item) => item.selected)
        .map((item) => ({
          ...item,
          bundleName: bundle.name,
          source: "bundle",
        }))
    );

    setSelectedItems((prev) => {
      // Keep items from other sources intact
      const others = prev.filter((i) => i.source !== "bundle");

      // Merge with current bundle selections
      return [...others, ...selectedFromBundles];
    });
  }, [bundles]);

  useEffect(() => {
    if (quotation?.lineItems) {
      console.log("quotationLineItems-", quotation.lineItems);
      const selected = quotation.lineItems
        .filter((lineItem) => lineItem.item?.type === "add-on")
        .map((lineItem) => ({
          // Spread all properties from the nested item object
          ...lineItem.item,
          // Use the quantity from the lineItem (not from item)
          quantity: lineItem.quantity || 1,
          // Use priceAtQuotation for historical accuracy, or fallback to current price
          price: lineItem.item.price,
        }));
      console.log("selected Add-ons-", selected);
      console.log("Transformed selected Add-ons:", selected);
      setSelectedAddOns(selected);
    }
  }, [quotation]);

  //   useEffect(() => {
  //     if (quotation?.lineItems) {
  //       console.log("quotationLineItems-", quotation.lineItems);

  //       const selected = quotation.lineItems
  //         .filter((item) => item.item.type === "add-on")
  //         .map((item) => ({
  //           ...item,
  //           quantity: item.quantity || 1, // or whatever field represents the quantity
  //         }));

  //       console.log("selected Add-ons-", selected);
  //       setSelectedAddOns(selected);
  //     }
  //   }, [quotation]);

  useEffect(() => {
    if (!quotation) return;

    setRequestedDate(
      quotation.requestedEventDate
        ? new Date(quotation.requestedEventDate)
        : null
    );
    setSelectedVenue(
      quotation.venue.venueId ? quotation.venue.venueId.toString() : null
    );
    setEventType(quotation.eventType);
    setPax(quotation.pax);

    setCelebrants(quotation.celebrants);
    setCustomerName(quotation.customerName);
    setContactNumber(quotation.contactNumber);
    setAddress(quotation.address);
  }, [quotation]);

  const toggleBundle = (bundleId) => {
    setBundles((prev) =>
      prev.map((bundle) =>
        bundle.packageBundleId === bundleId
          ? {
              ...bundle,
              selected: !bundle.selected,
              items: bundle.items.map((item) => ({
                ...item,
                selected: !bundle.selected, // toggle all items
              })),
            }
          : bundle
      )
    );
  };

  const toggleItem = (bundleId, itemId) => {
    setBundles((prev) =>
      prev.map((bundle) =>
        bundle.packageBundleId === bundleId
          ? {
              ...bundle,
              items: bundle.items.map((item) =>
                item.itemId === itemId
                  ? { ...item, selected: !item.selected }
                  : item
              ),
            }
          : bundle
      )
    );
  };

  const resetQuotationStates = () => {
    setRequestedDate(null);
    setEventType("");
    setPax(0);
    setSelectedVenue(null);
    setCelebrants("");
    setCustomerName("");
    setContactNumber("");
    setAddress("");
  };

  const handleSubmitQuotation = async () => {
    console.log("🔄 handleSubmitQuotation called");
    console.log("📝 quotation object:", quotation);
    console.log("📝 quotation.quotationId:", quotation?.quotationId);
    console.log("📝 Is this an update?", !!quotation?.quotationId);

    try {
      setLoading(true);

      // 1. Prepare line items from selected items and add-ons
      const lineItems = [
        // Package items - always quantity 1 since they're bundled
        ...selectedItems.map((item) => ({
          itemId: item.itemId,
          quantity: 1,
          description: item.name,
          priceAtQuotation: item.price,
        })),
        // Add-on items - use quantifiable logic
        ...selectedAddOns.map((addon) => ({
          itemId: addon.itemId,
          quantity: isQuantifiable(addon) ? addon.quantity || 1 : 1,
          description: addon.name,
          priceAtQuotation: addon.price,
        })),
      ];

      // 2. Prepare custom food items by category
      const customFoodByCategory = {};
      Object.entries(selectedByCategory).forEach(
        ([category, selectedFoodIds]) => {
          if (selectedFoodIds.length > 0) {
            customFoodByCategory[category] = selectedFoodIds.map((foodId) => {
              const foodItem = groupedFoods[category]?.find(
                (f) => f.value === foodId
              );
              return {
                itemId: parseInt(foodId),
                name: foodItem?.label || "Unknown Item",
                category: category,
              };
            });
          }
        }
      );

      console.log("user-", user);

      // 3. Construct the payload
      const payload = {
        userId: user?.userId,
        eventDate: requestedDate,
        eventType: eventType,
        pax: pax,
        venueId: selectedVenue ? parseInt(selectedVenue) : null,
        celebrants: celebrants,
        customerName: customerName,
        contactNumber: contactNumber,
        address: address,
        lineItems: lineItems,
        customFoodByCategory: customFoodByCategory,
        packageId: packageData.packageId,
      };

      console.log("Sending payload:", payload);

      let response;

      // 4. Send the request

      if (quotation) {
        try {
          console.log("with quotation is called");

          response = await axios.put(
            `http://localhost:8080/quotations/update/${quotation.quotationId}`,
            payload,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (err) {
          console.error("failed updating quotation" + err);
        }
      } else {
        try {
          console.log("without quotation is called");
          response = await axios.post(
            "http://localhost:8080/quotations",
            payload,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (err) {
          console.error("failed saving quotation:" + err);
        }
      }

      setSelectedVenue(null);
      setCelebrants("");
      setEventType("");
      setPax("");
      setSelectedItems([]);

      // 5. Handle success
      notifications.show({
        title: "Success!",
        message: quotation
          ? "Quotation updated successfully"
          : "Quotation created successfully",
        color: "green",
      });
      resetQuotationStates();
      close();
      return response.data;
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Failed!",
        message: quotation
          ? "Quotation update failed"
          : "Quotation creation faiiled",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(bundles);

  return (
    <Modal opened={opened} onClose={close} size="100%" withCloseButton={false}>
      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
        styles={{
          step: {
            padding: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          stepLabel: {
            marginTop: 8,
            fontSize: 14,
          },
          stepBody: { display: "none" }, // hide content inside step
          stepSeparator: {
            display: "none", // remove line between steps
          },
        }}
      >
        <Stepper.Step
          label="Event details"
          description="Provide event date, venue, and guest count"
        >
          <DataForm
            requestedDate={requestedDate}
            setRequestedDate={setRequestedDate}
            eventType={eventType}
            setEventType={setEventType}
            celebrants={celebrants}
            setCelebrants={setCelebrants}
            pax={pax}
            setPax={setPax}
            selectedVenue={selectedVenue}
            setSelectedVenue={setSelectedVenue}
            customerName={customerName}
            setCustomerName={setCustomerName}
            contactNumber={contactNumber}
            setContactNumber={setContactNumber}
            address={address}
            setAddress={setAddress}
          />
          <Group position="right" mt="md">
            <Button
              disabled={!requestedDate || !eventType || !pax}
              onClick={nextStep}
            >
              Next
            </Button>
          </Group>
        </Stepper.Step>

        <Stepper.Step
          label="Customize Package"
          description="Select your preferred services and inclusions"
        >
          <div className=" grid grid-cols-3">
            <Accordion>
              {bundles.map((bundle) => (
                <Accordion.Item
                  key={bundle.packageBundleId}
                  value={bundle.name}
                >
                  <Accordion.Control>
                    <Group position="apart">
                      <Checkbox
                        checked={bundle.selected}
                        size="xs"
                        onChange={() => toggleBundle(bundle.packageBundleId)}
                      />
                      <Text weight={300}>{bundle.name}</Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack spacing="sm">
                      {bundle.items.map((item) => (
                        <Group
                          key={item.itemId}
                          position="apart"
                          style={{ opacity: bundle.selected ? 1 : 0.5 }}
                        >
                          <Checkbox
                            size="xs"
                            checked={item.selected}
                            disabled={!bundle.selected}
                            onChange={() =>
                              toggleItem(bundle.packageBundleId, item.itemId)
                            }
                          />
                          <Text fz="xs">{item.name}</Text>
                          <Text fz="xs">
                            {item.price.toLocaleString("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            })}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
            <div></div>
            <div className="Summary border border-gray-300 rounded-xl p-4">
              <ScrollArea h={800}>
                {" "}
                {selectedItems?.map((selectedItems, index) => (
                  <li className="list-none" key={index}>
                    {selectedItems.name}
                  </li>
                ))}
              </ScrollArea>
              <Text fw={600}>
                {getSelectedItemsTotal().toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
                {selectedItems.length} items
              </Text>
            </div>
          </div>
          <Group position="apart" mt="md">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next</Button>
          </Group>
        </Stepper.Step>

        <Stepper.Step
          label="Select Menu"
          description="Pick dishes for your catering menu"
        >
          <FoodForm
            groupedFoods={groupedFoods}
            setGroupedFoods={setGroupedFoods}
            selectedByCategory={selectedByCategory}
            setSelectedByCategory={setSelectedByCategory}
            quotation={quotation}
          />

          <Group position="apart" mt="md">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next</Button>
          </Group>
        </Stepper.Step>
        <Stepper.Step
          label="Choose Add-ons"
          description="Add optional rentals or extras"
        >
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              {" "}
              {
                <AddOnsForm
                  selectedAddOns={selectedAddOns}
                  setSelectedAddOns={setSelectedAddOns}
                ></AddOnsForm>
              }
            </div>
            <div className="add-on-summary border border-gray-300 rounded-xl p-4">
              <Title order={4}>Summary</Title>
              <ScrollArea h={600} mt="sm">
                {/* Customized Package Total */}
                <div className="mb-4">
                  <Text fw={500}>Customized Package Total:</Text>
                  <Text fw={600}>
                    {formatter.format(getSelectedItemsTotal())}
                  </Text>
                </div>

                {/* Selected Add-ons */}
                <div className="p-4">
                  <Text fw={500}>Selected Add-ons:</Text>
                  {selectedAddOns.length === 0 ? (
                    <Text size="sm" c="dimmed">
                      No add-ons selected
                    </Text>
                  ) : (
                    <ul className="list-none">
                      {selectedAddOns.map((addon) => (
                        <li
                          key={addon.itemId}
                          className="flex justify-between items-center mb-1"
                        >
                          <span>{addon.name}</span>
                          <Group spacing={8}>
                            {isQuantifiable(addon) && (
                              <NumberInput
                                min={1}
                                value={addon.quantity}
                                onChange={(value) => {
                                  const numericValue = Number(value) || 1;
                                  setSelectedAddOns((prev) =>
                                    prev.map((i) =>
                                      i.itemId === addon.itemId
                                        ? { ...i, quantity: numericValue }
                                        : i
                                    )
                                  );
                                }}
                                styles={{ input: { width: 60 } }}
                              />
                            )}
                            <span>
                              {formatter.format(
                                (addon.price || 0) * (addon.quantity || 1)
                              )}
                            </span>
                            <Button
                              size="xs"
                              color="red"
                              onClick={() =>
                                setSelectedAddOns((prev) =>
                                  prev.filter((i) => i.itemId !== addon.itemId)
                                )
                              }
                            >
                              Remove
                            </Button>
                          </Group>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Text fw={600} mt={2}>
                    Add-ons Total:{" "}
                    {formatter.format(
                      selectedAddOns.reduce(
                        (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
                        0
                      )
                    )}
                  </Text>

                  {/* Subtotal */}
                  <div className="border-t mt-2 pt-2">
                    <Text fw={700}>
                      Subtotal:{" "}
                      {formatter.format(
                        getSelectedItemsTotal() +
                          selectedAddOns.reduce(
                            (sum, i) =>
                              sum + (i.price || 0) * (i.quantity || 1),
                            0
                          )
                      )}
                    </Text>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
          <Group position="apart" mt="md">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next</Button>
          </Group>
        </Stepper.Step>
        <Stepper.Step
          label="Review & Confirm"
          description="Check summary before confirming your booking"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* === Form Data Summary === */}
            <div className="border p-4 rounded-lg">
              <Text fw={600} size="lg">
                Event Details
              </Text>
              <Text>
                Date:{" "}
                {requestedDate
                  ? dayjs(requestedDate).format("ddd, MMM D, YYYY")
                  : "N/A"}
              </Text>
              <Text>Venue: {selectedVenue || "N/A"}</Text>
              <Text>Event Type: {eventType || "N/A"}</Text>
              <Text>Guests: {pax || "N/A"}</Text>
              <Text>Celebrant/s: {celebrants || "N/A"}</Text>
              <Text>Customer Name: {customerName || "N/A"}</Text>
              <Text>
                Contact Number: {contactNumber ? `+639${contactNumber}` : "N/A"}
              </Text>
              <Text>Address: {address || "N/A"}</Text>
            </div>

            {/* === Items Summary === */}
            <div className="border p-4 rounded-lg">
              <Text fw={600} size="lg">
                Order Summary
              </Text>

              {/* Customized Package */}
              <div className="mt-2">
                <Text fw={500}>Order Summary</Text>
                <ScrollArea h={300}>
                  <ul className="list-none">
                    {/* Preset package items */}
                    {selectedItems.map((item) => (
                      <li
                        key={item.itemId}
                        className="flex justify-between items-center mb-2"
                      >
                        <div>
                          <Text size="sm">{item.name}</Text>
                          <Text size="xs">
                            Price: {formatter.format(item.price || 0)} x 1 ={" "}
                            {formatter.format(item.price || 0)}
                          </Text>
                        </div>
                        <Button
                          size="xs"
                          color="red"
                          onClick={() => {
                            setSelectedItems((prev) =>
                              prev.filter((i) => i.itemId !== item.itemId)
                            );
                            setBundles((prev) =>
                              prev.map((bundle) => ({
                                ...bundle,
                                items: bundle.items.map((i) =>
                                  i.itemId === item.itemId
                                    ? { ...i, selected: false }
                                    : i
                                ),
                              }))
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}

                    {/* Add-ons
                    {selectedAddOns.map((addon) => (
                      <li
                        key={addon.itemId}
                        className="flex justify-between items-center mb-2"
                      >
                        <div>
                          <Text size="sm">{addon.name}</Text>
                          <Text size="xs">
                            Unit: {formatter.format(addon.price || 0)} x{" "}
                            {addon.quantity} ={" "}
                            {formatter.format(
                              (addon.price || 0) * (addon.quantity || 1)
                            )}
                          </Text>
                        </div>

                        <div className="flex gap-2 items-center">
                          <Group spacing={4}>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => {
                                const newQty = Math.max(1, addon.quantity - 1);
                                setSelectedAddOns((prev) =>
                                  prev.map((i) =>
                                    i.itemId === addon.itemId
                                      ? { ...i, quantity: newQty }
                                      : i
                                  )
                                );
                              }}
                            >
                              -
                            </Button>
                            <Text size="sm">{addon.quantity}</Text>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => {
                                const newQty = addon.quantity + 1;
                                setSelectedAddOns((prev) =>
                                  prev.map((i) =>
                                    i.itemId === addon.itemId
                                      ? { ...i, quantity: newQty }
                                      : i
                                  )
                                );
                              }}
                            >
                              +
                            </Button>
                          </Group>

                          <Button
                            size="xs"
                            color="red"
                            onClick={() =>
                              setSelectedAddOns((prev) =>
                                prev.filter((i) => i.itemId !== addon.itemId)
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))} */}
                    {selectedAddOns.map((addon) => (
                      <li
                        key={addon.itemId}
                        className="flex justify-between items-center mb-2"
                      >
                        <div>
                          <Text size="sm">{addon.name}</Text>
                          <Text size="xs">
                            {/* FIX: Only show quantity for quantifiable items */}
                            {isQuantifiable(addon) ? (
                              <>
                                Unit: {formatter.format(addon.price || 0)} x{" "}
                                {addon.quantity} ={" "}
                                {formatter.format(
                                  (addon.price || 0) * (addon.quantity || 1)
                                )}
                              </>
                            ) : (
                              <>
                                Price: {formatter.format(addon.price || 0)} x 1
                                = {formatter.format(addon.price || 0)}
                              </>
                            )}
                          </Text>
                        </div>

                        <div className="flex gap-2 items-center">
                          {/* FIX: Only show quantity controls for quantifiable items */}
                          {isQuantifiable(addon) && (
                            <Group spacing={4}>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => {
                                  const newQty = Math.max(
                                    1,
                                    addon.quantity - 1
                                  );
                                  setSelectedAddOns((prev) =>
                                    prev.map((i) =>
                                      i.itemId === addon.itemId
                                        ? { ...i, quantity: newQty }
                                        : i
                                    )
                                  );
                                }}
                              >
                                -
                              </Button>
                              <Text size="sm">{addon.quantity}</Text>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => {
                                  const newQty = addon.quantity + 1;
                                  setSelectedAddOns((prev) =>
                                    prev.map((i) =>
                                      i.itemId === addon.itemId
                                        ? { ...i, quantity: newQty }
                                        : i
                                    )
                                  );
                                }}
                              >
                                +
                              </Button>
                            </Group>
                          )}

                          <Button
                            size="xs"
                            color="red"
                            onClick={() =>
                              setSelectedAddOns((prev) =>
                                prev.filter((i) => i.itemId !== addon.itemId)
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>

                {/* Grand Total */}
                {/* <Text fw={700} mt={2}>
                  Subtotal:{" "}
                  {formatter.format(
                    getSelectedItemsTotal() +
                      selectedAddOns.reduce(
                        (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
                        0
                      )
                  )}
                </Text> */}
                <Text fw={700} mt={2}>
                  Subtotal:{" "}
                  {formatter.format(
                    getSelectedItemsTotal() +
                      selectedAddOns.reduce(
                        (sum, i) =>
                          sum +
                          (i.price || 0) *
                            (isQuantifiable(i) ? i.quantity || 1 : 1),
                        0
                      )
                  )}
                </Text>
              </div>
            </div>
          </div>
          <Group position="apart" mt="md">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button
              onClick={() => {
                alert("Customization Complete");
                handleSubmitQuotation();
              }}
            >
              Submit
            </Button>
          </Group>
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
};

export default Customization;
