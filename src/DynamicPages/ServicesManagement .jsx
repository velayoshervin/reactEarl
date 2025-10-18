import React, { useState, useEffect } from "react";
import axios from "axios";
import FeaturedServices from "./FeaturedServices";

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/featured-services",
        { withCredentials: true }
      );
      setServices(response.data);
      console.log(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  // Delete a service
  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/featured-services/${serviceId}`,
        { withCredentials: true }
      );
      // Remove from local state
      setServices(
        services.filter((service) => service.featuredServiceId !== serviceId)
      );
      alert("Service deleted successfully!");
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service");
    }
  };

  // Handle edit success
  const handleEditSuccess = (updatedService) => {
    // Update the service in the list
    setServices(
      services.map((service) =>
        service.featuredServiceId === updatedService.featuredServiceId
          ? updatedService
          : service
      )
    );
    setEditingService(null);
  };

  // Handle create success
  const handleCreateSuccess = (newService) => {
    // Add new service to the list
    setServices([...services, newService]);
    setShowCreateForm(false);
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  // If we're editing or creating, show the form
  if (editingService || showCreateForm) {
    return (
      <FeaturedServices
        existingService={editingService}
        onSuccess={editingService ? handleEditSuccess : handleCreateSuccess}
        onCancel={() => {
          setEditingService(null);
          setShowCreateForm(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Services Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your featured services</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchServices}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">
                {services.length} service{services.length !== 1 ? "s" : ""}{" "}
                found
              </span>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>+</span>
              Create New Service
            </button>
          </div>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No services yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first service to get started
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Your First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.featuredServiceId}
                service={service}
                onEdit={() => setEditingService(service)}
                onDelete={() => handleDelete(service.featuredServiceId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Hero Video Thumbnail */}
      <div className="aspect-video bg-gray-200 relative">
        {service.heroVideoUrl && !imageError ? (
          <video
            className="w-full h-full object-cover"
            muted
            onError={() => setImageError(true)}
          >
            <source src={service.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <span className="text-4xl">🎬</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
          {service.serviceName}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.serviceDescription}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <span>📸</span>
            <span>{service.galleryImages?.length || 0} images</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎥</span>
            <span>{service.heroVideoUrl ? "Yes" : "No"} hero video</span>
          </div>
          <div className="flex items-center gap-1">
            <span>😂</span>
            <span>{service.bloopersVideo ? "Yes" : "No"} bloopers</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;
