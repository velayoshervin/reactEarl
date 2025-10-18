import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Image,
  Text,
  Button,
  AspectRatio,
  ActionIcon,
  Pagination,
  Skeleton,
  NumberInput,
  Group,
  ScrollArea,
  Title,
} from "@mantine/core";
import { IconPhoto, IconVideo } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { Carousel } from "@mantine/carousel";

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

const AddOnsSelection = ({
  formData,
  updateFormData,
  quotation,
  onNext,
  onBack,
}) => {
  const [loadingAddOns, setLoadingAddOns] = useState(false);
  const [page, setPage] = useState(1);
  const [addOns, setAddOns] = useState([]);
  const [filter, setFilter] = useState("All");
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    if (quotation?.lineItems) {
      const selected = quotation.lineItems
        .filter((lineItem) => lineItem.item?.type === "add-on")
        .map((lineItem) => ({
          ...lineItem.item,
          quantity: lineItem.quantity || 1,
          price: lineItem.item.price,
        }));

      updateFormData({ selectedAddOns: selected });
    }
  }, [quotation, updateFormData]);

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
          params: { page: page - 1, size: 8 },
        });

        if (res?.data) {
          setAddOns(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAddOns(false);
      }
    };

    fetchAddOns();
  }, [page, filter]);

  const openGallery = (item) => {
    modals.open({
      withCloseButton: false,
      size: "80%",
      overlayBlur: 0,
      overlayColor: "rgba(0,0,0,1)",
      children: (
        <div className="flex flex-wrap gap-4 justify-center">
          <Carousel withIndicators height="100%" flex={1}>
            {item.photos?.length ? (
              item.photos.map((p, index) => (
                <Carousel.Slide key={index}>
                  <AspectRatio ratio={16 / 9} maw={1200}>
                    <Image src={p.url} alt={item.name} />
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
  };

  const openVideos = (item) => {
    modals.open({
      withCloseButton: false,
      size: "80%",
      overlayBlur: 0,
      overlayColor: "rgba(0,0,0,1)",
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
  };

  const toggleAddOn = (item) => {
    const exists = formData.selectedAddOns.find(
      (i) => i.itemId === item.itemId
    );

    if (exists) {
      // Remove item
      updateFormData({
        selectedAddOns: formData.selectedAddOns.filter(
          (i) => i.itemId !== item.itemId
        ),
      });
    } else {
      // Add item
      updateFormData({
        selectedAddOns: [
          ...formData.selectedAddOns,
          {
            ...item,
            quantity: isQuantifiable(item) ? 1 : undefined,
          },
        ],
      });
    }
  };

  const updateAddOnQuantity = (itemId, quantity) => {
    updateFormData({
      selectedAddOns: formData.selectedAddOns.map((item) =>
        item.itemId === itemId ? { ...item, quantity } : item
      ),
    });
  };

  const removeAddOn = (itemId) => {
    updateFormData({
      selectedAddOns: formData.selectedAddOns.filter(
        (item) => item.itemId !== itemId
      ),
    });
  };

  const getAddOnsTotal = () => {
    return formData.selectedAddOns.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const getPackageTotal = () => {
    return formData.selectedItems.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
  };

  return (
    <div className="">
      <Text size="xl" fw={600} mb="md">
        Choose Add-ons
      </Text>

      <div className="grid grid-cols-3 gap-6">
        {/* Add-ons Selection */}
        <div className="col-span-2">
          {/* Filters */}
          <div className="filters flex gap-2 flex-wrap py-4">
            {filters.map((filterItem, index) => (
              <button
                key={index}
                className={`border rounded-3xl px-4 py-2 text-xs transition-colors ${
                  filter === filterItem
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:border-blue-300"
                }`}
                onClick={() => {
                  setFilter(filterItem);
                  setPage(1);
                }}
              >
                {filterItem}
              </button>
            ))}
          </div>

          {/* Add-ons Grid */}
          {loadingAddOns ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} height={200} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {addOns.map((addon) => {
                const isSelected = formData.selectedAddOns.some(
                  (item) => item.itemId === addon.itemId
                );

                return (
                  <Card key={addon.itemId} shadow="sm" withBorder>
                    <div className="space-y-3">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={
                            addon.photos?.[0]?.url ||
                            "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={addon.name}
                          fit="cover"
                        />
                        <div className="flex gap-1 absolute top-8 left-6">
                          <ActionIcon
                            onClick={() => openGallery(addon)}
                            color="blue"
                            variant="filled"
                            size="sm"
                          >
                            <IconPhoto size={16} />
                          </ActionIcon>
                          <ActionIcon
                            onClick={() => openVideos(addon)}
                            color="red"
                            variant="filled"
                            size="sm"
                          >
                            <IconVideo size={16} />
                          </ActionIcon>
                        </div>
                      </AspectRatio>

                      <div>
                        <Text fw={500} size="sm">
                          {addon.name}
                        </Text>
                        <Text fw={600} color="blue">
                          {formatter.format(addon.price)}
                        </Text>
                      </div>

                      <Button
                        fullWidth
                        size="sm"
                        color={isSelected ? "red" : "blue"}
                        onClick={() => toggleAddOn(addon)}
                      >
                        {isSelected ? "Remove" : "Add to Quote"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages}
              size="sm"
            />
          </div>
        </div>

        {/* Summary Panel */}
        <div className="border border-gray-300 rounded-xl p-4">
          <Title order={4} mb="md">
            Quote Summary
          </Title>

          <ScrollArea h={500}>
            {/* Package Total */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <Text fw={500}>Package Total:</Text>
              <Text fw={600} size="lg">
                {formatter.format(getPackageTotal())}
              </Text>
            </div>

            {/* Selected Add-ons */}
            <div>
              <Text fw={500} mb="sm">
                Selected Add-ons:
              </Text>

              {formData.selectedAddOns.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No add-ons selected
                </Text>
              ) : (
                <div className="space-y-3">
                  {formData.selectedAddOns.map((addon) => (
                    <Card key={addon.itemId} padding="sm" withBorder>
                      <div className="space-y-2">
                        <Text size="sm" fw={500}>
                          {addon.name}
                        </Text>

                        <Group position="apart">
                          {isQuantifiable(addon) ? (
                            <NumberInput
                              size="xs"
                              min={1}
                              value={addon.quantity}
                              onChange={(value) =>
                                updateAddOnQuantity(addon.itemId, value)
                              }
                              w={80}
                            />
                          ) : (
                            <Text size="xs">1 item</Text>
                          )}

                          <Text size="sm" fw={600}>
                            {formatter.format(
                              (addon.price || 0) * (addon.quantity || 1)
                            )}
                          </Text>
                        </Group>

                        <Button
                          size="xs"
                          color="red"
                          variant="outline"
                          fullWidth
                          onClick={() => removeAddOn(addon.itemId)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Totals */}
          <div className="border-t pt-4 mt-4">
            <Group position="apart" mb="xs">
              <Text fw={500}>Add-ons Total:</Text>
              <Text fw={600}>{formatter.format(getAddOnsTotal())}</Text>
            </Group>

            <Group position="apart">
              <Text fw={700}>Grand Total:</Text>
              <Text fw={700} size="lg">
                {formatter.format(getPackageTotal() + getAddOnsTotal())}
              </Text>
            </Group>
          </div>
        </div>
      </div>

      <Group position="apart" mt="xl">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next: Review & Confirm</Button>
      </Group>
    </div>
  );
};

export default AddOnsSelection;
