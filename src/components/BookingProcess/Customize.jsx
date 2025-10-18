import React, { useEffect, useState } from "react";
import axios from "axios";
import { Stepper, Group, Button, LoadingOverlay } from "@mantine/core";
import { queryClient } from "../../AxiosTanstack";
import PackageSelection from "./PackageSelection";
import EventDetailsForm from "./EventDetailsForm";
import PackageCustomization from "./PackageCustomization";
import MenuSelection from "./MenuSelection";
import AddOnsSelection from "./AddOnsSelection";
import ReviewSummary from "./ReviewSummary";
import { IconChevronRight } from "@tabler/icons-react";

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

const Customize = ({ quotation }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Form state shared across components
  const [formData, setFormData] = useState({
    requestedDate: null,
    eventType: "",
    celebrants: "",
    pax: 0,
    selectedVenue: null,
    customerName: "",
    contactNumber: "",
    address: "",
    bundles: [],
    selectedItems: [],
    selectedByCategory: {},
    groupedFoods: {},
    selectedAddOns: [],
  });

  useEffect(() => {
    const userData = queryClient.getQueryData(["currentUser"]);
    setUser(userData);
  }, []);

  const nextStep = () => setActiveStep((current) => Math.min(current + 1, 5));
  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetQuotationStates = () => {
    setFormData({
      requestedDate: null,
      eventType: "",
      celebrants: "",
      pax: 0,
      selectedVenue: null,
      customerName: "",
      contactNumber: "",
      address: "",
      bundles: [],
      selectedItems: [],
      selectedByCategory: {},
      groupedFoods: {},
      selectedAddOns: [],
    });
    setSelectedPackage(null);
    setActiveStep(0);
  };

  const handleSubmitQuotation = async () => {
    try {
      setLoading(true);

      const lineItems = [
        ...formData.selectedItems.map((item) => ({
          itemId: item.itemId,
          quantity: 1,
          description: item.name,
          priceAtQuotation: item.price,
        })),
        ...formData.selectedAddOns.map((addon) => ({
          itemId: addon.itemId,
          quantity: isQuantifiable(addon) ? addon.quantity || 1 : 1,
          description: addon.name,
          priceAtQuotation: addon.price,
        })),
      ];

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

      let response;
      if (quotation) {
        response = await axios.put(
          `http://localhost:8080/quotations/update/${quotation.quotationId}`,
          payload,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:8080/quotations",
          payload,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      notifications.show({
        title: "Success!",
        message: quotation
          ? "Quotation updated successfully"
          : "Quotation created successfully",
        color: "green",
      });

      resetQuotationStates();
      return response.data;
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Failed!",
        message: quotation
          ? "Quotation update failed"
          : "Quotation creation failed",
        color: "red",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: "Select Package",
      component: (
        <PackageSelection
          quotation={quotation}
          selectedPackage={selectedPackage}
          onPackageSelect={setSelectedPackage}
          onNext={nextStep}
        />
      ),
    },
    {
      label: "Event Details",
      component: (
        <EventDetailsForm
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onBack={prevStep}
          quotation={quotation}
        />
      ),
    },
    {
      label: "Customize Package",
      component: (
        <PackageCustomization
          packageData={selectedPackage}
          formData={formData}
          updateFormData={updateFormData}
          quotation={quotation}
          onNext={nextStep}
          onBack={prevStep}
        />
      ),
    },
    {
      label: "Select Menu",
      component: (
        <MenuSelection
          formData={formData}
          updateFormData={updateFormData}
          quotation={quotation}
          onNext={nextStep}
          onBack={prevStep}
        />
      ),
    },
    {
      label: "Choose Add-ons",
      component: (
        <AddOnsSelection
          formData={formData}
          updateFormData={updateFormData}
          quotation={quotation}
          onNext={nextStep}
          onBack={prevStep}
        />
      ),
    },
    {
      label: "Review & Confirm",
      component: (
        <ReviewSummary
          formData={formData}
          selectedPackage={selectedPackage}
          user={user}
          quotation={quotation}
          onBack={prevStep}
          onSubmit={handleSubmitQuotation}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <LoadingOverlay visible={loading} />

      {/* ===== Custom Breadcrumb Navigation ===== */}
      <Group
        spacing="xs"
        position="center"
        mb="md"
        style={{ flexWrap: "wrap" }}
      >
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const clickable = index <= activeStep;

          return (
            <React.Fragment key={index}>
              <button
                onClick={() => clickable && setActiveStep(index)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: clickable ? "pointer" : "default",
                  color: isActive
                    ? "#7c3aed"
                    : isCompleted
                    ? "#a855f7"
                    : "#6b7280",
                  fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                  fontSize: "15px",
                  textDecoration: isActive ? "underline" : "none",
                  textUnderlineOffset: "4px",
                  transition: "color 0.2s ease, transform 0.2s ease",
                }}
              >
                {step.label}
              </button>

              {/* separator */}
              {index < steps.length - 1 && (
                <span
                  style={{
                    margin: "0 8px",
                    color: "#9ca3af",
                    fontSize: "14px",
                    userSelect: "none",
                  }}
                >
                  <IconChevronRight />
                </span>
              )}
            </React.Fragment>
          );
        })}
      </Group>

      {/* ===== Mantine Stepper for Content ===== */}
      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
        styles={{
          stepWrapper: { display: "none" },
          separator: { display: "none" },
        }}
      >
        {steps.map((step, index) => (
          <Stepper.Step key={index}>{step.component}</Stepper.Step>
        ))}
      </Stepper>
    </div>
  );
};

export default Customize;
