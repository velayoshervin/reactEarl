import React from "react";
import { Group, Avatar, Text } from "@mantine/core";

const ImageAndContact = ({ avatarUrl, firstname, lastname, email }) => {
  return (
    <Group noWrap spacing="sm">
      <Avatar src={avatarUrl} radius="xl" size={32} />
      <div>
        <Text size="sm" weight={500}>
          {firstname} {lastname}
        </Text>
        <Text size="xs" variant="dimmed">
          {email}
        </Text>
      </div>
    </Group>
  );
};

export default ImageAndContact;
