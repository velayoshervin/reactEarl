import React, { useEffect, useState } from "react";
import {
  Accordion,
  Checkbox,
  Group,
  Text,
  Stack,
  ScrollArea,
  Card,
  Button,
} from "@mantine/core";

const formatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const PackageCustomization = ({
  packageData,
  formData,
  updateFormData,
  quotation,
  onNext,
  onBack,
}) => {
  const [bundles, setBundles] = useState([]);

  useEffect(() => {
    if (!packageData?.packageBundles) return;

    const initializedBundles = packageData.packageBundles.map((bundle) => {
      const bundleItems = bundle.items.map((item) => {
        const isSelected =
          quotation?.lineItems?.some((li) => li.item.itemId === item.itemId) ??
          true;

        return { ...item, selected: isSelected };
      });

      const isBundleSelected = bundleItems.some((i) => i.selected);

      return {
        ...bundle,
        selected: isBundleSelected,
        items: bundleItems,
      };
    });

    setBundles(initializedBundles);
  }, [packageData, quotation]);

  // Update selected items whenever bundles change
  useEffect(() => {
    const selectedFromBundles = bundles.flatMap((bundle) =>
      bundle.items
        .filter((item) => item.selected)
        .map((item) => ({
          ...item,
          bundleName: bundle.name,
          source: "bundle",
        }))
    );

    updateFormData({ selectedItems: selectedFromBundles });
  }, [bundles, updateFormData]);

  const toggleBundle = (bundleId) => {
    setBundles((prev) =>
      prev.map((bundle) =>
        bundle.packageBundleId === bundleId
          ? {
              ...bundle,
              selected: !bundle.selected,
              items: bundle.items.map((item) => ({
                ...item,
                selected: !bundle.selected,
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

  const getSelectedItemsTotal = () => {
    return formData.selectedItems.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
  };

  const removeItem = (itemId) => {
    setBundles((prev) =>
      prev.map((bundle) => ({
        ...bundle,
        items: bundle.items.map((item) =>
          item.itemId === itemId ? { ...item, selected: false } : item
        ),
      }))
    );
  };

  return (
    <div className="">
      <Text size="xl" fw={600} mb="md">
        Customize Your Package
      </Text>

      <div className="grid grid-cols-3 gap-6">
        {/* Bundles Selection */}
        <div className="col-span-2">
          <Accordion variant="separated">
            {bundles.map((bundle) => (
              <Accordion.Item key={bundle.packageBundleId} value={bundle.name}>
                <Accordion.Control>
                  <Group position="apart">
                    <Checkbox
                      checked={bundle.selected}
                      size="sm"
                      onChange={() => toggleBundle(bundle.packageBundleId)}
                    />
                    <Text fw={500}>{bundle.name}</Text>
                  </Group>
                </Accordion.Control>

                <Accordion.Panel>
                  <Stack spacing="sm">
                    {bundle.items.map((item) => (
                      <Group
                        key={item.itemId}
                        position="apart"
                        style={{
                          opacity: bundle.selected ? 1 : 0.5,
                          marginLeft: "12px",
                        }}
                      >
                        <Checkbox
                          size="sm"
                          checked={item.selected}
                          disabled={!bundle.selected}
                          onChange={() =>
                            toggleItem(bundle.packageBundleId, item.itemId)
                          }
                        />
                        <Text fz="sm" className="flex-1">
                          {item.name}
                        </Text>
                        <Text fz="sm" fw={500}>
                          {formatter.format(item.price)}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        {/* Summary Panel */}
        <div className="border border-gray-300 rounded-xl p-4">
          <Text fw={600} size="lg" mb="md">
            Package Summary
          </Text>

          <ScrollArea h={400}>
            {formData.selectedItems.length === 0 ? (
              <Text c="dimmed" size="sm">
                No items selected
              </Text>
            ) : (
              <Stack spacing="xs">
                {formData.selectedItems.map((item) => (
                  <Card key={item.itemId} padding="sm" withBorder>
                    <Group position="apart">
                      <div>
                        <Text size="sm" fw={500}>
                          {item.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {item.bundleName}
                        </Text>
                      </div>
                      <Button
                        size="xs"
                        color="red"
                        variant="outline"
                        onClick={() => removeItem(item.itemId)}
                      >
                        Remove
                      </Button>
                    </Group>
                    <Text size="sm" fw={600} mt="xs">
                      {formatter.format(item.price)}
                    </Text>
                  </Card>
                ))}
              </Stack>
            )}
          </ScrollArea>

          <div className="border-t pt-4 mt-4">
            <Group position="apart">
              <Text fw={600}>Total:</Text>
              <Text fw={700} size="lg">
                {formatter.format(getSelectedItemsTotal())}
              </Text>
            </Group>
            <Text size="sm" c="dimmed" mt="xs">
              {formData.selectedItems.length} items selected
            </Text>
          </div>
        </div>
      </div>

      <Group position="apart" mt="xl">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next: Select Menu</Button>
      </Group>
    </div>
  );
};

export default PackageCustomization;
