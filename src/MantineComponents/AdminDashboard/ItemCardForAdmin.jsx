import { IconHeart } from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
  SimpleGrid,
} from "@mantine/core";
import classes from "./BadgeCard.module.css";
//itemId, name, description, price, perUnitExcess, category, recommendedForEvents [], type
export function ItemCardForAdmin({
  // image,
  name,
  description,
  type,
  recommendedForEvents,
  editHandler,
  photos,
}) {
  console.log(photos, name);

  const features = recommendedForEvents.map((event) => (
    <Badge variant="light" key={event.eventName}>
      {event.eventName}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image
          src={
            photos && photos.length > 0
              ? photos[0]?.url
              : "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
          }
          alt={name}
          className="badge-image"
        />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {name}
          </Text>
          <Badge size="sm" variant="light">
            {type}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs">
          {description}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Recommended for events like:
        </Text>
        <Group
          // spacing={2}
          wrap="wrap"
          style={{ alignItems: "flex-start", marginTop: "5px" }}
        >
          {features.map((feature, index) => (
            <div key={index} className="inline  leading-none">
              {feature}
            </div>
          ))}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }} onClick={editHandler}>
          Edit
        </Button>
      </Group>
    </Card>
  );
}
