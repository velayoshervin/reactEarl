import React, { useEffect, useState, useMemo } from "react";
import PCard from "./PCard";
import api from "../../api";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import {
  Drawer,
  Group,
  Text,
  NumberFormatter,
  Stack,
  Image,
  Button,
  Tooltip,
  Divider,
  Stepper,
  Tabs,
  Anchor,
  Menu,
  Avatar,
} from "@mantine/core";
import { Modal } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../AxiosTanstack";
import { IconX, IconCheck } from "@tabler/icons-react";
import { Link, NavLink } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import PackageViewer from "./PackageViewer";
import { IconChevronRight } from "@tabler/icons-react";
import { IconPhoto } from "@tabler/icons-react";
import { IconVideo } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";
import PackageOptions from "./PackageOptions";

async function getPageData(page, size) {
  return api.get("http://localhost:8080/public/api/items/addOns", {
    params: { page, size },
    withCredentials: true,
  });
}

async function getItemByType(type, size) {
  return api.get("http://localhost:8080/public/api/items/type", {
    params: { type: type, size: size },
    withCredentials: true,
  });
}

async function createQuotation(payload) {
  return api.post("http://localhost:8080/quotations", payload, {
    withCredentials: true,
  });
}

const PCardContainer = ({ quotation }) => {
  const [pageData, setPageData] = useState({});
  const [items, setItems] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [packages, setPackages] = useState([]);
  const [SelectedPackages, setSelectedPackages] = useState([]);
  const [user, setUser] = useState(null);

  const [active, setActive] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [packagePage, setPackagesPage] = useState();
  const [service, setService] = useState([]);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const navigate = useNavigate();

  const [itemsPage, setItemsPage] = useState(0); // current page index
  const [itemsTotal, setItemsTotal] = useState(0); // total pages from API
  const itemsPageSize = 8; // or however many you want per page

  const [userId, setUserId] = useState();

  useEffect(() => {
    if (quotation?.userDto?.userId) {
      setUserId(quotation.userDto.userId);
    } else {
      const user = queryClient.getQueryData(["currentUser"]);
      setUser(user);
      setUserId(user?.userId);
    }
  }, [quotation]);

  const [eventDate, setEventDate] = useState(null);

  const [searchParams] = useSearchParams();
  const occasion = searchParams.get("eventType");
  const pax = searchParams.get("pax");
  const venueId = searchParams.get("venue");

  useEffect(() => {
    if (quotation) {
      console.log("qt", quotation);
      setEventDate(quotation.requestedEventDate);
    } else if (searchParams.get("date")) {
      setEventDate(searchParams.get("date"));
    }
  }, [quotation, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPageData(itemsPage, itemsPageSize);
        if (res?.data) {
          setPageData(res.data);
          setItems(res.data.content);
          setItemsTotal(Math.ceil(res.data.totalElements / itemsPageSize));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [itemsPage]);

  useEffect(() => {
    const fetchPackages = async () => {
      const type = "package";
      const size = 10;
      try {
        const res = await getItemByType(type, size);
        console.log("packages response", res);
        if (res) {
          setPackages(res?.data?.content);
        }
      } catch (err) {
        console.error("Error fetching packages", err);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const type = "performer";
      const size = 10;
      try {
        const res = await getItemByType(type, size);
        console.log("performer response", res);
        if (res) {
          setService(res?.data?.content);
        }
      } catch (err) {
        console.error("Error fetching services", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (!quotation) return;

    // Split lineItems into packages vs add-ons
    const packages = quotation.lineItems.filter(
      (li) => li.item.type === "package"
    );

    const performersAndAddOns = quotation.lineItems.filter(
      (li) => li.item.type === "performer" || li.item.type === "add-on"
    );

    setSelectedPackages(
      packages.map((p) => ({
        itemId: p.item.itemId,
        name: p.item.name,
        description: p.item.description,
        price: p.priceAtQuotation,
        perUnitExcess: p.item.perUnitExcess,
        category: p.item.category,
        type: p.item.type,
        pax: p.item.pax,
        photos: p.item.photos,
        videos: p.item.videos,
      }))
    );

    setLineItems(
      performersAndAddOns.map((a) => ({
        itemId: a.item.itemId,
        name: a.item.name,
        description: a.item.description,
        priceAtPurchase: a.priceAtQuotation,
        quantity: a.quantity,
        category: a.item.category,
        type: a.item.type,
      }))
    );
  }, [quotation]);

  async function updateQuotation(id, payload) {
    return api.put(`http://localhost:8080/quotations/${id}`, payload, {
      withCredentials: true,
    });
  }
  const updateQuotationHandler = () => {
    if (SelectedPackages.length < 1) {
      alert("Package required");
      return;
    }

    // Map SelectedPackages to include itemId
    const packageItems = SelectedPackages.map((p) => ({
      itemId: p.itemId ?? p.item?.itemId, // take from p.item if p.itemId is null
      description: p.name,
      priceAtQuotation: p.price,
      quantity: 1,
    }));

    // Map lineItems to include itemId
    const addonItems = lineItems.map((a) => ({
      itemId: a.itemId ?? a.item?.itemId, // take from a.item if a.itemId is null
      description: a.name,
      priceAtQuotation: a.priceAtPurchase,
      quantity: a.quantity,
    }));

    const payload = {
      userId: userId,
      lineItems: [...packageItems, ...addonItems],
      eventDate,
    };

    const doUpdate = async () => {
      try {
        console.log("Updating quotation with payload:", payload);
        const res = await updateQuotation(quotation.quotationId, payload);
        console.log("Updated quotation", res.data);

        notifications.show({
          title: "Quotation Updated",
          message: `Quotation updated successfully!`,
          color: "green",
        });
      } catch (err) {
        console.error(err.response || err);
        notifications.show({
          title: "Update failed",
          message: "Something went wrong",
          color: "red",
        });
      }
    };

    doUpdate();
  };

  const submitQuotationHandler = () => {
    if (SelectedPackages.length < 1) {
      alert("package required");
      return;
    }

    console.log("selected Packages", SelectedPackages);
    console.log("selectedAddons", lineItems);

    if (userId) console.log("userId", userId);

    const items = [
      ...SelectedPackages.map((p) => ({
        itemId: p.itemId,
        description: p.name,
        priceAtQuotation: p.price,
        quantity: 1,
      })),
      ...lineItems.map((a) => ({
        itemId: a.itemId,
        description: a.name,
        priceAtQuotation: a.priceAtPurchase,
        quantity: a.quantity,
      })),
    ];

    // const params = {
    //   occasion,
    //   pax,
    //   venueId,
    // };

    const payload = {
      userId: userId,
      lineItems: items,
      eventDate,
      eventType: occasion,
      pax,
      venueId: venueId ? Number(venueId) : null,
    };

    const submitQuotation = async () => {
      try {
        const res = await createQuotation(payload);
        console.log(res);
        navigate("/user-dashboard");
      } catch (err) {
        console.log(err.response);
      }
    };
    submitQuotation(payload);
  };

  const decreaseQuantity = (itemId) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const increaseQuantity = (itemId) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setLineItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const total = useMemo(() => {
    return lineItems.reduce(
      (sum, item) => sum + item.quantity * item.priceAtPurchase,
      0
    );
  }, [lineItems]);

  const packageTotal = useMemo(() => {
    return SelectedPackages.reduce((sum, item) => sum + item.price, 0);
  }, [SelectedPackages]);

  const groupedItems = useMemo(() => {
    return lineItems.reduce((acc, item) => {
      const category = item.category || "Other"; // fallback category
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, [lineItems]);

  // const MemoizedPackageOptions = useMemo(
  //   () => (
  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //       {packages.map((p) => (
  //         <div
  //           key={p.itemId}
  //           className="border border-gray-200 p-4 rounded shadow-sm"
  //         >
  //           <PackageViewer pkg={p} />

  //           <Button
  //             mt="sm"
  //             fullWidth
  //             onClick={() => {
  //               setSelectedPackages((prev) => {
  //                 const exists = prev.some((pkg) => pkg.itemId === p.itemId);
  //                 if (exists) return prev;
  //                 return [...prev, p];
  //               });
  //               showNotification({
  //                 title: "Package added",
  //                 message: `${p.name} added`,
  //                 color: "green",
  //                 icon: <IconCheck />,
  //               });
  //             }}
  //           >
  //             Add Package
  //           </Button>
  //         </div>
  //       ))}
  //     </div>
  //   ),
  //   [packages, setSelectedPackages]
  // );

  const ServiceOption = () => {
    const grouped = service.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    return (
      <>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={items?.id} className="mb-6">
            <h2 className="text-lg font-bold mb-2">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((i) => (
                <PCard
                  key={i.id}
                  {...i}
                  setLineItems={setLineItems}
                  lineItems={lineItems}
                />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  const Steps = () => {
    const nextStep = () =>
      setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () =>
      setActive((current) => (current > 0 ? current - 1 : current));

    return (
      <>
        <div className="">
          <Group>
            <Button
              onClick={open}
              variant="default"
              className="my-2"
              size={"xs"}
              rightSection={<IconChevronRight size={14} />}
            >
              Item Summary
            </Button>

            <Group className="mr-auto">
              <Button
                variant="default"
                onClick={prevStep}
                type="button"
                size={"xs"}
              >
                <IconChevronLeft />
              </Button>
              <Button variant="default" onClick={nextStep} size={"xs"}>
                <IconChevronRight />
              </Button>
            </Group>
          </Group>

          <Stepper
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
            allowNextStepsSelect={false}
          >
            <Stepper.Step description="Select Package"></Stepper.Step>
            <Stepper.Step description="(Optional) select Addon/s"></Stepper.Step>
            <Stepper.Step description="(Optional) select Host/Performers/Service "></Stepper.Step>
            <Stepper.Step description="Summary and Submission "></Stepper.Step>

            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>

          <div className="mt-6">
            {active === 0 && (
              <PackageOptions
                packages={packages}
                setSelectedPackages={setSelectedPackages}
              />
            )}
            {/* MemoizedPackageOptions */}
            {active === 1 && <AddOnsOption></AddOnsOption>}
            {active === 2 && <ServiceOption></ServiceOption>}
            {active === 3 && <Summary></Summary>}
          </div>
        </div>
      </>
    );
  };

  const CartDrawer = () => {
    return (
      <>
        <Drawer opened={opened} onClose={close} zIndex={9999}>
          <p className="font-semibold pb-2">Booking Summary</p>
          <Text size="md" fw={600}>
            Packages
          </Text>
          {SelectedPackages.map((i, idx) => (
            <div key={idx} className="border border-gray-300 rounded p-4 pb-3">
              <Text fw={600} size="xs">
                {i.name}
              </Text>
              <Text c="dimmed" size="xs">
                {i.description}
              </Text>
              <div className=" flex items-center">
                <NumberFormatter
                  prefix="₱ "
                  value={i.price}
                  thousandSeparator
                  className="mr-2"
                />
                {Number(i.perUnitExcess) > 0 && (
                  <>
                    <NumberFormatter
                      prefix="₱ "
                      value={i.perUnitExcess}
                      thousandSeparator
                      className="text-blue-400 mr-1"
                    />
                    <span className="text-blue-400 ml-none"> per person</span>
                  </>
                )}
                <Button
                  size="xs"
                  className="ml-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPackages((prev) =>
                      prev.filter((pkg, packageIndex) => packageIndex !== idx)
                    );
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Divider className="py-2"></Divider>
          <div className="flex justify-between py-2">
            <Text fw={600}>Package Total</Text>{" "}
            <NumberFormatter
              prefix="₱ "
              value={packageTotal}
              thousandSeparator
            />
          </div>
          <div>
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-4">
                {/* Category Header */}
                <Text fw={700} size="sm" className="mb-2">
                  {category}
                </Text>

                {/* Items under category */}
                {items.map((i) => (
                  <div key={i.itemId} className="flex w-full p-4 gap-2">
                    <img
                      src="https://picsum.photos/400/500"
                      className="h-18 w-20"
                      alt={i.name}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <Text size="xs">{i.name}</Text>
                        <Tooltip
                          label="remove item"
                          withArrow
                          withinPortal
                          zIndex={99999999}
                          color="red"
                        >
                          <Button
                            type="button"
                            size="xs"
                            onClick={(e) => {
                              e.preventDefault();
                              removeItem(i.itemId);
                            }}
                            variant="default"
                            c="red"
                            className="ml-2"
                          >
                            <IconTrash size={12} />
                          </Button>
                        </Tooltip>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <NumberFormatter
                          prefix="₱ "
                          value={i.priceAtPurchase}
                          thousandSeparator
                        />
                        <Text size="sm"> x {i.quantity}</Text>
                      </div>

                      <div className="flex items-center justify-between">
                        <Group>
                          <Text fw={700} size="xs">
                            Subtotal:
                          </Text>
                          <NumberFormatter
                            prefix="₱ "
                            value={i.quantity * i.priceAtPurchase}
                            thousandSeparator
                            size="xs"
                          />
                        </Group>

                        {i.type === "add-on" && (
                          <Button.Group>
                            <Button
                              variant="default"
                              size="xs"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                decreaseQuantity(i.itemId);
                              }}
                            >
                              -
                            </Button>
                            <Button.GroupSection variant="default" size="xs">
                              {i.quantity}
                            </Button.GroupSection>
                            <Button
                              variant="default"
                              size="xs"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                increaseQuantity(i.itemId);
                              }}
                            >
                              +
                            </Button>
                          </Button.Group>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Divider />
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <Text fw={600}> Add-ons Total:</Text>
              <NumberFormatter
                prefix="₱ "
                value={total}
                thousandSeparator
                className="mr-2"
              />
            </div>
          </div>
          <Divider></Divider>
          <Stack className="">
            <div className="flex justify-between">
              <Text fw={700}>Total: </Text>
              <NumberFormatter
                prefix="₱ "
                value={total + packageTotal}
                thousandSeparator
                size="xs"
              ></NumberFormatter>
            </div>
            <Group>
              {quotation ? (
                <Button onClick={updateQuotationHandler} color="blue">
                  Update Quotation
                </Button>
              ) : (
                <Button onClick={submitQuotationHandler} color="green">
                  Submit Quotation
                </Button>
              )}
            </Group>
          </Stack>
        </Drawer>
      </>
    );
  };

  const AddOnsOption = () => {
    return (
      <>
        <div></div>

        {pageData && (
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-black -">
              {items.map((i, idx) => (
                <PCard
                  key={idx}
                  {...i}
                  setLineItems={setLineItems}
                  openCart={open}
                  lineItems={lineItems}
                ></PCard>
              ))}
            </div>
            <div className="flex justify-between items-center mb-4 pt-20">
              <Button
                disabled={itemsPage === 0}
                onClick={() => setItemsPage((prev) => prev - 1)}
              >
                Prev
              </Button>
              <Text>
                Page {itemsPage + 1} of {itemsTotal}
              </Text>
              <Button
                disabled={itemsPage + 1 >= itemsTotal}
                onClick={() => setItemsPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  const Summary = () => (
    <>
      <p className="font-semibold pb-2">Quotation Summary</p>
      <div className="grid-cols-2 grid gap-4">
        <div>
          <Text size="md" fw={600}>
            Packages
          </Text>

          {SelectedPackages.map((i, idx) => (
            <div key={idx} className="border border-gray-300 rounded p-4 pb-3 ">
              <Text fw={600} size="xs">
                {i.name}
              </Text>
              <Text c="dimmed" size="xs">
                {i.description}
              </Text>
              <div className=" flex items-center">
                <NumberFormatter
                  prefix="₱ "
                  value={i.price}
                  thousandSeparator
                  className="mr-2"
                />
                {Number(i.perUnitExcess) > 0 && (
                  <>
                    <NumberFormatter
                      prefix="₱ "
                      value={i.perUnitExcess}
                      thousandSeparator
                      className="text-blue-400 mr-1"
                    />
                    <span className="text-blue-400 ml-none"> per person</span>
                  </>
                )}
                <Button
                  size="xs"
                  className="ml-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPackages((prev) =>
                      prev.filter((pkg, packageIndex) => packageIndex !== idx)
                    );
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Divider className="py-2"></Divider>
          <div className="flex justify-between py-2">
            <Text fw={600}>Package Total</Text>{" "}
            <NumberFormatter
              prefix="₱ "
              value={packageTotal}
              thousandSeparator
            />
          </div>
        </div>
        <div>
          <div>
            <Text fw={600}>Add-ons</Text>
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-4">
                {/* Category Header */}
                <Text fw={700} size="sm" className="mb-2">
                  {category}
                </Text>

                {/* Items under category */}
                {items.map((i) => (
                  <div key={i.itemId} className="flex w-full p-4 gap-2">
                    <img
                      src="https://picsum.photos/400/500"
                      className="h-18 w-20"
                      alt={i.name}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <Text size="xs">{i.name}</Text>
                        <Tooltip
                          label="remove item"
                          withArrow
                          withinPortal
                          zIndex={99999999}
                          color="red"
                        >
                          <Button
                            size="xs"
                            onClick={() => removeItem(i.itemId)}
                            variant="default"
                            c="red"
                            className="ml-2"
                          >
                            <IconTrash size={12} />
                          </Button>
                        </Tooltip>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <NumberFormatter
                          prefix="₱ "
                          value={i.priceAtPurchase}
                          thousandSeparator
                        />
                        <Text size="sm"> x {i.quantity}</Text>
                      </div>

                      <div className="flex items-center justify-between">
                        <Group>
                          <Text fw={700} size="xs">
                            Subtotal:
                          </Text>
                          <NumberFormatter
                            prefix="₱ "
                            value={i.quantity * i.priceAtPurchase}
                            thousandSeparator
                            size="xs"
                          />
                        </Group>

                        {i.type === "add-on" && (
                          <Button.Group>
                            <Button
                              variant="default"
                              size="xs"
                              onClick={(e) => {
                                e.preventDefault();
                                decreaseQuantity(i.itemId);
                              }}
                            >
                              -
                            </Button>
                            <Button.GroupSection variant="default" size="xs">
                              {i.quantity}
                            </Button.GroupSection>
                            <Button
                              variant="default"
                              size="xs"
                              onClick={(e) => {
                                e.preventDefault();

                                increaseQuantity(i.itemId);
                              }}
                            >
                              +
                            </Button>
                          </Button.Group>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <Divider />
            <div className="flex justify-between pt-2">
              <Text fw={600}> Add-ons Total:</Text>
              <NumberFormatter
                prefix="₱ "
                value={total}
                thousandSeparator
                className="mr-2"
              />
            </div>
          </div>
        </div>
      </div>

      <Divider></Divider>
      <Stack className="">
        <div className="flex justify-between">
          <Text fw={700}>Total: </Text>
          <NumberFormatter
            prefix="₱ "
            value={total + packageTotal}
            thousandSeparator
            size="xs"
          ></NumberFormatter>
        </div>
        <Group className="relative ml-auto pr-4">
          {quotation ? (
            <Button onClick={updateQuotationHandler} color="blue">
              Update Quotation
            </Button>
          ) : (
            <Button onClick={submitQuotationHandler} color="green">
              Submit Quotation
            </Button>
          )}
        </Group>
      </Stack>
    </>
  );

  const LoggedIn = () => (
    <Group>
      <Avatar></Avatar>
      <Text>
        {user?.firstname || ""} {user?.lastname || ""}
      </Text>
      <Stack>
        <NavLink label="logout"></NavLink>
        <NavLink label="dashboard" href="/user-dashboard"></NavLink>
      </Stack>
    </Group>
  );
  const Header = () => (
    <>
      <header className="flex justify-around items-center py-4">
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          logo
        </div>
        <Group className="">
          <Anchor component={Link} to="/" className="!text-black !no-underline">
            Home
          </Anchor>
          <Anchor
            component={Link}
            to="/feature"
            className="!text-black !no-underline"
          >
            Feature
          </Anchor>
          <Anchor
            component={Link}
            to="/about"
            className="!text-black !no-underline"
          >
            About
          </Anchor>
          <Menu
            trigger="click-hover"
            openDelay={100}
            closeDelay={400}
            shadow="sm"
          >
            <Menu.Target>
              <Button variant="subtle" className="!text-black !font-light">
                Support
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item value="settings">FAQs</Menu.Item>
              <Menu.Item value="help">Terms and Policy</Menu.Item>
              <Menu.Item value="logout">Contacts</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {user?.userId ? (
          <LoggedIn></LoggedIn>
        ) : (
          <Group>
            <Button type="button" variant="default">
              Login
            </Button>
            <Button type="button" variant="">
              Sign Up
            </Button>
          </Group>
        )}
      </header>
      <Divider className="mb-4"></Divider>
    </>
  );

  return (
    <div className="bg-white min-h-[100vh]">
      {/* <Header></Header> */}
      {/* <h2>
        Selected date: {eventDate ? new Date(eventDate).toDateString() : "None"}
      </h2> */}
      <div className="bg-white max-w-[1060px] mx-auto ">
        <Steps />
      </div>
      <CartDrawer></CartDrawer>
      <Modal
        opened={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        title="login required"
      >
        <Text>You need to login first to save or submit quotation</Text>
        <Button
          onClick={() => {
            navigate("/login");
          }}
        >
          go to Login
        </Button>
      </Modal>
    </div>
  );
};

export default PCardContainer;
