import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextInput } from "@mantine/core";
import {
  Modal,
  Button,
  NumberInput,
  Select,
  MultiSelect,
  Textarea,
  SimpleGrid,
  AspectRatio,
  Text,
  Card,
  Group,
  Badge,
  Image,
} from "@mantine/core";
import {
  IconX,
  IconPhoto,
  IconVideo,
  IconVideoPlus,
  IconPhotoPlus,
} from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Tabs } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

const PackageForm = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  const [packageName, setPackageName] = useState("");
  const [bundleIds, setBundleIds] = useState([]);
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("images");
  const cloudName = "dhsouejqf";
  const photoPreset = "unsigned_itemPhoto_upload";
  const videoPreset = "unsigned_itemVideo_upload";

  const handlePhotoDrop = (files) => {
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...mapped]);
  };

  const handleVideoDrop = (files) => {
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setVideos((prev) => [...prev, ...mapped]);
  };

  const removePhoto = (index) =>
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  const removeVideo = (index) =>
    setVideos((prev) => prev.filter((_, i) => i !== index));

  const uploadToCloudinary = async (file, type, preset) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    const res = await fetch(url, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload new photos only
      const newPhotos = await Promise.all(
        photos
          .filter((p) => p.file)
          .map((p) => uploadToCloudinary(p.file, "image", photoPreset))
      );
      const finalPhotos = [
        ...newPhotos.map((res) => ({ url: res.secure_url })),
        ...photos.filter((p) => p.url).map((p) => ({ id: p.id, url: p.url })),
      ];

      // Upload new videos only
      const newVideos = await Promise.all(
        videos
          .filter((v) => v.file)
          .map((v) => uploadToCloudinary(v.file, "video", videoPreset))
      );
      const finalVideos = [
        ...newVideos.map((res) => ({ url: res.secure_url })),
        ...videos.filter((v) => v.url).map((v) => ({ id: v.id, url: v.url })),
      ];

      const payload = {
        packageName,
        description,
        imageUrls: finalPhotos.map((p) => p.url),
        videoUrls: finalVideos.map((v) => v.url),
        bundleIds,
      };

      console.log(payload);

      const result = await axios.post(
        "http://localhost:8080/api/packages",
        payload,
        { withCredentials: true }
      );
      if (result) {
        alert(JSON.stringify(result.data));

        setPhotos([]);
        setVideos([]);
        setBundleIds([]);
        setPackageName("");
        setDescription("");
      }

      close();
    } catch (err) {
      console.error(err);
      alert("Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getBundles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/package-bundle",
          {
            withCredentials: true,
          }
        );
        if (res) {
          const data = res.data;
          console.log(data);
          setBundles(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getBundles();
  }, []);

  const PhotoPreviewPlusUpload = () => (
    <>
      <SimpleGrid
        cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
        spacing="md"
        verticalSpacing="md"
        className="p-4"
      >
        {photos.map((p, index) => (
          <AspectRatio
            ratio={1}
            key={index}
            className="relative group rounded-md overflow-hidden shadow"
          >
            <Image
              src={p.preview || p.url}
              radius="md"
              fit="cover"
              alt={`Photo ${index}`}
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition w-[30px] h-[30px]"
              onClick={() => removePhoto(index)}
            >
              <IconX size={16} />
            </button>
          </AspectRatio>
        ))}
        <AspectRatio ratio={1}>
          <Dropzone
            onDrop={handlePhotoDrop}
            accept={IMAGE_MIME_TYPE}
            maxSize={5 * 1024 ** 2} // 5 MB
            onReject={(files) => {
              files.forEach((f) => {
                showNotification({
                  title: "Upload failed",
                  message: `${f.file.name}: ${f.errors[0].message}`,
                  color: "red",
                });
              });
            }}
            radius="md"
            style={{
              border: "2px dashed var(--mantine-color-gray-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Group align="center" justify="center" gap="xs">
              <IconPhotoPlus size={80} stroke={1.5} />
              <Text size="sm" c="dimmed">
                Add photo
              </Text>
            </Group>
          </Dropzone>
        </AspectRatio>
      </SimpleGrid>
    </>
  );

  const VideoPreviewPlusUpload = () => {
    return (
      <SimpleGrid
        cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
        spacing="md"
        verticalSpacing="md"
        className="p-4"
      >
        {videos.map((v, index) => (
          <AspectRatio
            ratio={1}
            key={index}
            className="relative group rounded-md overflow-hidden shadow"
          >
            <video
              src={v.preview || v.url}
              controls
              className="w-full h-full object-cover rounded-md"
            />

            <button
              type="button"
              className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
              onClick={() => removeVideo(index)}
            >
              <IconX size={16} />
            </button>
          </AspectRatio>
        ))}
        <AspectRatio ratio={1}>
          <Dropzone
            onDrop={handleVideoDrop}
            accept={["video/mp4", "video/webm", "video/quicktime", "video/*"]}
            maxSize={100 * 1024 ** 2} // 100 MB
            onReject={(files) => {
              alert(`File too large: ${files[0].file.name}`);
            }}
            radius="md"
            style={{
              border: "2px dashed var(--mantine-color-gray-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Group align="center" justify="center" gap="xs">
              <IconVideoPlus size={80} stroke={1.5} />
              <Text size="sm" c="dimmed">
                Add Video
              </Text>
            </Group>
          </Dropzone>
        </AspectRatio>
      </SimpleGrid>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Text size={"lg"}>Create Package</Text>
      <TextInput
        label="Package Name"
        value={packageName}
        onChange={(event) => setPackageName(event.currentTarget.value)}
      ></TextInput>
      <Textarea
        label="description"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
      />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {bundles.map((b) => (
          <>
            <Card
              key={b.packageBundleId}
              shadow="md"
              radius="md"
              p="lg"
              withBorder
            >
              <Group justify="space-between" mb="sm">
                <Text fw={600} fz="lg">
                  {b.name}
                </Text>
                {b.customizable && <Badge color="teal">Customizable</Badge>}
              </Group>

              <Text fz="sm" c="dimmed" mb="md">
                {b.description}
              </Text>

              <Text fw={500} mb={4}>
                Inclusions:
              </Text>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {b.items.map((item) => (
                  <li key={item.itemId}>
                    <Text fz="sm">{item.name}</Text>
                  </li>
                ))}
              </ul>

              <Button
                mt="md"
                fullWidth
                color="blue"
                variant={
                  bundleIds.includes(b.packageBundleId) ? "filled" : "light"
                }
                onClick={() => {
                  setBundleIds((prev) => {
                    if (prev.includes(b.packageBundleId)) {
                      // remove if already selected
                      return prev.filter((id) => id !== b.packageBundleId);
                    } else {
                      // add if not yet included
                      return [...prev, b.packageBundleId];
                    }
                  });
                }}
              >
                {bundleIds.includes(b.packageBundleId)
                  ? `Selected ${b.name}`
                  : `Select ${b.name}`}
              </Button>
            </Card>
          </>
        ))}
      </SimpleGrid>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="images" leftSection={<IconPhoto size={12} />}>
            Images
          </Tabs.Tab>
          <Tabs.Tab value="videos" leftSection={<IconVideo size={12} />}>
            Videos
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="images">{<PhotoPreviewPlusUpload />}</Tabs.Panel>
        <Tabs.Panel value="videos">{<VideoPreviewPlusUpload />}</Tabs.Panel>
      </Tabs>
      <Button type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  );
};

export default PackageForm;
