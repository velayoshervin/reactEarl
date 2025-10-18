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
import { NumberInput } from "@mantine/core";
import Customization from "../MantineComponents/mantine/Customization";
import Customize from "./BookingProcess/Customize";

const user = queryClient.getQueryData(["currentUser"]);

console.log("WihtHero-user", user);

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
      <div className="container">
        <h2 className="section-title">Our Packages</h2>
        <div className="packages-grid">
          <div className="package-card">
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
          <div className="flex gap-2">
            <Button
              onClick={() => {
                navigate("/book-now");
              }}
            >
              Book now
            </Button>
            <Button>Get Quote</Button>
          </div>
        </div>
      </div>

      {/* <Customization user={user} /> */}
      {/* <Customize></Customize> */}

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
    </div>
  );
};

export default WithHero;
