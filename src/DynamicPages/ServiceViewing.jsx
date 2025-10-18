import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ServiceViewing = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  // Fetch all services
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/featured-services",
        { withCredentials: true }
      );
      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

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

  // If a service is selected, show its detailed view
  if (selectedService) {
    return (
      <ServiceDetailView
        service={selectedService}
        onBack={() => setSelectedService(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the range of professional services we offer to make your
            events unforgettable
          </p>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Services Available
            </h3>
            <p className="text-gray-600">
              Check back later for our service offerings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.featuredServiceId}
                service={service}
                onClick={() => setSelectedService(service)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
    >
      {/* Hero Video Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
        {service.heroVideoUrl ? (
          <video
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
          >
            <source src={service.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {service.serviceName}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {service.serviceDescription}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-lg">📸</span>
            <span>{service.galleryImages?.length || 0} photos</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">😂</span>
            <span>{service.bloopersVideo ? "Bloopers" : "No Bloopers"}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
};

// Service Detail View Component
const ServiceDetailView = ({ service, onBack }) => {
  const [activeTab, setActiveTab] = useState("gallery");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 py-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>←</span>
            Back to Services
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Video */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              {service.heroVideoUrl ? (
                <video
                  className="w-full h-64 lg:h-96 object-cover"
                  controls
                  autoPlay
                  muted
                >
                  <source src={service.heroVideoUrl} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-64 lg:h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-8xl">🎬</span>
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {service.serviceName}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {service.serviceDescription}
                </p>
              </div>

              {service.heroDescription && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800">{service.heroDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("gallery")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "gallery"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📸 Gallery
            </button>
            {service.bloopersVideo && (
              <button
                onClick={() => setActiveTab("bloopers")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bloopers"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                😂 Bloopers
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "gallery" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {service.galleryTitle || "Our Gallery"}
              </h2>
              {service.galleryDescription && (
                <p className="text-gray-600 text-lg">
                  {service.galleryDescription}
                </p>
              )}
            </div>

            {service.galleryImages && service.galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.galleryImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={imageUrl}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-gray-600 text-lg">
                  No gallery images available
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "bloopers" && service.bloopersVideo && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {service.bloopersTitle || "Behind the Scenes"}
            </h2>
            {service.bloopersDescription && (
              <p className="text-gray-600 text-lg mb-8">
                {service.bloopersDescription}
              </p>
            )}
            <div className="max-w-4xl mx-auto">
              <video className="w-full rounded-2xl shadow-xl" controls autoPlay>
                <source src={service.bloopersVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceViewing;
