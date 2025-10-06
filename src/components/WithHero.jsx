import React, { useEffect, useState } from "react";
import "./WithHero.css";
import "../stylee.css";
import heroImage from "../assets/img.jpg"; // Import the background image
import w1 from "../assets/w1.jpg"; // Import wedding images
import wedd from "../assets/wedd.jpg";
import w3 from "../assets/w3.jpg";
import w4 from "../assets/w4.jpg";
import w5 from "../assets/w5.jpg";
import y1 from "../assets/y1.jpg"; // Import birthday images
import y2 from "../assets/y2.jpg";
import y3 from "../assets/y3.jpg";
import y4 from "../assets/y4.jpg";
import y5 from "../assets/y5.jpg";
import b1 from "../assets/b1.jpg"; // Import baptismal images
import b2 from "../assets/b2.jpg";
import b3 from "../assets/b3.jpg";
import b4 from "../assets/b4.jpg";
import b5 from "../assets/b5.jpg";
import vid from "../assets/vid.mp4";
import pk1 from "../assets/pk1.jpg";
import diamond from "../assets/Diamond.jpg";
import { Button } from "@mantine/core";
import { Modal } from "@mantine/core";
import { queryClient } from "../AxiosTanstack";
import { Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import BookConsultation from "./BookConsultation";
import AvailableCalendar from "./AvailableCalendar";
import { HoverCard, Group } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { Select, Avatar } from "@mantine/core";
import dayjs from "dayjs";
import { NumberInput } from "@mantine/core";
import axios from "axios";

const user = queryClient.getQueryData(["currentUser"]);

const leticiaPhoto =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvdeMROvFKyH_vyybSf6Bk3KBS0OyTKTE2IdjCCNOsQTbJ6RhQ1UgoxlEOmX6uBlvCECGhyuvSJR1rsB5fcUh34Ab2Ohseg6LuMHRr5V1nKrJ9q-oEkaIUMf2LB78W72IqRqXzzoM3JhhK/s1600/IMG_7882.JPG";

const BookingInitialForm = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [eventType, setEventType] = useState();
  const [pax, setPax] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [venues, setVenues] = useState();
  const [selectedVenue, setSelectedVenue] = useState();
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (!selectedDate || !eventType || !pax) {
      notifications.show({
        title: "Missing inputs",
        message: "Please complete those required fields!",
        color: "red", // optional
        icon: <IconX size={20}> </IconX>, // can use icons or JSX
        autoClose: 3000, // closes in 3s
      });

      return;

      // stop if ANY of them is missing
    }
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0]; // "YYYY-MM-DD"

    const params = new URLSearchParams({
      date: formattedDate,
      eventType,
      pax: pax.toString(),
      venue: selectedVenue || "",
    });

    alert(params.toString());
    // navigate(`/getquoute?date=${formattedDate}`);

    navigate(`/getquote?${params.toString()}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/venue", {
          withCredentials: true,
        });
        if (res && res.data) {
          // Map your venue data to match Select format
          const fromVenue = res.data.map((venue) => ({
            value: venue.venueId.toString(), // or venue.name if you prefer
            label: venue.name,
            image: venue.imageUrl, // optional if you want to show an image
            address: venue.address,
          }));

          setVenues(fromVenue);
        }

        setIsLoading(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <div className=" bg-white rounded-xl  absolute top-[70vh] left-[20vw] border border-gray-300">
        <div className="flex flex-col items-center ">
          <div className="flex pt-4 py-2 bg-white px-6 rounded gap-1">
            <div className="flex flex-col">
              <label htmlFor="dateP">Event Date</label>
              <HoverCard shadow="md" id="dateP">
                <HoverCard.Target>
                  <Button variant="default" leftSection={<IconCalendarEvent />}>
                    <Text fw={100} c="gray" size="xs">
                      {" "}
                      {!selectedDate && <p>Pick Event date</p>}
                      {selectedDate &&
                        dayjs(selectedDate).format("ddd,MMMM D, YYYY")}
                    </Text>
                  </Button>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <AvailableCalendar
                    onDateSelect={setSelectedDate}
                  ></AvailableCalendar>
                </HoverCard.Dropdown>
              </HoverCard>
            </div>

            <Select
              label="Event"
              withAsterisk
              data={[
                "Wedding",
                "Birthdays",
                "Baptismal",
                "BabyShower",
                "Party",
                "Reunion",
                "Corporate",
              ]}
              placeholder="Select Event Type"
              value={eventType}
              onChange={setEventType}
              clearable
            ></Select>
            <NumberInput
              label="Guest count"
              value={pax}
              onChange={setPax}
              min={100}
              placeholder="expected guests"
              withAsterisk
            />
            <Select
              label="Venue"
              style={{ width: 300 }}
              value={selectedVenue}
              onChange={setSelectedVenue}
              placeholder="(Optional) Select venue"
              data={!isLoading ? venues : null}
              clearable
              renderOption={({ option }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Avatar
                    src={option?.image || leticiaPhoto}
                    size={80}
                    style={{
                      border: "2px solid white", // white border ring
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", // subtle shadow
                    }}
                  />
                  <div className="flex flex-col">
                    <span>{option?.label}</span>
                    <Text size="xs" c="dimmed">
                      {option?.address}
                    </Text>
                  </div>
                </div>
              )}
            ></Select>
          </div>
          <div className="pb-2 flex gap-2">
            <button
              onClick={handleBookNow}
              className="border border-gray-300 rounded-3xl py-2 px-4 bg-red-600 text-white !font-bold !text-[18px] hover:opacity-50"
            >
              Book Now
            </button>
            <button className="border border-red-500 rounded-3xl py-2 px-4 text-red-500 !font-bold !text-[18px] hover:bg-red-600 hover:text-white">
              Canvas/Quote
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Services = () => {
  return (
    <section className="services">
      <h1>Popular Events</h1>
      <div className="service-grid">
        <div className="card">
          <div className="image-container">
            <img src={w1} alt="Wedding" />
            <img src={wedd} alt="Wedding Hover" />
            <img src={w3} alt="Wedding Hover" />
            <img src={w4} alt="Wedding Hover" />
            <img src={w5} alt="Wedding Hover" />
          </div>
          <h2>Weddings</h2>
        </div>

        <div className="card">
          <div className="image-container">
            <img src={y1} alt="Bday" />
            <img src={y2} alt="Bday Hover" />
            <img src={y3} alt="Bday Hover" />
            <img src={y4} alt="Bday Hover" />
            <img src={y5} alt="Bday Hover" />
          </div>
          <h2>Birthday Party</h2>
        </div>

        <div className="card">
          <div className="image-container">
            <img src={b1} alt="Baptismal" />
            <img src={b2} alt="Baptismal Hover" />
            <img src={b3} alt="Baptismal Hover" />
            <img src={b4} alt="Baptismal Hover" />
            <img src={b5} alt="Baptismal Hover" />
          </div>
          <h2>Baptismal</h2>
        </div>
      </div>
    </section>
  );
};

const PackagesSection = () => (
  <>
    <section id="packages" className="packages">
      <div class="container">
        <h2 class="section-title">Our Packages</h2>
        <div class="packages-grid">
          <div class="package-card">
            <center>
              <img src={pk1} alt="Platinum Package" class="package-img" />
            </center>
            <h3>Platinum Package</h3>
            <p>
              Perfect for small gatherings and intimate budget-meal
              celebrations.
            </p>
            <a href="#" className="btn">
              Choose Platinum
            </a>
          </div>

          <div class="package-card">
            <center>
              <img src={diamond} alt="Diamond Package" class="package-img" />
            </center>
            <h3>Diamond Package</h3>
            <p>Great for big parties, reunions, and events.</p>
            <a href="#" className="btn">
              Choose Diamond
            </a>
          </div>
        </div>
      </div>
    </section>
  </>
);

const WithHero = () => {
  useEffect(() => {
    // === SCROLL VISIBILITY ===
    const checkScroll = () => {
      const section = document.querySelector(".hero");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.classList.add("visible");
        }
      }
    };

    window.addEventListener("scroll", checkScroll);
    window.addEventListener("load", checkScroll);
    checkScroll(); // run once immediately

    // === IMAGE SLIDESHOW ON HOVER ===
    const containers = document.querySelectorAll(".image-container");
    containers.forEach((container) => {
      const images = container.querySelectorAll("img");
      let index = 0;
      let interval;

      container.addEventListener("mouseenter", () => {
        index = (index + 1) % images.length;
        images.forEach((img, i) => {
          img.style.opacity = i === index ? "1" : "0";
        });

        interval = setInterval(() => {
          index = (index + 1) % images.length;
          images.forEach((img, i) => {
            img.style.opacity = i === index ? "1" : "0";
          });
        }, 2000);
      });

      container.addEventListener("mouseleave", () => {
        clearInterval(interval);
        index = 0;
        images.forEach((img, i) => {
          img.style.opacity = i === 0 ? "1" : "0";
        });
      });
    });

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("load", checkScroll);
    };
  }, []);

  const [openCalModal, setOpenCalModal] = useState(false);
  const [openConsultationModal, setOpenConsultationModal] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const navigate = useNavigate();

  //center center/cover
  return (
    <div className="bg-transparent relative">
      <div
        className="hero"
        style={{
          background: `url(${heroImage}) no-repeat bottom center/cover `,
        }}
      >
        <div className="overlay"></div>
        <div className="hero-text !opacity-100" data-animate>
          <h1>Silvestre's</h1>
          <h2>Events and Exquisite Styles</h2>
          <div className="flex z-999 relative opacity-100 gap-2"></div>
        </div>
      </div>

      {<PackagesSection></PackagesSection>}

      <section className="history" id="history">
        <h1 id="our-story">Our Story</h1>
        <div className="timeline">
          <div className="timeline-item left">
            <div className="content">
              <h3>2019</h3>
              <p>
                Silvestre's started as a small family business with the vision
                of bringing people together during the pandemic.
              </p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="content">
              <h3>2021</h3>
              <p>
                We opened our first official office, hosting weddings,
                birthdays, and community events.
              </p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="content">
              <h3>2023</h3>
              <p>
                Expanded our services to have Photo Connection that captures
                moments immortalized through artful lens..
              </p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="content">
              <h3>2025</h3>
              <p>
                Today, Silvestre's continues to create timeless memories,
                blending tradition with elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Services />

      <section className="venue !opacity-100" data-animate>
        <h1>Our Venue</h1>
        <div className="video-container">
          <video autoPlay muted loop playsInline>
            <source src={vid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <Modal
        opened={openCalModal}
        onClose={() => setOpenCalModal(false)}
        size={"lg"}
      >
        <div className="bg-white dark:bg-gray-800 p-6 mx-auto text-center space-y-4">
          <AvailableCalendar
            onDateSelect={(date) => {
              setEventDate(date);
              const formattedDate = new Date(date).toISOString().split("T")[0]; // "YYYY-MM-DD"
              navigate(`/getquoute?date=${formattedDate}`);
            }}
            user={user}
          ></AvailableCalendar>

          {!user && (
            <>
              <Text size="lg" weight={600} color="blue">
                Login is required
              </Text>
              <Text size="sm" color="gray.7">
                In order to submit a consultation request or create a DIY quote,
                you need to log in.
              </Text>
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  color="teal"
                  size="md"
                  radius="md"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Proceed to Login
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  size="md"
                  radius="md"
                  onClick={() => {
                    setOpenCalModal(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal
        opened={openConsultationModal}
        onClose={() => setOpenConsultationModal(false)}
        size={"xxl"}
      >
        <div className="bg-white dark:bg-gray-800 p-6 mx-auto text-center space-y-4 grid grid-cols-2">
          <AvailableCalendar
            onDateSelect={setEventDate}
            user={user}
          ></AvailableCalendar>
          {!user && (
            <>
              <Text size="lg" weight={600} color="blue">
                Login is required
              </Text>
              <Text size="sm" color="gray.7">
                In order to submit a consultation request or create a DIY quote,
                you need to log in.
              </Text>
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  color="teal"
                  size="md"
                  radius="md"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Proceed to Login
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  size="md"
                  radius="md"
                  onClick={() => {
                    setOpenCalModal(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </>
          )}
          {eventDate && user && (
            <BookConsultation
              userId={user.userId}
              eventDate={eventDate}
              setEventDate={setEventDate}
              closeModal={() => setOpenConsultationModal(false)}
            />
          )}
        </div>
      </Modal>
      {<BookingInitialForm></BookingInitialForm>}
    </div>
  );
};

export default WithHero;
