import React from "react";
import { Avatar } from "@mantine/core";
import {
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";

const user = {
  name: "Jane Spoonfighter",
  email: "janspoon@fighter.dev",
  image:
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

const UserIndicator = () => {
  return (
    <div className="flex ">
      <Group gap={7}>
        <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
        <Text fw={500} size="sm" lh={1} mr={3}>
          {user.name}
        </Text>
        <IconChevronDown size={12} stroke={1.5} />
      </Group>
    </div>
  );
};

export default UserIndicator;
