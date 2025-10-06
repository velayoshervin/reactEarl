import { Avatar, HoverCard, Text, Group } from "@mantine/core";

const UserHoverCard = ({ user }) => {
  if (!user) return null;

  return (
    <HoverCard width={250} shadow="md" openDelay={200} closeDelay={100}>
      <HoverCard.Target>
        <Group gap={1}>
          {user.avatarUrl ? (
            <Avatar
              radius="xl"
              size="md"
              color="blue"
              src={user.avatarUrl} // if you have profile photo, put it here
            ></Avatar>
          ) : (
            <Avatar
              radius="xl"
              size="md"
              color="blue"
              src={null} // if you have profile photo, put it here
            >
              {user.firstname[0]}
              {user.lastname[0]}
            </Avatar>
          )}

          {user.firstname}
          {user.lastname}
        </Group>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text fw={600} size="sm">
          {user.firstname} {user.lastname}
        </Text>
        <Text size="xs" c="dimmed">
          {user.email}
        </Text>
        {user.phone && <Text size="xs">📞 +639-{user.phone}</Text>}
        <Text size="xs">Role: {user.role ?? "Customer"}</Text>
        <Text size="xs" c={user.emailVerified ? "green" : "red"} fw={500}>
          {user.emailVerified ? "✔ Email Verified" : "✘ Not Verified"}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default UserHoverCard;
