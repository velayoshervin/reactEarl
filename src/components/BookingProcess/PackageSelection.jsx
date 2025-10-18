// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   Image,
//   Text,
//   Button,
//   Group,
//   Loader,
//   SimpleGrid,
// } from "@mantine/core";

// const formatter = new Intl.NumberFormat("en-PH", {
//   style: "currency",
//   currency: "PHP",
// });

// const PackageSelection = ({
//   quotation,
//   selectedPackage,
//   onPackageSelect,
//   onNext,
// }) => {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           "http://localhost:8080/public/api/packages"
//         );
//         setPackages(res.data);

//         // Auto-select package if editing quotation
//         if (quotation) {
//           const pkg = res.data.find((p) => p.packageId === quotation.packageId);
//           if (pkg) onPackageSelect(pkg);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPackages();
//   }, [quotation, onPackageSelect]);

//   if (loading) {
//     return (
//       <div className="flex justify-center py-8">
//         <Loader size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <Text size="xl" fw={600} mb="md">
//         Select a Package
//       </Text>

//       <SimpleGrid cols={3} spacing="lg">
//         {packages.map((pkg) => (
//           <Card
//             key={pkg.packageId}
//             shadow="sm"
//             padding="lg"
//             radius="md"
//             withBorder
//             className={`cursor-pointer transition-all ${
//               selectedPackage?.packageId === pkg.packageId
//                 ? "ring-2 ring-blue-500 border-blue-500"
//                 : "hover:shadow-md"
//             }`}
//             onClick={() => onPackageSelect(pkg)}
//           >
//             <Card.Section>
//               <Image
//                 src={
//                   pkg.imageUrl ||
//                   "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
//                 }
//                 height={160}
//                 alt={pkg.packageName}
//               />
//             </Card.Section>

//             <Group position="apart" mt="md" mb="xs">
//               <Text fw={500}>{pkg.packageName}</Text>
//             </Group>

//             <Text size="sm" c="dimmed" lineClamp={3}>
//               {pkg.description || "No description available"}
//             </Text>

//             <Text fw={600} size="lg" mt="sm">
//               {formatter.format(pkg.price || 0)}
//             </Text>

//             <Button
//               fullWidth
//               mt="md"
//               radius="md"
//               variant={
//                 selectedPackage?.packageId === pkg.packageId
//                   ? "filled"
//                   : "outline"
//               }
//             >
//               {selectedPackage?.packageId === pkg.packageId
//                 ? "Selected"
//                 : "Select Package"}
//             </Button>
//           </Card>
//         ))}
//       </SimpleGrid>

//       <Group position="right" mt="xl">
//         <Button onClick={onNext} disabled={!selectedPackage} size="lg">
//           Next: Event Details
//         </Button>
//       </Group>
//     </div>
//   );
// };

// export default PackageSelection;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Image,
  Text,
  Button,
  Group,
  Loader,
  ScrollArea,
  Accordion,
  Stack,
  Grid,
  Badge,
  List,
} from "@mantine/core";

const formatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const PackageSelection = ({
  quotation,
  selectedPackage,
  onPackageSelect,
  onNext,
}) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredPackage, setHoveredPackage] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8080/public/api/packages"
        );
        setPackages(res.data);

        // Auto-select package if editing quotation
        if (quotation) {
          const pkg = res.data.find((p) => p.packageId === quotation.packageId);
          if (pkg) onPackageSelect(pkg);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [quotation, onPackageSelect]);

  const togglePackageSelect = (pkg) => {
    if (selectedPackage?.packageId === pkg.packageId) {
      // Deselect if already selected
      onPackageSelect(null);
    } else {
      // Select new package
      onPackageSelect(pkg);
    }
  };

  const getDisplayPackage = () => {
    return hoveredPackage || selectedPackage;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <Text size="xl" fw={600} mb="md">
        Select a Package
      </Text>

      <Grid gutter="xl">
        {/* Package Inclusions Panel - Left Side */}
        <Grid.Col span={4}>
          <Card
            shadow="sm"
            padding="lg"
            withBorder
            className="sticky top-4 h-fit"
          >
            <Text size="lg" fw={600} mb="md" align="center">
              Package Inclusions
            </Text>

            {getDisplayPackage() ? (
              <ScrollArea h={600}>
                <div className="space-y-4">
                  {/* Package Header */}
                  <div className="text-center">
                    <Text fw={700} size="xl" color="blue">
                      {getDisplayPackage().packageName}
                    </Text>
                    <Text size="sm" c="dimmed" mt={4}>
                      {getDisplayPackage().description}
                    </Text>
                    <Badge color="blue" size="lg" mt="sm" variant="filled">
                      {formatter.format(getDisplayPackage().price || 0)}
                    </Badge>
                  </div>

                  {/* Bundles and Items */}
                  <div className="space-y-4">
                    {getDisplayPackage().packageBundles?.map((bundle) => (
                      <Card
                        key={bundle.packageBundleId}
                        withBorder
                        padding="sm"
                        radius="md"
                      >
                        <Text fw={600} size="sm" mb="xs" color="green">
                          {bundle.name}
                        </Text>
                        <List
                          size="sm"
                          spacing="xs"
                          icon={
                            <Text size="xs" color="green">
                              •
                            </Text>
                          }
                        >
                          {bundle.items.map((item) => (
                            <List.Item key={item.itemId}>
                              <Group position="apart">
                                <Text size="sm">{item.name}</Text>
                                <Badge size="xs" color="gray" variant="outline">
                                  {formatter.format(item.price)}
                                </Badge>
                              </Group>
                            </List.Item>
                          ))}
                        </List>
                      </Card>
                    ))}
                  </div>

                  {/* Total Items Count */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Text size="sm" fw={500} align="center">
                      Total Items:{" "}
                      {getDisplayPackage().packageBundles?.reduce(
                        (total, bundle) => total + bundle.items.length,
                        0
                      ) || 0}
                    </Text>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                <Text size="sm" c="dimmed">
                  {hoveredPackage
                    ? "Hover over a package to view inclusions"
                    : "Select a package to view inclusions"}
                </Text>
                <Text size="xs" c="dimmed" mt="sm">
                  Or click on a package to select it
                </Text>
              </div>
            )}
          </Card>
        </Grid.Col>

        {/* Package Selection Grid - Right Side */}
        <Grid.Col span={8}>
          <div className="grid grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.packageId}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className={`cursor-pointer transition-all ${
                  selectedPackage?.packageId === pkg.packageId
                    ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50"
                    : hoveredPackage?.packageId === pkg.packageId
                    ? "ring-1 ring-blue-300 border-blue-300 bg-blue-25"
                    : "hover:shadow-md border-gray-200"
                }`}
                onMouseEnter={() => setHoveredPackage(pkg)}
                onMouseLeave={() => {
                  if (hoveredPackage?.packageId === pkg.packageId) {
                    setHoveredPackage(null);
                  }
                }}
                onClick={() => togglePackageSelect(pkg)}
              >
                <Card.Section>
                  <Image
                    src={
                      pkg.imageUrl ||
                      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
                    }
                    height={160}
                    alt={pkg.packageName}
                  />
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text fw={500}>{pkg.packageName}</Text>
                  {selectedPackage?.packageId === pkg.packageId && (
                    <Badge color="green" size="sm">
                      Selected
                    </Badge>
                  )}
                </Group>

                <Text size="sm" c="dimmed" lineClamp={2} mb="xs">
                  {pkg.description || "No description available"}
                </Text>

                {/* Quick Stats */}
                <Group spacing="xs" mb="sm">
                  <Badge size="xs" color="blue" variant="light">
                    {pkg.packageBundles?.length || 0} bundles
                  </Badge>
                  <Badge size="xs" color="grape" variant="light">
                    {pkg.packageBundles?.reduce(
                      (total, bundle) => total + bundle.items.length,
                      0
                    ) || 0}{" "}
                    items
                  </Badge>
                </Group>

                <Text fw={600} size="lg" color="blue">
                  {formatter.format(pkg.price || 0)}
                </Text>

                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  variant={
                    selectedPackage?.packageId === pkg.packageId
                      ? "filled"
                      : "outline"
                  }
                  color={
                    selectedPackage?.packageId === pkg.packageId
                      ? "red"
                      : "blue"
                  }
                >
                  {selectedPackage?.packageId === pkg.packageId
                    ? "Deselect Package"
                    : "Select Package"}
                </Button>
              </Card>
            ))}
          </div>

          {/* Next Button */}
          {selectedPackage && (
            <Group position="right" mt="xl">
              <Button onClick={onNext} size="lg" color="green">
                Continue with {selectedPackage.packageName} →
              </Button>
            </Group>
          )}
        </Grid.Col>
      </Grid>

      {/* Bottom Next Button for mobile */}
      <div className="block md:hidden mt-6">
        <Group position="right">
          <Button
            onClick={onNext}
            disabled={!selectedPackage}
            size="lg"
            fullWidth
          >
            Next: Event Details
          </Button>
        </Group>
      </div>
    </div>
  );
};

export default PackageSelection;
