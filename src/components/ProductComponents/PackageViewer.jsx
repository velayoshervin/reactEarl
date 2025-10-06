import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Text,
  Group,
  Image,
  Center,
  Select,
} from "@mantine/core";

import { IconVideo, IconPhoto } from "@tabler/icons-react";

const PackageViewer = ({ pkg }) => {
  const [view, setView] = useState("slideshow"); // slideshow or video
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [videoModal, setVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(
    pkg?.videos?.[0]?.videoId || null
  );

  // Auto-advance slideshow every 3 seconds
  useEffect(() => {
    if (view !== "slideshow" || !pkg?.photos?.length) return;
    const timer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % pkg.photos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [view, pkg?.photos]);

  if (!pkg) return null;

  return (
    <div className="max-w-xl mx-auto p-4 rounded shadow">
      <Text size="xl" weight={700}>
        {pkg.name} - ₱{pkg.price.toLocaleString()}
      </Text>
      <Text size="sm" c="dimmed" className="mb-2">
        {pkg.description} | Pax: {pkg.pax}
      </Text>

      <Group spacing="xs" mb="md">
        <Button
          color="gray"
          variant={view === "slideshow" ? "filled" : "outline"}
          onClick={() => setView("slideshow")}
        >
          <IconPhoto />
        </Button>
        <Button
          variant={view === "video" ? "filled" : "outline"}
          onClick={() => setVideoModal(true)}
        >
          <IconVideo />
        </Button>
      </Group>

      {/* Slideshow */}
      {view === "slideshow" && pkg.photos?.length > 0 && (
        <div className="relative">
          <Image
            src={pkg.photos[currentPhoto].url}
            alt={`photo ${currentPhoto + 1}`}
            radius="md"
            height={300}
            fit="cover"
          />

          {/* Previous / Next */}
          <Group position="apart" mt="sm">
            <Button
              size="xs"
              onClick={() =>
                setCurrentPhoto(
                  (prev) => (prev - 1 + pkg.photos.length) % pkg.photos.length
                )
              }
            >
              Previous
            </Button>
            <Text size="xs">
              {currentPhoto + 1} / {pkg.photos.length}
            </Text>
            <Button
              size="xs"
              onClick={() =>
                setCurrentPhoto((prev) => (prev + 1) % pkg.photos.length)
              }
            >
              Next
            </Button>
          </Group>

          <Group spacing="xs" mt="sm" position="center">
            {pkg.photos.map((photo, idx) => {
              const isActive = idx === currentPhoto;
              return (
                <div
                  key={idx}
                  style={{
                    width: isActive ? 80 : 40,
                    height: isActive ? 80 : 40,
                    border: isActive ? "2px solid blue" : "1px solid #ccc",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    overflow: "hidden",
                    borderRadius: 4,
                  }}
                  onClick={() => setCurrentPhoto(idx)}
                >
                  <Image
                    src={photo.url}
                    alt={`thumb ${idx}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              );
            })}
          </Group>
        </div>
      )}

      {/* Video Modal */}
      <Modal
        opened={videoModal}
        onClose={() => setVideoModal(false)}
        title={`${pkg.name} Video`}
        size="xl"
      >
        {pkg.videos?.length > 1 && (
          <Select
            label="Select Video"
            data={pkg.videos.map((v) => ({
              value: v.videoId.toString(),
              label: `Video ${v.videoId}`,
            }))}
            value={currentVideo?.toString()}
            onChange={(val) => setCurrentVideo(parseInt(val))}
            mb="md"
          />
        )}

        {currentVideo && (
          <Center>
            <video
              key={currentVideo}
              src={pkg.videos.find((v) => v.videoId === currentVideo)?.url}
              controls
              style={{ width: "100%" }}
            />
          </Center>
        )}
      </Modal>
    </div>
  );
};

export default PackageViewer;
