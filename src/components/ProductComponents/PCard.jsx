import React from "react";
import {
  AspectRatio,
  Image,
  Badge,
  Text,
  Group,
  NumberFormatter,
  Paper,
  Button,
} from "@mantine/core";
import { IconStar, IconShoppingCart } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ProductOverview from "./ProductOverview";

const PCard = ({ setLineItems, lineItems, ...item }) => {
  // eslint-disable-next-line no-unused-vars
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  console.log("ItemProps", item);

  const handleOpen = () => {
    setSelectedItem(item); // store the clicked item
    open(); // now open the modal
  };

  return (
    <div className="relative w-[240px] min-w-[220px] max-w-[260px] rounded-[8px] border bg-white overflow-hidden group cursor-pointer">
      {/* Image */}
      <AspectRatio ratio={4 / 5} className="rounded-[8px] overflow-clip">
        <Image
          src="https://picsum.photos/400/500"
          className="object-cover w-full h-full rounded-[8px]"
        />
      </AspectRatio>
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] z-30
          transition-all duration-300 ease-in-out
          opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0"
      >
        <Paper
          shadow="sm"
          radius="md"
          withBorder
          className="w-full px-2 text-[14px]"
        >
          <Text size="sm" lineClamp={1}>
            {item.name}
          </Text>
          <Group gap={4}>
            <IconStar size={14} className="text-yellow-500 fill-yellow-400" />
            <Text size="sm">4.9</Text>
            <Text size="sm" c="dimmed">
              (255 reviews)
            </Text>
          </Group>
          <NumberFormatter
            size="sm"
            className="font-bold"
            prefix="₱ "
            value={item.price}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
          />
        </Paper>
        <Text>{item.itemId}</Text>

        <button
          className="mt-2 w-full bg-green-600 text-white py-2 rounded flex items-center justify-center"
          onClick={handleOpen}
        >
          <Text size="sm" className="ml-1">
            {item.type === "add-on" ? "Add to qoutation" : "Add service"}
          </Text>
        </button>
      </div>
      <ProductOverview
        opened={opened}
        close={close}
        item={selectedItem}
        setLineItems={setLineItems}
        lineItems={lineItems}
      ></ProductOverview>
    </div>
  );
};

export default PCard;
