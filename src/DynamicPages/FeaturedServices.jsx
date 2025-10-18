// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

// // Define video MIME types manually
// const VIDEO_MIME_TYPE = [
//   "video/mp4",
//   "video/mpeg",
//   "video/ogg",
//   "video/webm",
//   "video/x-msvideo",
//   "video/quicktime",
// ];

// const cloudName = "dhsouejqf";
// const photoPreset = "unsigned_itemPhoto_upload";
// const videoPreset = "unsigned_itemVideo_upload";

// const FeaturedServicesForm = ({
//   existingService = null,
//   onSuccess,
//   onCancel,
// }) => {
//   const isEdit = !!existingService;

//   // Form state
//   const [serviceName, setServiceName] = useState("");
//   const [serviceDescription, setServiceDescription] = useState("");
//   const [heroVideoUrl, setHeroVideoUrl] = useState("");
//   const [heroDescription, setHeroDescription] = useState("");
//   const [galleryTitle, setGalleryTitle] = useState("");
//   const [galleryDescription, setGalleryDescription] = useState("");
//   const [galleryImages, setGalleryImages] = useState([]); // Mix of {url, file, preview}
//   const [bloopersVideo, setBloopersVideo] = useState("");
//   const [bloopersTitle, setBloopersTitle] = useState("");
//   const [bloopersDescription, setBloopersDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   // File states for new uploads
//   const [heroVideoFile, setHeroVideoFile] = useState(null);
//   const [bloopersVideoFile, setBloopersVideoFile] = useState(null);

//   // Load existing data when editing
//   useEffect(() => {
//     if (existingService) {
//       setServiceName(existingService.serviceName || "");
//       setServiceDescription(existingService.serviceDescription || "");
//       setHeroVideoUrl(existingService.heroVideoUrl || "");
//       setHeroDescription(existingService.heroDescription || "");
//       setGalleryTitle(existingService.galleryTitle || "");
//       setGalleryDescription(existingService.galleryDescription || "");

//       // Convert existing image URLs to gallery format
//       if (existingService.galleryImages) {
//         const existingImages = existingService.galleryImages.map((url) => ({
//           url,
//           preview: url,
//         }));
//         setGalleryImages(existingImages);
//       }

//       setBloopersVideo(existingService.bloopersVideo || "");
//       setBloopersTitle(existingService.bloopersTitle || "");
//       setBloopersDescription(existingService.bloopersDescription || "");
//     }
//   }, [existingService]);

//   const handlePhotoDrop = (files) => {
//     const mapped = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//       isNew: true,
//     }));
//     setGalleryImages((prev) => [...prev, ...mapped]);
//   };

//   const handleHeroVideoDrop = (files) => {
//     if (files.length > 0) {
//       const file = files[0];
//       setHeroVideoFile({
//         file,
//         preview: URL.createObjectURL(file),
//         isNew: true,
//       });
//       setHeroVideoUrl(""); // Clear URL when file is dropped
//     }
//   };

//   const handleBloopersVideoDrop = (files) => {
//     if (files.length > 0) {
//       const file = files[0];
//       setBloopersVideoFile({
//         file,
//         preview: URL.createObjectURL(file),
//         isNew: true,
//       });
//       setBloopersVideo(""); // Clear URL when file is dropped
//     }
//   };

//   const removePhoto = (index) => {
//     setGalleryImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeHeroVideo = () => {
//     setHeroVideoFile(null);
//     setHeroVideoUrl("");
//   };

//   const removeBloopersVideo = () => {
//     setBloopersVideoFile(null);
//     setBloopersVideo("");
//   };

//   const uploadToCloudinary = async (file, type, preset) => {
//     const url = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", preset);
//     const res = await fetch(url, { method: "POST", body: formData });
//     if (!res.ok) throw new Error("Upload failed");
//     return res.json();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let finalHeroVideoUrl = heroVideoUrl;
//       let finalBloopersVideoUrl = bloopersVideo;
//       let finalGalleryImages = [];

//       // Upload new hero video if present
//       if (heroVideoFile?.file) {
//         console.log("Uploading new hero video...");
//         const heroVideoRes = await uploadToCloudinary(
//           heroVideoFile.file,
//           "video",
//           videoPreset
//         );
//         finalHeroVideoUrl = heroVideoRes.secure_url;
//       }

//       // Upload new blooper video if present
//       if (bloopersVideoFile?.file) {
//         console.log("Uploading new blooper video...");
//         const bloopersVideoRes = await uploadToCloudinary(
//           bloopersVideoFile.file,
//           "video",
//           videoPreset
//         );
//         finalBloopersVideoUrl = bloopersVideoRes.secure_url;
//       }

//       // Handle gallery images - upload new ones, keep existing URLs
//       const newImageUploads = galleryImages
//         .filter((img) => img.file && img.isNew)
//         .map((img) => uploadToCloudinary(img.file, "image", photoPreset));

//       if (newImageUploads.length > 0) {
//         const uploadedNewImages = await Promise.all(newImageUploads);
//         const newImageUrls = uploadedNewImages.map((res) => res.secure_url);

//         // Combine new URLs with existing URLs
//         const existingImageUrls = galleryImages
//           .filter((img) => !img.file && img.url)
//           .map((img) => img.url);

//         finalGalleryImages = [...existingImageUrls, ...newImageUrls];
//       } else {
//         // No new images, just use existing URLs
//         finalGalleryImages = galleryImages
//           .filter((img) => img.url)
//           .map((img) => img.url);
//       }

//       const payload = {
//         serviceName,
//         serviceDescription,
//         heroVideoUrl: finalHeroVideoUrl,
//         heroDescription,
//         galleryTitle,
//         galleryDescription,
//         galleryImages: finalGalleryImages,
//         bloopersVideo: finalBloopersVideoUrl,
//         bloopersTitle,
//         bloopersDescription,
//       };

//       console.log("Final Payload:", payload);

//       let result;
//       if (isEdit) {
//         // UPDATE existing service
//         result = await axios.put(
//           `http://localhost:8080/api/featured-services/${existingService.featuredServiceId}`,
//           payload,
//           { withCredentials: true }
//         );
//       } else {
//         // CREATE new service
//         result = await axios.post(
//           "http://localhost:8080/api/featured-services",
//           payload,
//           { withCredentials: true }
//         );
//       }

//       if (result) {
//         alert(`Service ${isEdit ? "updated" : "created"} successfully!`);
//         if (onSuccess) onSuccess(result.data);
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert(`Failed to ${isEdit ? "update" : "create"} service.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">
//         {isEdit ? "Edit" : "Create"} Featured Service
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Info */}
//         <div className="grid grid-cols-1 gap-4">
//           <input
//             type="text"
//             placeholder="Service Name"
//             value={serviceName}
//             onChange={(e) => setServiceName(e.target.value)}
//             className="p-2 border rounded"
//             required
//           />
//           <textarea
//             placeholder="Service Description"
//             value={serviceDescription}
//             onChange={(e) => setServiceDescription(e.target.value)}
//             className="p-2 border rounded"
//             rows="3"
//           />
//         </div>

//         {/* Hero Video Section */}
//         <div className="border p-4 rounded">
//           <h2 className="text-lg font-semibold mb-3">Hero Video</h2>
//           <input
//             type="text"
//             placeholder="Hero Description"
//             value={heroDescription}
//             onChange={(e) => setHeroDescription(e.target.value)}
//             className="p-2 border rounded mb-3 w-full"
//           />

//           <input
//             type="text"
//             placeholder="Enter Hero Video URL (or upload file below)"
//             value={heroVideoUrl}
//             onChange={(e) => setHeroVideoUrl(e.target.value)}
//             className="p-2 border rounded mb-3 w-full"
//           />

//           {heroVideoFile || heroVideoUrl ? (
//             <div className="mb-3">
//               <video controls className="max-w-xs mb-2">
//                 <source
//                   src={heroVideoFile?.preview || heroVideoUrl}
//                   type="video/mp4"
//                 />
//               </video>
//               <button
//                 type="button"
//                 onClick={removeHeroVideo}
//                 className="bg-red-500 text-white px-3 py-1 rounded"
//               >
//                 Remove Hero Video
//               </button>
//             </div>
//           ) : (
//             <Dropzone
//               onDrop={handleHeroVideoDrop}
//               accept={VIDEO_MIME_TYPE}
//               maxFiles={1}
//               className="border-dashed border-2 p-4 text-center cursor-pointer"
//             >
//               <div>Drop hero video here (max 1 file) or click to browse</div>
//             </Dropzone>
//           )}
//         </div>

//         {/* Gallery Images Section - DROPZONE WORKS EVEN WITH EXISTING IMAGES */}
//         <div className="border p-4 rounded">
//           <h2 className="text-lg font-semibold mb-3">Gallery Images</h2>
//           <input
//             type="text"
//             placeholder="Gallery Title"
//             value={galleryTitle}
//             onChange={(e) => setGalleryTitle(e.target.value)}
//             className="p-2 border rounded mb-3 w-full"
//           />
//           <input
//             type="text"
//             placeholder="Gallery Description"
//             value={galleryDescription}
//             onChange={(e) => setGalleryDescription(e.target.value)}
//             className="p-2 border rounded mb-3 w-full"
//           />

//           {/* Display existing and new images */}
//           {galleryImages.length > 0 && (
//             <div className="grid grid-cols-3 gap-2 mb-3">
//               {galleryImages.map((img, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={img.preview || img.url}
//                     alt={`Preview ${index}`}
//                     className="w-full h-24 object-cover rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removePhoto(index)}
//                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* DROPZONE - Always visible to add more images */}
//           <Dropzone
//             onDrop={handlePhotoDrop}
//             accept={IMAGE_MIME_TYPE}
//             multiple
//             className="border-dashed border-2 p-4 text-center cursor-pointer"
//           >
//             <div>
//               {galleryImages.length > 0
//                 ? "Drop more images here or click to browse"
//                 : "Drop gallery images here or click to browse"}
//             </div>
//           </Dropzone>
//         </div>

//         {/* Blooper Video Section */}
//         <div className="border p-4 rounded">
//           <h2 className="text-lg font-semibold mb-3">Blooper Video</h2>
//           <input
//             type="text"
//             placeholder="Blooper Title"
//             value={bloopersTitle}
//             onChange={(e) => setBloopersTitle(e.target.value)}
//             className="p-2 border rounded mb-3 w-full"
//           />
//           <input
//             type="text"
//             placeholder="Blooper Description"
//             value={bloopersDescription}
//             onChange={(e) => setBloopersDescription(e.target.value)}
//             className="p-2 border rounded mb-3 w-full"
//           />

//           <input
//             type="text"
//             placeholder="Enter Blooper Video URL (or upload file below)"
//             value={bloopersVideo}
//             onChange={(e) => setBloopersVideo(e.target.value)}
//             className="p-2 border rounded mb-3 w-full"
//           />

//           {bloopersVideoFile || bloopersVideo ? (
//             <div className="mb-3">
//               <video controls className="max-w-xs mb-2">
//                 <source
//                   src={bloopersVideoFile?.preview || bloopersVideo}
//                   type="video/mp4"
//                 />
//               </video>
//               <button
//                 type="button"
//                 onClick={removeBloopersVideo}
//                 className="bg-red-500 text-white px-3 py-1 rounded"
//               >
//                 Remove Blooper Video
//               </button>
//             </div>
//           ) : (
//             <Dropzone
//               onDrop={handleBloopersVideoDrop}
//               accept={VIDEO_MIME_TYPE}
//               maxFiles={1}
//               className="border-dashed border-2 p-4 text-center cursor-pointer"
//             >
//               <div>Drop blooper video here (max 1 file) or click to browse</div>
//             </Dropzone>
//           )}
//         </div>

//         {/* Form Actions */}
//         <div className="flex gap-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
//           >
//             {loading
//               ? isEdit
//                 ? "Updating..."
//                 : "Creating..."
//               : isEdit
//               ? "Update Service"
//               : "Create Service"}
//           </button>

//           {onCancel && (
//             <button
//               type="button"
//               onClick={onCancel}
//               className="bg-gray-500 text-white px-6 py-2 rounded"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FeaturedServicesForm;

{
  /* <FeaturedServicesForm
  onSuccess={(newService) => console.log("Created:", newService)}
/>;

<FeaturedServicesForm
  existingService={serviceData}
  onSuccess={(updatedService) => console.log("Updated:", updatedService)}
  onCancel={() => setEditing(false)}
/>; */
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

// Define video MIME types manually
const VIDEO_MIME_TYPE = [
  "video/mp4",
  "video/mpeg",
  "video/ogg",
  "video/webm",
  "video/x-msvideo",
  "video/quicktime",
];

const cloudName = "dhsouejqf";
const photoPreset = "unsigned_itemPhoto_upload";
const videoPreset = "unsigned_itemVideo_upload";

const FeaturedServicesForm = ({
  existingService = null,
  onSuccess,
  onCancel,
}) => {
  const isEdit = !!existingService;

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [bloopersVideoFile, setBloopersVideoFile] = useState(null);
  const [bloopersTitle, setBloopersTitle] = useState("");
  const [bloopersDescription, setBloopersDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // File states for new uploads
  const [heroVideoFile, setHeroVideoFile] = useState(null);

  // Load existing data when editing
  useEffect(() => {
    if (existingService) {
      setServiceName(existingService.serviceName || "");
      setServiceDescription(existingService.serviceDescription || "");
      setHeroVideoUrl(existingService.heroVideoUrl || "");
      setHeroDescription(existingService.heroDescription || "");
      setGalleryTitle(existingService.galleryTitle || "");
      setGalleryDescription(existingService.galleryDescription || "");

      // Convert existing image URLs to gallery format
      if (existingService.galleryImages) {
        const existingImages = existingService.galleryImages.map((url) => ({
          url,
          preview: url,
        }));
        setGalleryImages(existingImages);
      }

      // For blooper video, if it exists, show it as a preview
      if (existingService.bloopersVideo) {
        setBloopersVideoFile({
          url: existingService.bloopersVideo,
          preview: existingService.bloopersVideo,
        });
      }

      setBloopersTitle(existingService.bloopersTitle || "");
      setBloopersDescription(existingService.bloopersDescription || "");
    }
  }, [existingService]);

  const handlePhotoDrop = (files) => {
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));
    setGalleryImages((prev) => [...prev, ...mapped]);
  };

  const handleHeroVideoDrop = (files) => {
    if (files.length > 0) {
      const file = files[0];
      setHeroVideoFile({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      });
      setHeroVideoUrl(""); // Clear URL when file is dropped
    }
  };

  const handleBloopersVideoDrop = (files) => {
    if (files.length > 0) {
      const file = files[0];
      setBloopersVideoFile({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      });
    }
  };

  const removePhoto = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeHeroVideo = () => {
    setHeroVideoFile(null);
    setHeroVideoUrl("");
  };

  const removeBloopersVideo = () => {
    setBloopersVideoFile(null);
  };

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
      let finalHeroVideoUrl = heroVideoUrl;
      let finalBloopersVideoUrl = "";
      let finalGalleryImages = [];

      // Upload new hero video if present
      if (heroVideoFile?.file) {
        console.log("Uploading new hero video...");
        const heroVideoRes = await uploadToCloudinary(
          heroVideoFile.file,
          "video",
          videoPreset
        );
        finalHeroVideoUrl = heroVideoRes.secure_url;
      }

      // Upload blooper video if present (file upload only)
      if (bloopersVideoFile?.file) {
        console.log("Uploading new blooper video...");
        const bloopersVideoRes = await uploadToCloudinary(
          bloopersVideoFile.file,
          "video",
          videoPreset
        );
        finalBloopersVideoUrl = bloopersVideoRes.secure_url;
      } else if (bloopersVideoFile?.url) {
        // Use existing blooper video URL
        finalBloopersVideoUrl = bloopersVideoFile.url;
      }

      // Handle gallery images - upload new ones, keep existing URLs
      const newImageUploads = galleryImages
        .filter((img) => img.file && img.isNew)
        .map((img) => uploadToCloudinary(img.file, "image", photoPreset));

      if (newImageUploads.length > 0) {
        const uploadedNewImages = await Promise.all(newImageUploads);
        const newImageUrls = uploadedNewImages.map((res) => res.secure_url);

        // Combine new URLs with existing URLs
        const existingImageUrls = galleryImages
          .filter((img) => !img.file && img.url)
          .map((img) => img.url);

        finalGalleryImages = [...existingImageUrls, ...newImageUrls];
      } else {
        // No new images, just use existing URLs
        finalGalleryImages = galleryImages
          .filter((img) => img.url)
          .map((img) => img.url);
      }

      const payload = {
        serviceName,
        serviceDescription,
        heroVideoUrl: finalHeroVideoUrl,
        heroDescription,
        galleryTitle,
        galleryDescription,
        galleryImages: finalGalleryImages,
        bloopersVideo: finalBloopersVideoUrl,
        bloopersTitle,
        bloopersDescription,
      };

      console.log("Final Payload:", payload);

      let result;
      if (isEdit) {
        // UPDATE existing service
        result = await axios.put(
          `http://localhost:8080/api/featured-services/${existingService.featuredServiceId}`,
          payload,
          { withCredentials: true }
        );
      } else {
        // CREATE new service
        result = await axios.post(
          "http://localhost:8080/api/featured-services",
          payload,
          { withCredentials: true }
        );
      }

      if (result) {
        alert(`Service ${isEdit ? "updated" : "created"} successfully!`);
        if (onSuccess) onSuccess(result.data);
      }
    } catch (err) {
      console.error("Error:", err);
      alert(`Failed to ${isEdit ? "update" : "create"} service.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isEdit ? "Edit" : "Create"} Featured Service
        </h1>
        <p className="text-gray-600 mb-6">
          {isEdit
            ? "Update your service details"
            : "Add a new service to showcase"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Wedding Photography"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Description
              </label>
              <textarea
                placeholder="Describe what this service offers..."
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
          </div>

          {/* Hero Video Section */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Hero Video
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Description
              </label>
              <input
                type="text"
                placeholder="Describe what this video shows..."
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-3 hidden">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Video URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://example.com/hero-video.mp4"
                value={heroVideoUrl}
                onChange={(e) => setHeroVideoUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter URL or upload file below
              </p>
            </div>

            {heroVideoFile || heroVideoUrl ? (
              <div className="mb-4 p-4 bg-white rounded-lg border">
                <video controls className="w-full max-w-md mb-3 rounded">
                  <source
                    src={heroVideoFile?.preview || heroVideoUrl}
                    type="video/mp4"
                  />
                </video>
                <button
                  type="button"
                  onClick={removeHeroVideo}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Remove Hero Video
                </button>
              </div>
            ) : (
              <Dropzone
                onDrop={handleHeroVideoDrop}
                accept={VIDEO_MIME_TYPE}
                maxFiles={1}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
              >
                <div className="text-gray-600">
                  <div className="text-lg font-medium mb-2">
                    Drop hero video here
                  </div>
                  <div className="text-sm">MP4, WebM, OGG (max 1 file)</div>
                  <div className="text-sm text-gray-500 mt-1">
                    or click to browse
                  </div>
                </div>
              </Dropzone>
            )}
          </div>

          {/* Gallery Images Section */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Gallery Images
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gallery Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Our Portfolio"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gallery Description
                </label>
                <input
                  type="text"
                  placeholder="Describe your gallery..."
                  value={galleryDescription}
                  onChange={(e) => setGalleryDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Display existing and new images */}
            {galleryImages.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Preview ({galleryImages.length} images)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview || img.url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DROPZONE - Always visible to add more images */}
            <Dropzone
              onDrop={handlePhotoDrop}
              accept={IMAGE_MIME_TYPE}
              multiple
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
            >
              <div className="text-gray-600">
                <div className="text-lg font-medium mb-2">
                  {galleryImages.length > 0
                    ? "Add More Images"
                    : "Add Gallery Images"}
                </div>
                <div className="text-sm">
                  JPG, PNG, WebP (multiple files allowed)
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  or click to browse
                </div>
              </div>
            </Dropzone>
          </div>

          {/* Blooper Video Section - SIMPLIFIED (No URL input) */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Blooper Video
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blooper Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Behind the Scenes"
                  value={bloopersTitle}
                  onChange={(e) => setBloopersTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blooper Description
                </label>
                <input
                  type="text"
                  placeholder="Describe the blooper video..."
                  value={bloopersDescription}
                  onChange={(e) => setBloopersDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {bloopersVideoFile ? (
              <div className="p-4 bg-white rounded-lg border">
                <video controls className="w-full max-w-md mb-3 rounded">
                  <source
                    src={bloopersVideoFile.preview || bloopersVideoFile.url}
                    type="video/mp4"
                  />
                </video>
                <button
                  type="button"
                  onClick={removeBloopersVideo}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Remove Blooper Video
                </button>
              </div>
            ) : (
              <Dropzone
                onDrop={handleBloopersVideoDrop}
                accept={VIDEO_MIME_TYPE}
                maxFiles={1}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
              >
                <div className="text-gray-600">
                  <div className="text-lg font-medium mb-2">
                    Drop blooper video here
                  </div>
                  <div className="text-sm">MP4, WebM, OGG (max 1 file)</div>
                  <div className="text-sm text-gray-500 mt-1">
                    or click to browse
                  </div>
                </div>
              </Dropzone>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Update Service"
              ) : (
                "Create Service"
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeaturedServicesForm;
