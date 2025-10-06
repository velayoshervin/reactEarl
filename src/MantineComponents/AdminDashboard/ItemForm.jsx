import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextInput,
  NumberInput,
  Select,
  MultiSelect,
  Image,
  Text,
} from "@mantine/core";
import { getEvents } from "../../ItemsAxios";
import { IconVideo, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";

const categoryOptions = [
  "Decoration",
  "Furniture",
  "Catering",
  "Ceiling",
  "Food Enhancement",
  "Cakes",
  "Performer",
  "Lighting",
  "Coordination",
  "Host",
  "Hair & Makeup",
  "Sound System",
  "Photo & Video",
  "Equipment",
  "Flowers",
  "Transport",
  "Styling",
  "Full Package",
].map((item) => ({ label: item, value: item }));

const ItemForm = ({ opened, close, onSubmit }) => {
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [perUnitExcess, setPerUnitExcess] = useState(0);
  const [category, setCategory] = useState(null);
  const [type, setType] = useState(null);
  const [pax, setPax] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false); // ⬅️ added

  const cloudName = "dhsouejqf";
  const photoPreset = "unsigned_itemPhoto_upload";
  const videoPreset = "unsigned_itemVideo_upload";

  // Fetch events
  useEffect(() => {
    getEvents()
      .then((res) => setEvents(res?.data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      videos.forEach((v) => URL.revokeObjectURL(v.preview));
    };
  }, []);

  const eventOptions = events.map((e) => ({
    label: e.eventName,
    value: e.id.toString(),
  }));

  // ⬇️ updated handleSubmit with uploads
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // upload all photos
      const uploadedPhotos = await Promise.all(
        photos.map((p) => uploadToCloudinary(p.file, "image", photoPreset))
      );

      // upload all videos
      const uploadedVideos = await Promise.all(
        videos.map((v) => uploadToCloudinary(v.file, "video", videoPreset))
      );

      const itemDetails = {
        name,
        description,
        price,
        perUnitExcess,
        category,
        type,
        pax,
        recommendedForEvents: selectedEvents.map((id) => Number(id)),
        photos: uploadedPhotos.map((res) => res.secure_url),
        videos: uploadedVideos.map((res) => res.secure_url),
      };

      onSubmit(itemDetails);
      close();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file, resourceType, preset) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(url, { method: "POST", body: formData });

    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Item Form"
      centered
      size={"xl"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Photo Dropzone */}
        <Dropzone accept={["image/jpeg", "image/png"]} onDrop={handlePhotoDrop}>
          <div className="flex flex-col items-center justify-center ">
            <IconPhoto size={40} className="mb-2" />
            <Text>Drop photos here or click to upload</Text>
            <Text size="xs" color="dimmed">
              Supports JPG, PNG
            </Text>
          </div>
        </Dropzone>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {photos.map((p, index) => (
            <div
              key={index}
              className="relative rounded overflow-hidden shadow group"
            >
              <Image
                src={p.preview}
                alt={p.file?.name || "photo"}
                height={120}
                fit="cover"
              />
              <Text size="xs" align="center" mt={4}>
                {p.file?.name || "Unnamed"}
              </Text>
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                onClick={() => removePhoto(index)}
              >
                <IconX size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Video Dropzone */}
        <Dropzone
          accept={["video/mp4", "video/webm", "video/quicktime", "video/*"]}
          maxSize={100 * 1024 ** 2}
          onDrop={handleVideoDrop}
        >
          <div className="flex flex-col items-center justify-center ">
            <IconVideo size={40} className="mb-2" />
            <Text>Drop videos here or click to upload</Text>
            <Text size="xs" color="dimmed">
              Supports MP4, WebM, MOV
            </Text>
          </div>
        </Dropzone>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {videos.map((v, index) => (
            <div
              key={index}
              className="relative rounded overflow-hidden shadow group"
            >
              <video
                src={v.preview}
                controls
                width="100%"
                height="120"
                className="object-cover"
              />
              <Text size="xs" align="center" mt={4}>
                {v.file?.name || "Unnamed"}
              </Text>
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                onClick={() => removeVideo(index)}
              >
                <IconX size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Name"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="default"
            withAsterisk
          />
          <TextInput
            label="Description"
            placeholder="Item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="default"
            withAsterisk
          />
          <NumberInput
            label="Price"
            value={price}
            onChange={setPrice}
            precision={2}
            min={0}
            placeholder="0.00"
          />
          <NumberInput
            label="Per Unit Excess"
            value={perUnitExcess}
            onChange={setPerUnitExcess}
            precision={2}
            min={0}
            placeholder="0.00"
          />
          <Select
            label="Category"
            placeholder="Select category"
            data={categoryOptions}
            value={category}
            onChange={setCategory}
          />

          <label className="flex flex-col gap-1">
            Type
            <select
              value={type ?? ""}
              onChange={(e) => setType(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="package">Package</option>
              <option value="add-on">Add-on</option>
              <option value="performer">Performer</option>
            </select>
          </label>

          <NumberInput label="Pax" value={pax} onChange={setPax} min={0} />
          <MultiSelect
            label="Recommend for Events:"
            placeholder="Select events"
            data={eventOptions}
            value={selectedEvents}
            onChange={setSelectedEvents}
          />
        </div>

        <Button type="submit" fullWidth loading={loading}>
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Modal>
  );
};

export default ItemForm;
