import React from "react";
import {
  Text,
  Card,
  Group,
  Button,
  ScrollArea,
  Title,
  Stack,
  NumberInput,
} from "@mantine/core";
import dayjs from "dayjs";
import axios from "axios";
import { notifications } from "@mantine/notifications";

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

const ReviewSummary = ({
  formData,
  selectedPackage,
  user,
  quotation,
  onBack,
  onSubmit,
  loading,
}) => {
  const getPackageTotal = () => {
    return formData.selectedItems.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
  };

  const getAddOnsTotal = () => {
    return formData.selectedAddOns.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const getGrandTotal = () => {
    return getPackageTotal() + getAddOnsTotal();
  };

  const handleSubmit = async () => {
    try {
      // Prepare line items
      const lineItems = [
        // Package items
        ...formData.selectedItems.map((item) => ({
          itemId: item.itemId,
          quantity: 1,
          description: item.name,
          priceAtQuotation: item.price,
        })),
        // Add-on items
        ...formData.selectedAddOns.map((addon) => ({
          itemId: addon.itemId,
          quantity: isQuantifiable(addon) ? addon.quantity || 1 : 1,
          description: addon.name,
          priceAtQuotation: addon.price,
        })),
      ];

      // Prepare custom food items
      const customFoodByCategory = {};
      Object.entries(formData.selectedByCategory).forEach(
        ([category, selectedFoodIds]) => {
          if (selectedFoodIds.length > 0) {
            customFoodByCategory[category] = selectedFoodIds.map((foodId) => {
              const foodItem = formData.groupedFoods[category]?.find(
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

      // Construct payload
      const payload = {
        userId: user?.userId,
        eventDate: formData.requestedDate,
        eventType: formData.eventType,
        pax: formData.pax,
        venueId: formData.selectedVenue
          ? parseInt(formData.selectedVenue)
          : null,
        celebrants: formData.celebrants,
        customerName: formData.customerName,
        contactNumber: formData.contactNumber,
        address: formData.address,
        lineItems: lineItems,
        customFoodByCategory: customFoodByCategory,
        packageId: selectedPackage.packageId,
      };

      console.log("Submitting payload:", payload);

      let response;

      if (quotation) {
        // Update existing quotation
        response = await axios.put(
          `http://localhost:8080/quotations/update/${quotation.quotationId}`,
          payload,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // Create new quotation
        response = await axios.post(
          "http://localhost:8080/quotations",
          payload,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Show success notification
      notifications.show({
        title: "Success!",
        message: quotation
          ? "Quotation updated successfully"
          : "Quotation created successfully",
        color: "green",
      });

      // Call the onSubmit prop
      onSubmit(response.data);
    } catch (error) {
      console.error("Submission error:", error);
      notifications.show({
        title: "Failed!",
        message: quotation
          ? "Quotation update failed"
          : "Quotation creation failed",
        color: "red",
      });
    }
  };

  return (
    <div className="">
      <Text size="xl" fw={600} mb="md">
        Review Your Quotation
      </Text>

      <div className="grid grid-cols-2 gap-6">
        {/* Event Details */}
        <Card shadow="sm" padding="lg" withBorder>
          <Title order={3} mb="md">
            Event Details
          </Title>
          <Stack spacing="sm">
            <Group position="apart">
              <Text fw={500}>Package:</Text>
              <Text>{selectedPackage?.packageName || "N/A"}</Text>
            </Group>
            <Group position="apart">
              <Text fw={500}>Date:</Text>
              <Text>
                {formData.requestedDate
                  ? dayjs(formData.requestedDate).format("ddd, MMM D, YYYY")
                  : "N/A"}
              </Text>
            </Group>
            <Group position="apart">
              <Text fw={500}>Event Type:</Text>
              <Text>{formData.eventType || "N/A"}</Text>
            </Group>
            <Group position="apart">
              <Text fw={500}>Guests:</Text>
              <Text>{formData.pax || "N/A"}</Text>
            </Group>
            <Group position="apart">
              <Text fw={500}>Celebrant/s:</Text>
              <Text>{formData.celebrants || "N/A"}</Text>
            </Group>
            <Group position="apart">
              <Text fw={500}>Customer:</Text>
              <Text>{formData.customerName || "N/A"}</Text>
            </Group>
            <Group position="apart">
              <Text fw={500}>Contact:</Text>
              <Text>
                {formData.contactNumber
                  ? `+639${formData.contactNumber}`
                  : "N/A"}
              </Text>
            </Group>
            <div>
              <Text fw={500} mb="xs">
                Address:
              </Text>
              <Text size="sm">{formData.address || "N/A"}</Text>
            </div>
          </Stack>
        </Card>

        {/* Order Summary */}
        <Card shadow="sm" padding="lg" withBorder>
          <Title order={3} mb="md">
            Order Summary
          </Title>

          <ScrollArea h={400}>
            <Stack spacing="md">
              {/* Package Items */}
              {formData.selectedItems.length > 0 && (
                <div>
                  <Text fw={600} size="sm" mb="sm">
                    Package Items:
                  </Text>
                  <Stack spacing="xs">
                    {formData.selectedItems.map((item) => (
                      <Group key={item.itemId} position="apart">
                        <Text size="sm">{item.name}</Text>
                        <Text size="sm" fw={500}>
                          {formatter.format(item.price)}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </div>
              )}

              {/* Add-ons */}
              {formData.selectedAddOns.length > 0 && (
                <div>
                  <Text fw={600} size="sm" mb="sm">
                    Add-ons:
                  </Text>
                  <Stack spacing="xs">
                    {formData.selectedAddOns.map((addon) => (
                      <Group key={addon.itemId} position="apart">
                        <div>
                          <Text size="sm">{addon.name}</Text>
                          {isQuantifiable(addon) && (
                            <Text size="xs" c="dimmed">
                              Qty: {addon.quantity}
                            </Text>
                          )}
                        </div>
                        <Text size="sm" fw={500}>
                          {formatter.format(
                            (addon.price || 0) * (addon.quantity || 1)
                          )}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </div>
              )}

              {/* Food Selection Summary */}
              {Object.keys(formData.selectedByCategory).some(
                (category) => formData.selectedByCategory[category]?.length > 0
              ) && (
                <div>
                  <Text fw={600} size="sm" mb="sm">
                    Selected Menu:
                  </Text>
                  {Object.entries(formData.selectedByCategory)
                    .filter(([_, items]) => items.length > 0)
                    .map(([category, items]) => (
                      <div key={category} className="mb-2">
                        <Text
                          size="xs"
                          fw={500}
                          c="blue"
                          className="capitalize"
                        >
                          {category}:
                        </Text>
                        <Text size="xs" c="dimmed">
                          {items.length} items selected
                        </Text>
                      </div>
                    ))}
                </div>
              )}
            </Stack>
          </ScrollArea>

          {/* Totals */}
          <div className="border-t pt-4 mt-4">
            <Group position="apart" mb="xs">
              <Text fw={500}>Package Total:</Text>
              <Text>{formatter.format(getPackageTotal())}</Text>
            </Group>
            <Group position="apart" mb="xs">
              <Text fw={500}>Add-ons Total:</Text>
              <Text>{formatter.format(getAddOnsTotal())}</Text>
            </Group>
            <Group position="apart" className="border-t pt-2">
              <Text fw={700} size="lg">
                Grand Total:
              </Text>
              <Text fw={700} size="lg">
                {formatter.format(getGrandTotal())}
              </Text>
            </Group>
          </div>
        </Card>
      </div>

      <Group position="apart" mt="xl">
        <Button variant="default" onClick={onBack} size="lg">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          loading={loading}
          size="lg"
          color="green"
        >
          {quotation ? "Update Quotation" : "Create Quotation"}
        </Button>
      </Group>
    </div>
  );
};

export default ReviewSummary;
