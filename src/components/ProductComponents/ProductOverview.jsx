/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Rating,
  Progress,
  Text,
  Tabs,
  AspectRatio,
  Group,
  Image,
  Stack,
  NumberFormatter,
  Paper,
  Button,
  Timeline,
  Avatar,
  Textarea,
  Select,
  Card,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import { Link, NavLink } from "react-router-dom";
import { IconFileText } from "@tabler/icons-react";
import { IconStar, IconUpload, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Dropzone, DropzoneAccept } from "@mantine/dropzone";
import {
  IconMoodCry,
  IconMoodSad,
  IconMoodNeutral,
  IconMoodSmile,
  IconMoodHappy,
  IconHeart,
  IconShoppingCart,
} from "@tabler/icons-react";

const ratingTexts = {
  1: "Very Bad",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

function getPerformanceIcon(value, iconStyle) {
  switch (value) {
    case 1:
      return <IconMoodCry style={iconStyle} color="red" />;
    case 2:
      return <IconMoodSad style={iconStyle} color="orange" />;
    case 3:
      return <IconMoodNeutral style={iconStyle} color="gray" />;
    case 4:
      return <IconMoodHappy style={iconStyle} color="green" />;
    case 5:
      return (
        <div className="relative w-8 h-8">
          <IconMoodSmile size={32} className="text-pink-500" />
          <IconHeart size={12} className="absolute top-1 left-1 text-red-500" />
          <IconHeart
            size={12}
            className="absolute top-1 right-1 text-red-500"
          />
        </div>
      );
    default:
      return null;
  }
}

const sampleImages = [
  "https://picsum.photos/id/1011/400/500",
  "https://picsum.photos/id/1012/400/500",
  "https://picsum.photos/id/1013/400/500",
  "https://picsum.photos/id/1015/400/500",
  "https://picsum.photos/id/1016/400/500",
];
const ProductOverview = ({ opened, close, item, setLineItems, lineItems }) => {
  // eslint-disable-next-line no-unused-vars
  const [qty, setQty] = useState(1);

  const { itemId, name, description, price, type, category } = item || {};

  console.log("ProductOverview", item);

  console.log("itemId-productOverview", itemId, description);

  return (
    <>
      <Modal opened={opened} onClose={close} size={1000} classNames={{}}>
        <div className="flex flex-col gap-6">
          <div className="flex gap-12">
            <div className="w-[400px]">
              <DisplayedImages imageList={sampleImages}></DisplayedImages>
            </div>
            <div className="mx-auto  flex-col flex justify-between">
              <Stack gap={"xs"}>
                <Text size="lg">{name}</Text>
                <Text size="xs">{description}</Text>
                <Group>
                  <IconStar
                    size={16}
                    className="text-yellow-400 fill-yellow-400 drop-shadow-lg"
                  />
                  <Text>4.9</Text> <Text c="dimmed">(299 reviews)</Text>
                </Group>
                <Text>
                  {" "}
                  <NumberFormatter
                    size="sm"
                    className="font-bold"
                    prefix="₱ "
                    value={price}
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Text>
              </Stack>
              {type === "add-on" && (
                <Button.Group>
                  <Button
                    disabled={qty === 1}
                    variant="default"
                    onClick={() => {
                      setQty((prev) => prev - 1);
                    }}
                  >
                    -
                  </Button>
                  <Button.GroupSection variant="default" size="sm">
                    {qty}
                  </Button.GroupSection>
                  <Button
                    variant="default"
                    onClick={() => {
                      setQty((prev) => prev + 1);
                    }}
                  >
                    +
                  </Button>
                  <Button
                    onClick={() => setQty(0)}
                    variant="default"
                    className="ml-2"
                  >
                    <IconTrash size={12}></IconTrash>
                  </Button>
                </Button.Group>
              )}

              <button
                className="flex items-center bg-green-700 text-white py-1 justify-center rounded"
                onClick={() => {
                  const lineItem = {
                    name: name,
                    priceAtPurchase: price,
                    quantity: qty,
                    itemId: itemId,
                    type: type,
                    category: category,
                  };

                  alert(JSON.stringify(lineItem));

                  setLineItems((prev) => {
                    const existing = prev.find(
                      (item) => item.itemId === lineItem.itemId
                    );

                    if (existing) {
                      if (type === "add-on") {
                        // ✅ add-ons: increment quantity
                        return prev.map((item) =>
                          item.itemId === lineItem.itemId
                            ? {
                                ...item,
                                quantity: item.quantity + lineItem.quantity,
                              }
                            : item
                        );
                      } else {
                        // ✅ services: keep only one, don’t increment
                        return prev;
                      }
                    } else {
                      // ✅ new item: add to cart
                      return [...prev, lineItem];
                    }
                  });
                }}
              >
                {type === "add-on" ? "+ Add" : "Add service"}
              </button>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[55%]">
              <ReviewList />
            </div>
            <div className="flex flex-col gap-1 items-start p-8">
              <div className="">
                <Text size="md" fw={500} className="">
                  Customer review
                </Text>
              </div>
              <Paper className="p-4 mx-auto text-[14px]">
                <Group className="mb-4">
                  <IconStar
                    size={40}
                    className="text-yellow-500 fill-yellow-500 drop-shadow-lg"
                  ></IconStar>
                  <div>
                    <Text size="sm">
                      <strong>4.7</strong> rating
                    </Text>
                    <span className="text-gray-500 text-[12px]">
                      based on 256 reviews
                    </span>
                  </div>
                </Group>
                <Group>
                  <span className="w-8 text-left text-gray-500">200x</span>
                  <Rating value={5} readOnly size={22}></Rating>{" "}
                  <span className="w-8 text-right ml-auto text-gray-500">
                    100%
                  </span>
                </Group>
                <Group>
                  <span className="w-8 text-left text-gray-500">50x</span>
                  <Rating value={4} readOnly size={22}></Rating>
                  <span className="w-8 text-right ml-auto text-gray-500">
                    100%
                  </span>
                </Group>
                <Group>
                  <span className="w-8 text-left text-gray-500">12</span>
                  <Rating value={3} readOnly size={22}></Rating>
                  <span className="w-8 text-right ml-auto text-gray-500">
                    100%
                  </span>
                </Group>
                <Group>
                  <span className="w-8 text-left text-gray-500">4</span>
                  <Rating value={2} readOnly size={22}></Rating>
                  <span className="w-8 text-right ml-auto text-gray-500">
                    100%
                  </span>
                </Group>
                <Group>
                  <span className="w-8 text-left text-gray-500">0</span>
                  <Rating value={1} readOnly size={22}></Rating>
                  <span className="w-8 text-right ml-auto text-gray-500">
                    100%
                  </span>
                </Group>
              </Paper>
              <div className="flex flex-col gap-1 mt-2">
                <Text size="sm" fw={700}>
                  Review this product
                </Text>
                <Text size="sm">
                  Let others know what you think of this product
                </Text>
                <Text>{itemId}</Text>
                <button
                  onClick={openModal}
                  className=" bg-white text-black border border-gray-500 rounded py-1 px-2 w-fit text-[12px] "
                >
                  Write a review
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const ReviewForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted ✅");
    modals.closeAll(); // close modal after submit
  };

  const [rate, setRate] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  return (
    <form className="flex flex-col gap-4">
      <div className="flex gap-2">
        <img
          className="h-[40px] w-[50px]"
          alt="product name"
          src="data:image/jpeg;base64,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"
        />
        <Text>Product name</Text>
      </div>

      <Text c="dimmed" size="sm">
        it wont take long
      </Text>

      <div className="flex flex-col items-center justify-center">
        <Group gap={"xs"}>
          {getPerformanceIcon(rate, { width: 32, height: 32 })}
          <Text size="xl">{ratingTexts[rate] ?? ""}</Text>
        </Group>

        <Rating size={40} value={rate} onChange={setRate}></Rating>
      </div>
      <Text size="sm" fw={500}>
        Write Your Review
      </Text>
      <Textarea
        value={feedback}
        onChange={(event) => setFeedback(event.currentTarget.value)}
        placeholder="Please share your feedback about the product"
        autosize
        minRows={3}
        maxRows={4}
      ></Textarea>
      <Dropzone
        className="flex flex-col items-center justify-center h-[80px] w-full"
        accept={{ "image/*": [] }}
        onDrop={(value) => {
          setFiles(value);
        }}
        multiple
      >
        <IconUpload
          size={20}
          color="var(--mantine-color-blue-6)"
          stroke={1.5}
          className="mb-2 mx-auto"
        />
        <Text size="sm" align="center">
          Drag images here or click to select files
        </Text>
        <Dropzone.Accept />
      </Dropzone>
      <button className="w-full py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-400">
        Submit Review
      </button>
    </form>
  );
};

const openModal = () =>
  modals.open({
    title: "Review",
    children: <ReviewForm />,
  });

const DisplayedImages = ({ imageList }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
        setSelectedIndex(index);
      }
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div style={{ position: "relative", width: 400, height: 400 }}>
      <div ref={emblaRef} style={{ overflow: "hidden", height: "100%" }}>
        <div style={{ display: "flex" }}>
          {imageList.map((img, idx) => (
            <div
              key={idx}
              style={{
                flex: "0 0 100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={img}
                alt={`Product ${idx}`}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Thumbnails */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          width: "60%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          background: "rgba(0,0,0,0.4)",
          padding: "4px 1px",
          borderRadius: 8,
        }}
      >
        {imageList.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumbnail ${idx}`}
            onClick={() => scrollTo(idx)}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              border:
                selectedIndex === idx
                  ? "2px solid #1c7ed6"
                  : "2px solid transparent",
              cursor: "pointer",
              borderRadius: 4,
            }}
          />
        ))}
      </div>
    </div>
  );
};
const reviews = [
  {
    name: "Alice Johnson",
    time: "2 hours ago",
    rating: 5,
    feedback: "Excellent service! The team was very professional.",
  },
  {
    name: "Mark Rivera",
    time: "1 day ago",
    rating: 3,
    feedback: "It was okay, but there’s room for improvement.",
  },
  {
    name: "Sophia Lee",
    time: "3 days ago",
    rating: 1,
    feedback: "Really disappointed. Not what I expected.",
  },
];

const ReviewList = () => {
  return (
    <div className="w-full">
      <Select
        data={["best", "poor"]}
        className=" mb-4 w-[120px]"
        placeholder="sort by ratings (best)"
      ></Select>

      <div className="space-y-4 w-full">
        {reviews.map((review, index) => (
          <Card
            key={index}
            shadow="sm"
            radius="md"
            padding="lg"
            className="w-full"
            style={{ width: "100%" }}
          >
            <Group align="center" mb="sm">
              <Avatar radius="xl"></Avatar>
              <div>
                <Text fw={500}>{review.name}</Text>
                <Text size="xs" c="dimmed">
                  {review.time}
                </Text>
              </div>
            </Group>

            <Group spacing="xs" mb="sm">
              <Rating value={review.rating}></Rating>
            </Group>

            <Text size="sm">{review.feedback}</Text>
          </Card>
        ))}

        <Button>Show more...</Button>
      </div>
    </div>
  );
};

export default ProductOverview;
