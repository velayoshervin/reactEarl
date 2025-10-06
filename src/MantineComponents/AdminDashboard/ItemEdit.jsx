import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextInput,
  NumberInput,
  Select,
  MultiSelect,
} from "@mantine/core";
import { updateItem, getEvents } from "../../ItemsAxios";
import { IconX, IconPhoto, IconVideo } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";

const options = [
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

const ItemEdit = ({ itemId, initialData, close, opened }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [perUnitExcess, setPerUnitExcess] = useState(0);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [pax, setPax] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Photos/Videos: can be existing (url + id) or new (file + preview)
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cloudName = "dhsouejqf";
  const photoPreset = "unsigned_itemPhoto_upload";
  const videoPreset = "unsigned_itemVideo_upload";

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || 0);
      setPerUnitExcess(initialData.perUnitExcess || 0);
      setCategory(initialData.category || "");
      setType(initialData.type || "");
      setPax(initialData.pax || 0);
      if (initialData.recommendedForEvents)
        setSelectedEvents(
          initialData.recommendedForEvents.map((e) => e.id.toString())
        );

      // Set existing photos/videos
      setPhotos(initialData.photos.map((p) => ({ id: p.photoId, url: p.url })));
      setVideos(initialData.videos.map((v) => ({ id: v.videoId, url: v.url })));
    }
  }, [initialData]);

  useEffect(() => {
    getEvents()
      .then((res) => setEvents(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const eventOptions = events.map((e) => ({
    label: e.eventName,
    value: e.id.toString(),
  }));

  // Upload helper
  const uploadToCloudinary = async (file, type, preset) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    const res = await fetch(url, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
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

  const removePhoto = (index) =>
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  const removeVideo = (index) =>
    setVideos((prev) => prev.filter((_, i) => i !== index));

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

      const itemDetails = {
        name,
        description,
        price,
        perUnitExcess,
        category,
        type,
        pax,
        recommendedForEvents: selectedEvents.map((id) => Number(id)),
        photos: finalPhotos.map((p) => p.url),
        videos: finalVideos.map((v) => v.url),
      };

      console.log(itemDetails);

      await updateItem({ id: itemId, item: itemDetails });
      close();
    } catch (err) {
      console.error(err);
      alert("Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Edit Item" centered size="xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Photo Dropzone */}
        <Dropzone accept={["image/jpeg", "image/png"]} onDrop={handlePhotoDrop}>
          <div className="flex flex-col items-center justify-center">
            <IconPhoto size={40} className="mb-2" />
            <span>Drop photos here or click to upload</span>
          </div>
        </Dropzone>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {photos.map((p, index) => (
            <div
              key={index}
              className="relative rounded overflow-hidden shadow group"
            >
              <img
                src={p.preview || p.url}
                alt="photo"
                className="h-32 w-full object-cover"
              />
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
          <div className="flex flex-col items-center justify-center">
            <IconVideo size={40} className="mb-2" />
            <span>Drop videos here or click to upload</span>
          </div>
        </Dropzone>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {videos.map((v, index) => (
            <div
              key={index}
              className="relative rounded overflow-hidden shadow group"
            >
              <video
                src={v.preview || v.url}
                controls
                className="h-32 w-full object-cover"
              />
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

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            withAsterisk
          />
          <NumberInput
            label="Price"
            value={price}
            onChange={setPrice}
            precision={2}
            min={0}
          />
          <NumberInput
            label="Per Unit Excess"
            value={perUnitExcess}
            onChange={setPerUnitExcess}
            precision={2}
            min={0}
          />
          <Select
            label="Category"
            data={options}
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
            label="Recommend for Events"
            data={eventOptions}
            value={selectedEvents}
            onChange={setSelectedEvents}
          />
        </div>

        <Button type="submit" fullWidth loading={loading}>
          {loading ? "Updating..." : "Update Item"}
        </Button>
      </form>
    </Modal>
  );
};

export default ItemEdit;
