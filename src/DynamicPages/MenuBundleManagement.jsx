import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Checkbox,
  Group,
  Text,
  Card,
  Alert,
  Space,
  Grid,
  SimpleGrid,
  Badge,
  Loader,
  ActionIcon,
  Tabs,
  MultiSelect,
  Stack,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconToggleRight,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import axios from "axios";

const MenuBundleManagement = () => {
  const [menuBundles, setMenuBundles] = useState([]);
  const [foods, setFoods] = useState([]);
  const [groupedFoods, setGroupedFoods] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    preselectedModalOpened,
    { open: openPreselectedModal, close: closePreselectedModal },
  ] = useDisclosure(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    beefOptions: 0,
    porkOptions: 0,
    chickenOptions: 0,
    fishOptions: 0,
    vegetableOptions: 0,
    pastaOptions: 0,
    dessertOptions: 0,
    soupOptions: 0,
    juiceOptions: 0,
    includesRice: true,
    includesWater: true,
    basePrice: 0,
    active: true,
    preselectedFoods: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [currentPreselections, setCurrentPreselections] = useState({});
  const [selectionErrors, setSelectionErrors] = useState({});
  const [activeTab, setActiveTab] = useState(null);

  // FoodItem component for display in MultiSelect
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

  // Fetch all menu bundles
  const fetchMenuBundles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/menu-bundle",
        {
          withCredentials: true,
        }
      );
      setMenuBundles(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch menu bundles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch foods for pre-selection
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/public/api/items/food"
        );
        setFoods(res.data);

        // Group foods by category
        const grouped = res.data.reduce((acc, item) => {
          const category = item.category?.toLowerCase() || "uncategorized";
          if (!acc[category]) acc[category] = [];

          acc[category].push({
            value: item.itemId.toString(),
            label: item.name,
            description: item.description,
            imageUrl: item.photos?.[0]?.url,
          });

          return acc;
        }, {});

        setGroupedFoods(grouped);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    fetchMenuBundles();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      beefOptions: 0,
      porkOptions: 0,
      chickenOptions: 0,
      fishOptions: 0,
      vegetableOptions: 0,
      pastaOptions: 0,
      dessertOptions: 0,
      soupOptions: 0,
      juiceOptions: 0,
      includesRice: true,
      includesWater: true,
      basePrice: 0,
      active: true,
      preselectedFoods: "",
    });
    setEditingId(null);
  };

  // Validate category selection
  const validateCategorySelection = (category, selectedItems) => {
    const categoryLimits = {
      beef: formData.beefOptions,
      pork: formData.porkOptions,
      chicken: formData.chickenOptions,
      fish: formData.fishOptions,
      vegetable: formData.vegetableOptions,
      pasta: formData.pastaOptions,
      dessert: formData.dessertOptions,
      soup: formData.soupOptions,
      juice: formData.juiceOptions,
    };

    const limit = categoryLimits[category] || 0;
    const currentCount = selectedItems.length;

    if (currentCount > limit) {
      setSelectionErrors((prev) => ({
        ...prev,
        [category]: `Maximum ${limit} ${category} options allowed. You selected ${currentCount}.`,
      }));
      return false;
    } else {
      setSelectionErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[category];
        return newErrors;
      });
      return true;
    }
  };

  // Get food data from ID
  const getFoodData = (foodId) => {
    for (const category in groupedFoods) {
      const food = groupedFoods[category].find((item) => item.value === foodId);
      if (food) return food;
    }
    return { label: "Unknown Food", imageUrl: null };
  };

  // Create menu bundle
  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/menu-bundle",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess("Menu bundle created successfully!");
        closeCreateModal();
        resetForm();
        fetchMenuBundles();
      } else {
        setError("Failed to create menu bundle");
      }
    } catch (err) {
      setError(
        "Failed to create menu bundle: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Update menu bundle
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/menu-bundle/${editingId}`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess("Menu bundle updated successfully!");
        closeEditModal();
        resetForm();
        fetchMenuBundles();
      } else {
        setError("Failed to update menu bundle");
      }
    } catch (err) {
      setError(
        "Failed to update menu bundle: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Delete menu bundle
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu bundle?"))
      return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/menu-bundles/${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess("Menu bundle deleted successfully!");
        fetchMenuBundles();
      } else {
        setError("Failed to delete menu bundle");
      }
    } catch (err) {
      setError("Failed to delete menu bundle: " + err.message);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/menu-bundle/${id}/toggle-active`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess("Menu bundle status updated!");
        fetchMenuBundles();
      } else {
        setError("Failed to update menu bundle status");
      }
    } catch (err) {
      setError("Failed to update menu bundle status: " + err.message);
    }
  };

  // Open edit modal
  const openEdit = (bundle) => {
    setFormData({
      name: bundle.name,
      description: bundle.description || "",
      beefOptions: bundle.beefOptions,
      porkOptions: bundle.porkOptions,
      chickenOptions: bundle.chickenOptions,
      fishOptions: bundle.fishOptions,
      vegetableOptions: bundle.vegetableOptions,
      pastaOptions: bundle.pastaOptions,
      dessertOptions: bundle.dessertOptions,
      soupOptions: bundle.soupOptions,
      juiceOptions: bundle.juiceOptions,
      includesRice: bundle.includesRice,
      includesWater: bundle.includesWater,
      basePrice: bundle.basePrice || 0,
      active: bundle.active,
      preselectedFoods: bundle.preselectedFoods || "",
    });
    setEditingId(bundle.menuBundleId);
    openEditModal();
  };

  // Get category limits
  const getCategoryLimits = () => {
    return {
      beef: formData.beefOptions,
      pork: formData.porkOptions,
      chicken: formData.chickenOptions,
      fish: formData.fishOptions,
      vegetable: formData.vegetableOptions,
      pasta: formData.pastaOptions,
      dessert: formData.dessertOptions,
      soup: formData.soupOptions,
      juice: formData.juiceOptions,
    };
  };

  // Open pre-selected foods modal
  const openPreselectedFoodsModal = () => {
    if (formData.preselectedFoods) {
      try {
        const preselected = JSON.parse(formData.preselectedFoods);
        setCurrentPreselections(preselected);
      } catch (e) {
        setCurrentPreselections({});
      }
    } else {
      setCurrentPreselections({});
    }

    const categoryLimits = getCategoryLimits();
    const enabledCategories = Object.keys(groupedFoods).filter(
      (category) => categoryLimits[category] > 0
    );

    setActiveTab((prev) =>
      enabledCategories.includes(prev) ? prev : enabledCategories[0] || null
    );

    openPreselectedModal();
  };

  // Handle category selection
  const handleCategorySelection = (category, selectedItems) => {
    if (validateCategorySelection(category, selectedItems)) {
      setCurrentPreselections((prev) => ({
        ...prev,
        [category]: selectedItems,
      }));
    }
  };

  // Save pre-selected foods
  const savePreselectedFoods = () => {
    // Validate all categories before saving
    const hasErrors = Object.keys(currentPreselections).some((category) => {
      const categoryLimits = {
        beef: formData.beefOptions,
        pork: formData.porkOptions,
        chicken: formData.chickenOptions,
        fish: formData.fishOptions,
        vegetable: formData.vegetableOptions,
        pasta: formData.pastaOptions,
        dessert: formData.dessertOptions,
        soup: formData.soupOptions,
        juice: formData.juiceOptions,
      };

      const limit = categoryLimits[category] || 0;
      const currentCount = currentPreselections[category]?.length || 0;

      return currentCount > limit;
    });

    if (hasErrors) {
      setError("Please fix the selection errors before saving");
      return;
    }

    const jsonString = JSON.stringify(currentPreselections);
    setFormData({ ...formData, preselectedFoods: jsonString });
    closePreselectedModal();
    setSelectionErrors({});
  };

  // Get selection summary
  const getSelectionSummary = () => {
    const categoryLimits = getCategoryLimits();
    const summary = [];

    Object.entries(categoryLimits).forEach(([category, limit]) => {
      const currentCount = currentPreselections[category]?.length || 0;
      if (limit > 0) {
        summary.push({
          category,
          limit,
          currentCount,
          isValid: currentCount <= limit,
        });
      }
    });

    return summary;
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Menu Bundle Card Component
  const MenuBundleCard = ({ bundle }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section inheritPadding py="xs" mb="md">
        <Group position="apart">
          <div>
            <Text fw={700} size="lg">
              {bundle.name}
            </Text>
            {!bundle.active && (
              <Badge color="red" size="sm">
                Inactive
              </Badge>
            )}
          </div>
          <Group spacing="xs">
            {bundle.preselectedFoods && (
              <Badge color="green" size="sm">
                Pre-set Menu
              </Badge>
            )}
            <Badge
              color={bundle.basePrice > 0 ? "blue" : "green"}
              variant="light"
            >
              {bundle.basePrice ? `₱${bundle.basePrice}` : "Included"}
            </Badge>
          </Group>
        </Group>
      </Card.Section>

      {bundle.description && (
        <Text size="sm" c="dimmed" mb="md">
          {bundle.description}
        </Text>
      )}

      <div className="space-y-2 mb-4">
        <Group spacing="xs">
          <Badge variant="outline" size="sm">
            Beef: {bundle.beefOptions}
          </Badge>
          <Badge variant="outline" size="sm">
            Pork: {bundle.porkOptions}
          </Badge>
          <Badge variant="outline" size="sm">
            Chicken: {bundle.chickenOptions}
          </Badge>
        </Group>
        <Group spacing="xs">
          <Badge variant="outline" size="sm">
            Fish: {bundle.fishOptions}
          </Badge>
          <Badge variant="outline" size="sm">
            Vegetable: {bundle.vegetableOptions}
          </Badge>
          <Badge variant="outline" size="sm">
            Pasta: {bundle.pastaOptions}
          </Badge>
        </Group>
        <Group spacing="xs">
          <Badge variant="outline" size="sm">
            Dessert: {bundle.dessertOptions}
          </Badge>
          <Badge variant="outline" size="sm">
            Soup: {bundle.soupOptions}
          </Badge>
          <Badge variant="outline" size="sm">
            Juice: {bundle.juiceOptions}
          </Badge>
        </Group>
      </div>

      <Group spacing="xs" mb="md">
        {bundle.includesRice && (
          <Badge color="teal" variant="light" size="sm">
            Includes Rice
          </Badge>
        )}
        {bundle.includesWater && (
          <Badge color="teal" variant="light" size="sm">
            Includes Water
          </Badge>
        )}
      </Group>

      <Card.Section inheritPadding py="xs">
        <Group position="apart">
          <Group spacing="xs">
            <ActionIcon variant="outline" onClick={() => openEdit(bundle)}>
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="outline"
              onClick={() => handleDelete(bundle.menuBundleId)}
            >
              <IconTrash size={16} />
            </ActionIcon>
            <ActionIcon
              variant="outline"
              onClick={() => handleToggleActive(bundle.menuBundleId)}
            >
              <IconToggleRight size={16} />
            </ActionIcon>
          </Group>
          <Button
            size="xs"
            variant="light"
            onClick={() => handleToggleActive(bundle.menuBundleId)}
          >
            {bundle.active ? "Deactivate" : "Activate"}
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );

  const formFields = (
    <Grid>
      <Grid.Col span={6}>
        <TextInput
          label="Name"
          placeholder="STANDARD MENU"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <NumberInput
          label="Base Price"
          placeholder="0.00"
          value={formData.basePrice}
          onChange={(value) => setFormData({ ...formData, basePrice: value })}
          min={0}
          precision={2}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea
          label="Description"
          placeholder="Complete set of menu..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </Grid.Col>

      {/* Options Grid */}
      <Grid.Col span={4}>
        <NumberInput
          label="Beef Options"
          value={formData.beefOptions}
          onChange={(v) => setFormData({ ...formData, beefOptions: v })}
          min={0}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NumberInput
          label="Pork Options"
          value={formData.porkOptions}
          onChange={(v) => setFormData({ ...formData, porkOptions: v })}
          min={0}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NumberInput
          label="Chicken Options"
          value={formData.chickenOptions}
          onChange={(v) => setFormData({ ...formData, chickenOptions: v })}
          min={0}
        />
      </Grid.Col>

      <Grid.Col span={4}>
        <NumberInput
          label="Fish Options"
          value={formData.fishOptions}
          onChange={(v) => setFormData({ ...formData, fishOptions: v })}
          min={0}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NumberInput
          label="Vegetable Options"
          value={formData.vegetableOptions}
          onChange={(v) => setFormData({ ...formData, vegetableOptions: v })}
          min={0}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NumberInput
          label="Pasta Options"
          value={formData.pastaOptions}
          onChange={(v) => setFormData({ ...formData, pastaOptions: v })}
          min={0}
        />
      </Grid.Col>

      <Grid.Col span={4}>
        <NumberInput
          label="Dessert Options"
          value={formData.dessertOptions}
          onChange={(v) => setFormData({ ...formData, dessertOptions: v })}
          min={0}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NumberInput
          label="Soup Options"
          value={formData.soupOptions}
          onChange={(v) => setFormData({ ...formData, soupOptions: v })}
          min={0}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NumberInput
          label="Juice Options"
          value={formData.juiceOptions}
          onChange={(v) => setFormData({ ...formData, juiceOptions: v })}
          min={0}
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <Checkbox
          label="Includes Rice"
          checked={formData.includesRice}
          onChange={(e) =>
            setFormData({ ...formData, includesRice: e.target.checked })
          }
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Checkbox
          label="Includes Water"
          checked={formData.includesWater}
          onChange={(e) =>
            setFormData({ ...formData, includesWater: e.target.checked })
          }
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <Checkbox
          label="Active"
          checked={formData.active}
          onChange={(e) =>
            setFormData({ ...formData, active: e.target.checked })
          }
        />
      </Grid.Col>

      {/* Pre-selected Foods Section */}
      <Grid.Col span={12}>
        <Card withBorder padding="md">
          <Group position="apart" mb="md">
            <div>
              <Text fw={500}>Pre-selected Menu Items</Text>
              <Text size="sm" c="dimmed">
                Choose default food items for this bundle
              </Text>
            </div>
            <Button variant="outline" onClick={openPreselectedFoodsModal}>
              {formData.preselectedFoods
                ? "Edit Pre-selected"
                : "Set Pre-selected"}
            </Button>
          </Group>

          {formData.preselectedFoods ? (
            <div>
              <Text size="sm" c="green" mb="xs">
                <IconCheck size={14} style={{ marginRight: "4px" }} />
                Pre-selected menu items configured
              </Text>
              <Text size="xs" c="dimmed">
                {Object.keys(JSON.parse(formData.preselectedFoods)).length}{" "}
                categories with pre-selections
              </Text>
            </div>
          ) : (
            <Text size="sm" c="dimmed">
              No pre-selected items set
            </Text>
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );

  // Pre-selected Foods Modal
  const PreselectedFoodsModal = (
    <Modal
      opened={preselectedModalOpened}
      onClose={closePreselectedModal}
      title="Set Pre-selected Menu Items"
      size="xl"
    >
      <Text size="sm" c="dimmed" mb="md">
        Select default food items for each category. You can only select up to
        the number of options specified for each category.
      </Text>

      {/* Selection Summary */}
      <Card withBorder mb="md">
        <Text fw={500} mb="sm">
          Selection Summary
        </Text>
        <Stack spacing="xs">
          {getSelectionSummary().map((item) => (
            <div key={item.category}>
              <Group position="apart" mb={4}>
                <Text size="sm" fw={500} tt="capitalize">
                  {item.category}
                </Text>
                <Badge color={item.isValid ? "blue" : "red"} variant="light">
                  {item.currentCount} / {item.limit}
                </Badge>
              </Group>
              {currentPreselections[item.category] &&
              currentPreselections[item.category].length > 0 ? (
                <Stack spacing={4}>
                  {currentPreselections[item.category].map((foodId) => {
                    const foodData = getFoodData(foodId);
                    return (
                      <Group
                        key={foodId}
                        spacing="xs"
                        pl="md"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          src={foodData.imageUrl || null}
                          size="sm"
                          radius="sm"
                        />
                        <Text size="xs" c="dimmed">
                          {foodData.label}
                        </Text>
                      </Group>
                    );
                  })}
                </Stack>
              ) : (
                <Text size="xs" c="dimmed" pl="md" fs="italic">
                  No items selected
                </Text>
              )}
            </div>
          ))}
          {getSelectionSummary().length === 0 && (
            <Text size="sm" c="dimmed" ta="center">
              No categories with available options. Set category limits first.
            </Text>
          )}
        </Stack>
      </Card>

      <Tabs
        value={activeTab}
        onTabChange={(tab) => {
          const categoryLimits = getCategoryLimits();
          if (categoryLimits[tab] > 0) {
            setActiveTab(tab);
          }
        }}
      >
        <Tabs.List>
          {Object.keys(groupedFoods).map((category) => {
            const categoryLimits = getCategoryLimits();
            const limit = categoryLimits[category] || 0;
            const currentCount = currentPreselections[category]?.length || 0;
            const isDisabled = limit === 0;

            return (
              <Tabs.Tab key={category} value={category} disabled={isDisabled}>
                <div>
                  <Text>{category.toUpperCase()}</Text>
                  <Text
                    size="xs"
                    c={
                      isDisabled
                        ? "dimmed"
                        : currentCount > limit
                        ? "red"
                        : "dimmed"
                    }
                  >
                    {currentCount}/{limit}
                  </Text>
                </div>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>

        {Object.entries(groupedFoods).map(([category, items]) => {
          const categoryLimits = getCategoryLimits();
          const limit = categoryLimits[category] || 0;
          const currentCount = currentPreselections[category]?.length || 0;
          const isDisabled = limit === 0;

          if (isDisabled) {
            return (
              <Tabs.Panel key={category} value={category} pt="xs">
                <Alert color="blue" title="No Options Available">
                  This category has 0 options configured. Increase the{" "}
                  {category} options limit to enable pre-selection.
                </Alert>
              </Tabs.Panel>
            );
          }

          return (
            <Tabs.Panel key={category} value={category} pt="xs">
              <Stack spacing="sm">
                <Group position="apart">
                  <Text fw={500} size="sm" tt="capitalize">
                    {category} Items
                  </Text>
                  <Badge
                    color={currentCount > limit ? "red" : "blue"}
                    variant={currentCount > limit ? "filled" : "light"}
                  >
                    {currentCount} / {limit} selected
                  </Badge>
                </Group>

                {selectionErrors[category] && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    size="sm"
                  >
                    {selectionErrors[category]}
                  </Alert>
                )}

                <MultiSelect
                  data={items}
                  value={currentPreselections[category] || []}
                  onChange={(selected) =>
                    handleCategorySelection(category, selected)
                  }
                  placeholder={`Choose ${category} items (max: ${limit})...`}
                  searchable
                  clearable
                  itemComponent={FoodItem}
                  nothingFound="No items found"
                  maxSelectedValues={limit}
                  error={selectionErrors[category]}
                />

                <Text size="xs" c="dimmed">
                  Select up to {limit} {category} item{limit !== 1 ? "s" : ""}
                </Text>
              </Stack>
            </Tabs.Panel>
          );
        })}
      </Tabs>

      <Group position="apart" mt="xl">
        <Button variant="outline" onClick={closePreselectedModal}>
          Cancel
        </Button>
        <Group>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentPreselections({});
              setSelectionErrors({});
            }}
          >
            Clear All
          </Button>
          <Button
            onClick={savePreselectedFoods}
            disabled={Object.keys(selectionErrors).length > 0}
          >
            Save Pre-selections
          </Button>
        </Group>
      </Group>
    </Modal>
  );

  return (
    <div style={{ padding: "20px" }}>
      <Card shadow="sm" padding="lg" mb="md">
        <Group position="apart" mb="md">
          <div>
            <Text size="xl" fw={700}>
              Menu Bundle Management
            </Text>
            <Text size="sm" c="dimmed">
              Manage your menu packages and bundles
            </Text>
          </div>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => {
              resetForm();
              openCreateModal();
            }}
          >
            Create Menu Bundle
          </Button>
        </Group>

        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="green" mb="md">
            {success}
          </Alert>
        )}
      </Card>

      {loading ? (
        <Text align="center">Loading menu bundles...</Text>
      ) : (
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: "lg", cols: 2 },
            { maxWidth: "sm", cols: 1 },
          ]}
        >
          {menuBundles.map((bundle) => (
            <MenuBundleCard key={bundle.menuBundleId} bundle={bundle} />
          ))}
        </SimpleGrid>
      )}

      {menuBundles.length === 0 && !loading && (
        <Card shadow="sm" padding="xl" style={{ textAlign: "center" }}>
          <Text size="lg" c="dimmed">
            No menu bundles found
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            Create your first menu bundle to get started
          </Text>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Create Menu Bundle"
        size="lg"
      >
        {formFields}
        <Space h="md" />
        <Group position="right">
          <Button variant="outline" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Edit Menu Bundle"
        size="lg"
      >
        {formFields}
        <Space h="md" />
        <Group position="right">
          <Button variant="outline" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </Group>
      </Modal>

      {PreselectedFoodsModal}
    </div>
  );
};

export default MenuBundleManagement;
