import React from "react";
import { Avatar, Card, Text } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const FoodCard = () => {
  return (
    <div className="relative w-48 mx-auto mt-12">
      {/* Avatar (half outside) */}
      <Avatar
        src="https://images.unsplash.com/photo-1502767089025-6572583495b0"
        size={120}
        className="absolute left-1/2  z-10 -bottom-14 -translate-x-1/2 border-4 border-white shadow-md"
      />

      {/* Card */}
      <Card withBorder shadow="md" radius="md" p="sm" className=" text-center">
        <div className="pt-10"></div>
        <Text fw={500}>Menudo</Text>
        <Text fz="sm" c="dimmed">
          Menudo
        </Text>
        <p className="border border-x-0 border-y-gray-300 text-[12px] text-gray-400">
          100 pax
        </p>
        <div className="pt-2 flex justify-between">
          <p></p>
          <ActionIcon variant="default" size={"sm"} radius={"xs"}>
            <IconPlus size={12}></IconPlus>
          </ActionIcon>
        </div>
      </Card>
    </div>
  );
};

export default FoodCard;
