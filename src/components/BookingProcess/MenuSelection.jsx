// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   Select,
// //   MultiSelect,
// //   Text,
// //   Card,
// //   Image,
// //   AspectRatio,
// //   ScrollArea,
// //   Title,
// //   Group,
// //   Button,
// // } from "@mantine/core";

// // const MenuSelection = ({
// //   formData,
// //   updateFormData,
// //   quotation,
// //   onNext,
// //   onBack,
// // }) => {
// //   const [foods, setFoods] = useState([]);
// //   const [activeCategory, setActiveCategory] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   // FoodItem component for display
// //   const FoodItem = ({ data }) => (
// //     <Group>
// //       <Avatar src={data.imageUrl || null} size="md" radius="sm" />
// //       <div>
// //         <Text size="sm" fw={500}>
// //           {data.label}
// //         </Text>
// //         <Text size="xs" c="dimmed" lineClamp={1}>
// //           {data.description}
// //         </Text>
// //       </div>
// //     </Group>
// //   );

// //   useEffect(() => {
// //     if (quotation?.customFoodByCategory) {
// //       console.log(
// //         "Loading saved food selections:",
// //         quotation.customFoodByCategory
// //       );
// //       const savedSelections = {};

// //       Object.entries(quotation.customFoodByCategory).forEach(
// //         ([category, items]) => {
// //           savedSelections[category] = items.map((item) =>
// //             item.itemId.toString()
// //           );
// //         }
// //       );

// //       updateFormData({ selectedByCategory: savedSelections });
// //     }
// //   }, [quotation, updateFormData]);

// //   useEffect(() => {
// //     const fetchFoods = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await axios.get(
// //           "http://localhost:8080/public/api/items/food",
// //           {
// //             withCredentials: true,
// //           }
// //         );

// //         setFoods(res.data);

// //         // Group foods by category
// //         const grouped = res.data.reduce((acc, item) => {
// //           const category = item.category?.toLowerCase() || "uncategorized";
// //           if (!acc[category]) acc[category] = [];

// //           acc[category].push({
// //             value: item.itemId.toString(),
// //             label: item.name,
// //             description: item.description,
// //             imageUrl: item.photos?.[0]?.url,
// //             photos: item.photos,
// //           });

// //           return acc;
// //         }, {});

// //         updateFormData({ groupedFoods: grouped });
// //       } catch (error) {
// //         console.error("Error fetching foods:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchFoods();
// //   }, [updateFormData]);

// //   const handleSelect = (category, values) => {
// //     updateFormData({
// //       selectedByCategory: {
// //         ...formData.selectedByCategory,
// //         [category]: values,
// //       },
// //     });
// //   };

// //   const getSummary = () => {
// //     try {
// //       if (
// //         !formData.selectedByCategory ||
// //         typeof formData.selectedByCategory !== "object"
// //       ) {
// //         return [];
// //       }

// //       return Object.entries(formData.selectedByCategory)
// //         .filter(([category, values]) => {
// //           return (
// //             Array.isArray(values) &&
// //             values.length > 0 &&
// //             formData.groupedFoods &&
// //             formData.groupedFoods[category] &&
// //             Array.isArray(formData.groupedFoods[category])
// //           );
// //         })
// //         .map(([category, values]) => ({
// //           category,
// //           items: (formData.groupedFoods[category] || [])
// //             .filter((f) => f && f.value && values.includes(f.value))
// //             .filter(Boolean),
// //         }))
// //         .filter(({ items }) => items && items.length > 0);
// //     } catch (error) {
// //       console.error("Error in getSummary:", error);
// //       return [];
// //     }
// //   };

// //   const summary = getSummary();

// //   return (
// //     <div className="py-6">
// //       <Text size="xl" fw={600} mb="md">
// //         Select Your Menu
// //       </Text>

// //       <div className="grid grid-cols-3 gap-6">
// //         {/* Selection Panel */}
// //         <div className="space-y-4">
// //           <div>
// //             <Text size="sm" fw={500} mb="xs">
// //               Select Food Category
// //             </Text>
// //             <Select
// //               placeholder="Choose a category"
// //               value={activeCategory}
// //               onChange={setActiveCategory}
// //               data={Object.keys(formData.groupedFoods).map((c) => ({
// //                 value: c,
// //                 label: c.toUpperCase(),
// //               }))}
// //             />
// //           </div>

// //           {activeCategory && (
// //             <div>
// //               <Text size="sm" fw={500} mb="xs">
// //                 Select {activeCategory.toUpperCase()} Dishes
// //               </Text>
// //               <MultiSelect
// //                 placeholder={`Choose ${activeCategory} dishes`}
// //                 data={formData.groupedFoods[activeCategory] || []}
// //                 value={formData.selectedByCategory[activeCategory] || []}
// //                 onChange={(values) => handleSelect(activeCategory, values)}
// //                 searchable
// //                 clearable
// //                 itemComponent={FoodItem}
// //                 nothingFound="No items found"
// //               />
// //             </div>
// //           )}
// //         </div>

// //         {/* Summary Panel */}
// //         <div className="col-span-2 border border-gray-300 rounded-lg p-4">
// //           <Title order={4} mb="md">
// //             Selected Food Summary
// //           </Title>

// //           <ScrollArea h={500}>
// //             {summary.length === 0 ? (
// //               <Text size="sm" c="dimmed" align="center" py="xl">
// //                 No food items selected yet
// //               </Text>
// //             ) : (
// //               <div className="space-y-6">
// //                 {summary.map(({ category, items }) => (
// //                   <div key={category}>
// //                     <Text fw={600} size="lg" mb="sm" className="capitalize">
// //                       {category}
// //                     </Text>
// //                     <div className="grid grid-cols-2 gap-3">
// //                       {items.map((item) => (
// //                         <Card
// //                           key={item.value}
// //                           shadow="sm"
// //                           padding="sm"
// //                           withBorder
// //                         >
// //                           <Group>
// //                             <AspectRatio ratio={1} w={80}>
// //                               <Image
// //                                 src={
// //                                   item.photos?.[0]?.url ||
// //                                   "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
// //                                 }
// //                                 alt={item.label}
// //                                 radius="sm"
// //                               />
// //                             </AspectRatio>
// //                             <div className="flex-1">
// //                               <Text size="sm" fw={500}>
// //                                 {item.label}
// //                               </Text>
// //                               <Text size="xs" c="dimmed" lineClamp={2}>
// //                                 {item.description}
// //                               </Text>
// //                             </div>
// //                           </Group>
// //                         </Card>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </ScrollArea>
// //         </div>
// //       </div>

// //       <Group position="apart" mt="xl">
// //         <Button variant="default" onClick={onBack}>
// //           Back
// //         </Button>
// //         <Button onClick={onNext}>Next: Choose Add-ons</Button>
// //       </Group>
// //     </div>
// //   );
// // };

// // export default MenuSelection;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Select,
//   MultiSelect,
//   Text,
//   Card,
//   Image,
//   AspectRatio,
//   ScrollArea,
//   Title,
//   Group,
//   Button,
//   SimpleGrid,
//   Badge,
//   Alert,
//   Loader,
//   Avatar,
//   Grid,
//   Modal,
// } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";

// const MenuSelection = ({
//   formData,
//   updateFormData,
//   quotation,
//   onNext,
//   onBack,
// }) => {
//   const [menuBundles, setMenuBundles] = useState([]);
//   const [foods, setFoods] = useState([]);
//   const [groupedFoods, setGroupedFoods] = useState({});
//   const [activeCategory, setActiveCategory] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [bundleLoading, setBundleLoading] = useState(false);
//   const [selectedBundle, setSelectedBundle] = useState(null);
//   const [
//     changeBundleModalOpened,
//     { open: openChangeBundleModal, close: closeChangeBundleModal },
//   ] = useDisclosure(false);
//   const [newBundle, setNewBundle] = useState(null);

//   // FoodItem component for display
//   const FoodItem = ({ data }) => (
//     <Group>
//       <Avatar src={data.imageUrl || null} size="md" radius="sm" />
//       <div>
//         <Text size="sm" fw={500}>
//           {data.label}
//         </Text>
//         <Text size="xs" c="dimmed" lineClamp={1}>
//           {data.description}
//         </Text>
//       </div>
//     </Group>
//   );

//   // Fetch menu bundles - RUNS ONLY ONCE
//   useEffect(() => {
//     const fetchMenuBundles = async () => {
//       setBundleLoading(true);
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/api/menu-bundle",
//           { withCredentials: true }
//         );
//         setMenuBundles(response.data);
//       } catch (err) {
//         console.error("Failed to fetch menu bundles", err);
//       } finally {
//         setBundleLoading(false);
//       }
//     };
//     fetchMenuBundles();
//   }, []);

//   // Fetch foods - RUNS ONLY ONCE
//   useEffect(() => {
//     const fetchFoods = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           "http://localhost:8080/public/api/items/food"
//           // Remove withCredentials for public endpoint to avoid 403
//         );

//         setFoods(res.data);

//         // Group foods by category
//         const grouped = res.data.reduce((acc, item) => {
//           const category = item.category?.toLowerCase() || "uncategorized";
//           if (!acc[category]) acc[category] = [];

//           acc[category].push({
//             value: item.itemId.toString(),
//             label: item.name,
//             description: item.description,
//             imageUrl: item.photos?.[0]?.url,
//             photos: item.photos,
//           });

//           return acc;
//         }, {});

//         setGroupedFoods(grouped);
//       } catch (error) {
//         console.error("Error fetching foods:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFoods();
//   }, []); // Empty dependency array - runs only once

//   // Load existing data when editing quotation
//   useEffect(() => {
//     if (quotation) {
//       console.log("Editing quotation:", quotation);

//       // Load selected bundle if exists
//       if (quotation.selectedMenuBundle) {
//         setSelectedBundle(quotation.selectedMenuBundle);
//         console.log("Loaded existing bundle:", quotation.selectedMenuBundle);
//       }

//       // Load existing food selections from customFoodSelection
//       if (quotation.customFoodSelection) {
//         try {
//           const existingSelections = JSON.parse(quotation.customFoodSelection);
//           updateFormData({ selectedByCategory: existingSelections });
//           console.log("Loaded existing food selections:", existingSelections);
//         } catch (e) {
//           console.error("Failed to parse existing food selections", e);
//         }
//       }
//     }
//   }, [quotation]); // Remove updateFormData from dependencies

//   const handleBundleSelect = (bundle) => {
//     if (
//       selectedBundle &&
//       formData.selectedByCategory &&
//       Object.keys(formData.selectedByCategory).length > 0
//     ) {
//       // If changing bundle with existing selections, show confirmation
//       setNewBundle(bundle);
//       openChangeBundleModal();
//     } else {
//       // First time selection or no existing selections
//       setSelectedBundle(bundle);
//       updateFormData({
//         selectedMenuBundle: bundle,
//         selectedByCategory: {}, // Reset selections when bundle changes
//       });
//     }
//   };

//   const confirmBundleChange = () => {
//     setSelectedBundle(newBundle);
//     updateFormData({
//       selectedMenuBundle: newBundle,
//       selectedByCategory: {}, // Clear previous selections
//     });
//     closeChangeBundleModal();
//     setNewBundle(null);
//   };

//   const handleSelect = (category, values) => {
//     updateFormData({
//       selectedByCategory: {
//         ...formData.selectedByCategory,
//         [category]: values,
//       },
//     });
//   };

//   // Validate if current selections meet bundle requirements
//   const validateSelections = () => {
//     if (!selectedBundle) return true; // No bundle selected yet

//     const requirements = {
//       beef: selectedBundle.beefOptions,
//       pork: selectedBundle.porkOptions,
//       chicken: selectedBundle.chickenOptions,
//       fish: selectedBundle.fishOptions,
//       vegetable: selectedBundle.vegetableOptions,
//       pasta: selectedBundle.pastaOptions,
//       dessert: selectedBundle.dessertOptions,
//       soup: selectedBundle.soupOptions,
//       juice: selectedBundle.juiceOptions,
//     };

//     return Object.entries(requirements).every(([category, required]) => {
//       if (required === 0) return true; // No requirement for this category
//       const selectedCount = (formData.selectedByCategory?.[category] || [])
//         .length;
//       return selectedCount === required;
//     });
//   };

//   const isSelectionComplete = validateSelections();

//   const getSummary = () => {
//     try {
//       if (
//         !formData.selectedByCategory ||
//         typeof formData.selectedByCategory !== "object"
//       ) {
//         return [];
//       }

//       return Object.entries(formData.selectedByCategory)
//         .filter(([category, values]) => {
//           return (
//             Array.isArray(values) &&
//             values.length > 0 &&
//             groupedFoods &&
//             groupedFoods[category] &&
//             Array.isArray(groupedFoods[category])
//           );
//         })
//         .map(([category, values]) => ({
//           category,
//           items: (groupedFoods[category] || [])
//             .filter((f) => f && f.value && values.includes(f.value))
//             .filter(Boolean),
//         }))
//         .filter(({ items }) => items && items.length > 0);
//     } catch (error) {
//       console.error("Error in getSummary:", error);
//       return [];
//     }
//   };

//   const summary = getSummary();

//   const getCategoryProgress = (category) => {
//     if (!selectedBundle) return { current: 0, required: 0 };

//     const requirements = {
//       beef: selectedBundle.beefOptions,
//       pork: selectedBundle.porkOptions,
//       chicken: selectedBundle.chickenOptions,
//       fish: selectedBundle.fishOptions,
//       vegetable: selectedBundle.vegetableOptions,
//       pasta: selectedBundle.pastaOptions,
//       dessert: selectedBundle.dessertOptions,
//       soup: selectedBundle.soupOptions,
//       juice: selectedBundle.juiceOptions,
//     };

//     const current = (formData.selectedByCategory?.[category] || []).length;
//     const required = requirements[category] || 0;

//     return { current, required };
//   };

//   return (
//     <div className="py-6">
//       <Text size="xl" fw={600} mb="md">
//         {quotation ? "Edit Your Menu" : "Select Your Menu"}
//       </Text>

//       {/* Menu Bundle Selection */}
//       <Card shadow="sm" padding="lg" mb="md" withBorder>
//         <Text fw={600} size="lg" mb="sm">
//           Choose a Menu Package
//         </Text>
//         <Text size="sm" c="dimmed" mb="md">
//           Select a pre-defined menu bundle that fits your event
//         </Text>

//         {bundleLoading ? (
//           <Loader size="sm" />
//         ) : (
//           <SimpleGrid
//             cols={3}
//             breakpoints={[
//               { maxWidth: "lg", cols: 2 },
//               { maxWidth: "sm", cols: 1 },
//             ]}
//           >
//             {menuBundles.map((bundle) => (
//               <Card
//                 key={bundle.menuBundleId}
//                 shadow="sm"
//                 padding="md"
//                 withBorder
//                 className={`cursor-pointer transition-all ${
//                   selectedBundle?.menuBundleId === bundle.menuBundleId
//                     ? "border-blue-500 border-2 bg-blue-50"
//                     : "hover:border-gray-300"
//                 }`}
//                 onClick={() => handleBundleSelect(bundle)}
//               >
//                 <Group position="apart" mb="xs">
//                   <Text fw={600}>{bundle.name}</Text>
//                   {selectedBundle?.menuBundleId === bundle.menuBundleId && (
//                     <Badge color="blue">Selected</Badge>
//                   )}
//                 </Group>

//                 <Text size="sm" c="dimmed" mb="sm">
//                   {bundle.description}
//                 </Text>

//                 <div className="space-y-1 text-xs">
//                   {bundle.beefOptions > 0 && (
//                     <Text>Beef: {bundle.beefOptions}</Text>
//                   )}
//                   {bundle.porkOptions > 0 && (
//                     <Text>Pork: {bundle.porkOptions}</Text>
//                   )}
//                   {bundle.chickenOptions > 0 && (
//                     <Text>Chicken: {bundle.chickenOptions}</Text>
//                   )}
//                   {bundle.fishOptions > 0 && (
//                     <Text>Fish: {bundle.fishOptions}</Text>
//                   )}
//                   {bundle.vegetableOptions > 0 && (
//                     <Text>Vegetable: {bundle.vegetableOptions}</Text>
//                   )}
//                   {bundle.pastaOptions > 0 && (
//                     <Text>Pasta: {bundle.pastaOptions}</Text>
//                   )}
//                   {bundle.dessertOptions > 0 && (
//                     <Text>Dessert: {bundle.dessertOptions}</Text>
//                   )}
//                   {bundle.soupOptions > 0 && (
//                     <Text>Soup: {bundle.soupOptions}</Text>
//                   )}
//                   {bundle.juiceOptions > 0 && (
//                     <Text>Juice: {bundle.juiceOptions}</Text>
//                   )}
//                 </div>

//                 {bundle.includesRice && (
//                   <Text size="xs" mt="xs">
//                     ✓ Includes Rice
//                   </Text>
//                 )}
//                 {bundle.includesWater && (
//                   <Text size="xs">✓ Includes Water</Text>
//                 )}
//               </Card>
//             ))}
//           </SimpleGrid>
//         )}
//       </Card>

//       {/* Food Selection (only show if bundle is selected) */}
//       {selectedBundle && (
//         <Grid gutter="lg">
//           {/* Selection Panel */}
//           <Grid.Col span={4}>
//             <Card shadow="sm" padding="lg" withBorder>
//               <Text fw={600} size="lg" mb="md">
//                 Customize Your Menu
//               </Text>

//               <div className="space-y-4">
//                 <div>
//                   <Text size="sm" fw={500} mb="xs">
//                     Select Food Category
//                   </Text>
//                   <Select
//                     placeholder="Choose a category"
//                     value={activeCategory}
//                     onChange={setActiveCategory}
//                     data={Object.keys(groupedFoods || {})
//                       .filter((category) => {
//                         const requirements = {
//                           beef: selectedBundle.beefOptions,
//                           pork: selectedBundle.porkOptions,
//                           chicken: selectedBundle.chickenOptions,
//                           fish: selectedBundle.fishOptions,
//                           vegetable: selectedBundle.vegetableOptions,
//                           pasta: selectedBundle.pastaOptions,
//                           dessert: selectedBundle.dessertOptions,
//                           soup: selectedBundle.soupOptions,
//                           juice: selectedBundle.juiceOptions,
//                         };
//                         return requirements[category] > 0;
//                       })
//                       .map((c) => ({
//                         value: c,
//                         label: c.toUpperCase(),
//                       }))}
//                   />
//                 </div>

//                 {activeCategory && (
//                   <div>
//                     <div className="flex justify-between items-center mb-2">
//                       <Text size="sm" fw={500}>
//                         Select {activeCategory.toUpperCase()} Dishes
//                       </Text>
//                       <Badge size="sm">
//                         {getCategoryProgress(activeCategory).current}/
//                         {getCategoryProgress(activeCategory).required}
//                       </Badge>
//                     </div>
//                     <MultiSelect
//                       placeholder={`Choose ${activeCategory} dishes`}
//                       data={groupedFoods[activeCategory] || []}
//                       value={formData.selectedByCategory[activeCategory] || []}
//                       onChange={(values) =>
//                         handleSelect(activeCategory, values)
//                       }
//                       searchable
//                       clearable
//                       itemComponent={FoodItem}
//                       nothingFound="No items found"
//                       maxSelectedValues={
//                         getCategoryProgress(activeCategory).required
//                       }
//                     />
//                     <Text size="xs" c="dimmed" mt="xs">
//                       Select exactly{" "}
//                       {getCategoryProgress(activeCategory).required} option(s)
//                     </Text>
//                   </div>
//                 )}
//               </div>
//             </Card>
//           </Grid.Col>

//           {/* Summary Panel */}
//           <Grid.Col span={8}>
//             <Card shadow="sm" padding="lg" withBorder>
//               <Group position="apart" mb="md">
//                 <Title order={4}>Selected Menu Summary</Title>
//                 <Badge color="blue" size="lg">
//                   {selectedBundle.name}
//                 </Badge>
//               </Group>

//               <ScrollArea h={500}>
//                 {summary.length === 0 ? (
//                   <Text size="sm" c="dimmed" align="center" py="xl">
//                     No food items selected yet
//                   </Text>
//                 ) : (
//                   <div className="space-y-6">
//                     {summary.map(({ category, items }) => (
//                       <div key={category}>
//                         <div className="flex justify-between items-center mb-2">
//                           <Text fw={600} size="lg" className="capitalize">
//                             {category}
//                           </Text>
//                           <Badge>
//                             {items.length}/
//                             {getCategoryProgress(category).required}
//                           </Badge>
//                         </div>
//                         <div className="grid grid-cols-2 gap-3">
//                           {items.map((item) => (
//                             <Card
//                               key={item.value}
//                               shadow="sm"
//                               padding="sm"
//                               withBorder
//                             >
//                               <Group>
//                                 <AspectRatio ratio={1} w={80}>
//                                   <Image
//                                     src={
//                                       item.photos?.[0]?.url ||
//                                       "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
//                                     }
//                                     alt={item.label}
//                                     radius="sm"
//                                   />
//                                 </AspectRatio>
//                                 <div className="flex-1">
//                                   <Text size="sm" fw={500}>
//                                     {item.label}
//                                   </Text>
//                                   <Text size="xs" c="dimmed" lineClamp={2}>
//                                     {item.description}
//                                   </Text>
//                                 </div>
//                               </Group>
//                             </Card>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </ScrollArea>

//               {/* Validation Alert */}
//               {!isSelectionComplete && (
//                 <Alert color="orange" mt="md">
//                   Please complete all menu selections for the{" "}
//                   {selectedBundle.name} bundle
//                 </Alert>
//               )}
//             </Card>
//           </Grid.Col>
//         </Grid>
//       )}

//       {/* Change Bundle Confirmation Modal */}
//       <Modal
//         opened={changeBundleModalOpened}
//         onClose={closeChangeBundleModal}
//         title="Change Menu Bundle"
//       >
//         <Text mb="md">
//           Changing the menu bundle will clear your current food selections. Are
//           you sure you want to continue?
//         </Text>
//         <Group position="right">
//           <Button variant="outline" onClick={closeChangeBundleModal}>
//             Cancel
//           </Button>
//           <Button color="red" onClick={confirmBundleChange}>
//             Change Bundle
//           </Button>
//         </Group>
//       </Modal>

//       <Group position="apart" mt="xl">
//         <Button variant="default" onClick={onBack}>
//           Back
//         </Button>
//         <Button
//           onClick={onNext}
//           disabled={!selectedBundle || !isSelectionComplete}
//         >
//           {quotation ? "Update Menu" : "Next: Choose Add-ons"}
//         </Button>
//       </Group>
//     </div>
//   );
// };

// export default MenuSelection;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  MultiSelect,
  Text,
  Card,
  Image,
  AspectRatio,
  ScrollArea,
  Title,
  Group,
  Button,
  SimpleGrid,
  Badge,
  Alert,
  Loader,
  Avatar,
  Grid,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const MenuSelection = ({
  formData,
  updateFormData,
  quotation,
  onNext,
  onBack,
}) => {
  const [menuBundles, setMenuBundles] = useState([]);
  const [foods, setFoods] = useState([]);
  const [groupedFoods, setGroupedFoods] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [newBundle, setNewBundle] = useState(null);

  const [
    changeBundleModalOpened,
    { open: openChangeBundleModal, close: closeChangeBundleModal },
  ] = useDisclosure(false);

  // ✅ Normalize category names to consistent internal keys
  const normalizeCategory = (cat) => {
    if (!cat) return "uncategorized";
    const normalized = cat.toLowerCase().trim();

    if (normalized.includes("vegetable")) return "vegetable";
    if (normalized.includes("pasta") || normalized.includes("noodle"))
      return "pasta";
    if (normalized.includes("drink") || normalized.includes("juice"))
      return "juice";
    if (normalized.includes("soup")) return "soup";
    if (normalized.includes("beef")) return "beef";
    if (normalized.includes("pork")) return "pork";
    if (normalized.includes("chicken")) return "chicken";
    if (normalized.includes("fish")) return "fish";
    if (normalized.includes("dessert")) return "dessert";
    return "uncategorized";
  };

  // ✅ Food item display
  const FoodItem = ({ data }) => (
    <Group>
      <Avatar src={data.imageUrl || null} size="md" radius="sm" />
      <div>
        <Text size="sm" fw={500}>
          {data.label}
        </Text>
        <Text size="xs" c="dimmed" lineClamp={1}>
          {data.description}
        </Text>
      </div>
    </Group>
  );

  // ✅ Fetch menu bundles (includes price)
  useEffect(() => {
    const fetchMenuBundles = async () => {
      setBundleLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/api/menu-bundle",
          {
            withCredentials: true,
          }
        );
        setMenuBundles(response.data);
      } catch (err) {
        console.error("Failed to fetch menu bundles", err);
      } finally {
        setBundleLoading(false);
      }
    };
    fetchMenuBundles();
  }, []);

  // ✅ Fetch foods and group by normalized category
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8080/public/api/items/food"
        );

        setFoods(res.data);

        const grouped = res.data.reduce((acc, item) => {
          const category = normalizeCategory(item.category);
          if (!acc[category]) acc[category] = [];

          acc[category].push({
            value: item.itemId.toString(),
            label: item.name,
            description: item.description,
            imageUrl: item.photos?.[0]?.url,
            photos: item.photos,
          });

          return acc;
        }, {});

        setGroupedFoods(grouped);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // ✅ Load existing quotation data (for edit)
  useEffect(() => {
    if (quotation) {
      if (quotation.selectedMenuBundle) {
        setSelectedBundle(quotation.selectedMenuBundle);
      }

      if (quotation.customFoodSelection) {
        try {
          const existingSelections = JSON.parse(quotation.customFoodSelection);
          updateFormData({ selectedByCategory: existingSelections });
        } catch (e) {
          console.error("Failed to parse existing food selections", e);
        }
      }
    }
  }, [quotation]);

  // ✅ Handle bundle select
  const handleBundleSelect = (bundle) => {
    if (
      selectedBundle &&
      formData.selectedByCategory &&
      Object.keys(formData.selectedByCategory).length > 0
    ) {
      setNewBundle(bundle);
      openChangeBundleModal();
    } else {
      setSelectedBundle(bundle);
      updateFormData({
        selectedMenuBundle: bundle,
        selectedByCategory: {},
      });
    }
  };

  const confirmBundleChange = () => {
    setSelectedBundle(newBundle);
    updateFormData({
      selectedMenuBundle: newBundle,
      selectedByCategory: {},
    });
    closeChangeBundleModal();
    setNewBundle(null);
  };

  // ✅ Handle category selection
  const handleSelect = (category, values) => {
    updateFormData({
      selectedByCategory: {
        ...formData.selectedByCategory,
        [category]: values,
      },
    });
  };

  // ✅ Validate selections vs bundle requirements
  const validateSelections = () => {
    if (!selectedBundle) return true;

    const requirements = {
      beef: selectedBundle.beefOptions,
      pork: selectedBundle.porkOptions,
      chicken: selectedBundle.chickenOptions,
      fish: selectedBundle.fishOptions,
      vegetable: selectedBundle.vegetableOptions,
      pasta: selectedBundle.pastaOptions,
      dessert: selectedBundle.dessertOptions,
      soup: selectedBundle.soupOptions,
      juice: selectedBundle.juiceOptions,
    };

    return Object.entries(requirements).every(([category, required]) => {
      if (required === 0) return true;
      const selectedCount = (formData.selectedByCategory?.[category] || [])
        .length;
      return selectedCount === required;
    });
  };

  const isSelectionComplete = validateSelections();

  // ✅ Build summary of selected items
  const getSummary = () => {
    if (
      !formData.selectedByCategory ||
      typeof formData.selectedByCategory !== "object"
    ) {
      return [];
    }

    return Object.entries(formData.selectedByCategory)
      .filter(
        ([category, values]) => Array.isArray(values) && values.length > 0
      )
      .map(([category, values]) => ({
        category,
        items: (groupedFoods[category] || []).filter((f) =>
          values.includes(f.value)
        ),
      }))
      .filter(({ items }) => items.length > 0);
  };

  const summary = getSummary();

  const getCategoryProgress = (category) => {
    if (!selectedBundle) return { current: 0, required: 0 };
    const requirements = {
      beef: selectedBundle.beefOptions,
      pork: selectedBundle.porkOptions,
      chicken: selectedBundle.chickenOptions,
      fish: selectedBundle.fishOptions,
      vegetable: selectedBundle.vegetableOptions,
      pasta: selectedBundle.pastaOptions,
      dessert: selectedBundle.dessertOptions,
      soup: selectedBundle.soupOptions,
      juice: selectedBundle.juiceOptions,
    };
    const current = (formData.selectedByCategory?.[category] || []).length;
    const required = requirements[category] || 0;
    return { current, required };
  };

  return (
    <div className="py-6">
      <Text size="xl" fw={600} mb="md">
        {quotation ? "Edit Your Menu" : "Select Your Menu"}
      </Text>

      {/* ✅ Bundle Selection */}
      <Card shadow="sm" padding="lg" mb="md" withBorder>
        <Text fw={600} size="lg" mb="sm">
          Choose a Menu Package
        </Text>

        {bundleLoading ? (
          <Loader size="sm" />
        ) : (
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: "lg", cols: 2 },
              { maxWidth: "sm", cols: 1 },
            ]}
          >
            {menuBundles.map((bundle) => (
              <Card
                key={bundle.menuBundleId}
                shadow="sm"
                padding="md"
                withBorder
                className={`cursor-pointer transition-all ${
                  selectedBundle?.menuBundleId === bundle.menuBundleId
                    ? "border-blue-500 border-2 bg-blue-50"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleBundleSelect(bundle)}
              >
                <Group position="apart" mb="xs">
                  <Text fw={600}>{bundle.name}</Text>
                  {selectedBundle?.menuBundleId === bundle.menuBundleId && (
                    <Badge color="blue">Selected</Badge>
                  )}
                </Group>

                <Text size="sm" c="dimmed" mb="sm">
                  {bundle.description}
                </Text>

                <Text size="sm" fw={500}>
                  ₱{bundle.price?.toLocaleString() ?? "N/A"}
                </Text>

                <div className="space-y-1 text-xs mt-2">
                  {Object.entries({
                    Beef: bundle.beefOptions,
                    Pork: bundle.porkOptions,
                    Chicken: bundle.chickenOptions,
                    Fish: bundle.fishOptions,
                    Vegetable: bundle.vegetableOptions,
                    Pasta: bundle.pastaOptions,
                    Dessert: bundle.dessertOptions,
                    Soup: bundle.soupOptions,
                    Juice: bundle.juiceOptions,
                  }).map(
                    ([label, count]) =>
                      count > 0 && (
                        <Text key={label}>
                          {label}: {count}
                        </Text>
                      )
                  )}
                </div>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Card>

      {/* ✅ Food Selection */}
      {selectedBundle && (
        <Grid gutter="lg">
          {/* Left panel */}
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg" withBorder>
              <Text fw={600} size="lg" mb="md">
                Customize Your Menu
              </Text>

              <div className="space-y-4">
                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Select Food Category
                  </Text>
                  <Select
                    placeholder="Choose a category"
                    value={activeCategory}
                    onChange={setActiveCategory}
                    data={Object.keys(groupedFoods || {})
                      .filter((category) => {
                        const req = selectedBundle[`${category}Options`];
                        return req && req > 0;
                      })
                      .map((c) => ({ value: c, label: c.toUpperCase() }))}
                  />
                </div>

                {activeCategory && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Text size="sm" fw={500}>
                        Select {activeCategory.toUpperCase()} Dishes
                      </Text>
                      <Badge size="sm">
                        {getCategoryProgress(activeCategory).current}/
                        {getCategoryProgress(activeCategory).required}
                      </Badge>
                    </div>
                    <MultiSelect
                      placeholder={`Choose ${activeCategory} dishes`}
                      data={groupedFoods[activeCategory] || []}
                      value={formData.selectedByCategory[activeCategory] || []}
                      onChange={(values) =>
                        handleSelect(activeCategory, values)
                      }
                      searchable
                      clearable
                      itemComponent={FoodItem}
                      nothingFound="No items found"
                      maxSelectedValues={
                        getCategoryProgress(activeCategory).required
                      }
                    />
                    <Text size="xs" c="dimmed" mt="xs">
                      Select exactly{" "}
                      {getCategoryProgress(activeCategory).required} option(s)
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </Grid.Col>

          {/* Summary */}
          <Grid.Col span={8}>
            <Card shadow="sm" padding="lg" withBorder>
              <Group position="apart" mb="md">
                <Title order={4}>Selected Menu Summary</Title>
                <Badge color="blue" size="lg">
                  {selectedBundle.name}
                </Badge>
              </Group>

              <ScrollArea h={500}>
                {summary.length === 0 ? (
                  <Text size="sm" c="dimmed" align="center" py="xl">
                    No food items selected yet
                  </Text>
                ) : (
                  <div className="space-y-6">
                    {summary.map(({ category, items }) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <Text fw={600} size="lg" className="capitalize">
                            {category}
                          </Text>
                          <Badge>
                            {items.length}/
                            {getCategoryProgress(category).required}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {items.map((item) => (
                            <Card
                              key={item.value}
                              shadow="sm"
                              padding="sm"
                              withBorder
                            >
                              <Group>
                                <AspectRatio ratio={1} w={80}>
                                  <Image
                                    src={
                                      item.photos?.[0]?.url ||
                                      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
                                    }
                                    alt={item.label}
                                    radius="sm"
                                  />
                                </AspectRatio>
                                <div className="flex-1">
                                  <Text size="sm" fw={500}>
                                    {item.label}
                                  </Text>
                                  <Text size="xs" c="dimmed" lineClamp={2}>
                                    {item.description}
                                  </Text>
                                </div>
                              </Group>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {!isSelectionComplete && (
                <Alert color="orange" mt="md">
                  Please complete all menu selections for the{" "}
                  {selectedBundle.name} bundle
                </Alert>
              )}
            </Card>
          </Grid.Col>
        </Grid>
      )}

      {/* Modal */}
      <Modal
        opened={changeBundleModalOpened}
        onClose={closeChangeBundleModal}
        title="Change Menu Bundle"
      >
        <Text mb="md">
          Changing the menu bundle will clear your current food selections. Are
          you sure you want to continue?
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={closeChangeBundleModal}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmBundleChange}>
            Change Bundle
          </Button>
        </Group>
      </Modal>

      {/* Navigation */}
      <Group position="apart" mt="xl">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedBundle || !isSelectionComplete}
        >
          {quotation ? "Update Menu" : "Next: Choose Add-ons"}
        </Button>
      </Group>
    </div>
  );
};

export default MenuSelection;
