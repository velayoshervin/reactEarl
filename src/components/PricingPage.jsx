import React from "react";
import "./pricing.css";
import { Button } from "@mantine/core";

const PricingPage = () => {
  return (
    <section class="pricing-header">
      <h1>Our Packages</h1>
      <p>
        Choose the perfect package that fits your style, budget, and event
        needs.
      </p>

      <div class="custom-grid">
        <div class="card">
          <img src="basic-package.jpg" alt="Basic Package" />
          <h2>Basic Styling Package</h2>
          <p class="price">₱15,000</p>
          <ul>
            <li>Venue styling & setup</li>
            <li>Basic floral arrangements</li>
            <li>Backdrop & table décor</li>
            <li>Day-of coordination</li>
          </ul>
          <Button color="#8c8c8c" size="lg" radius={"md"}>
            Inquire now
          </Button>
        </div>

        <div class="card">
          <img src="premium-package.jpg" alt="Premium Package" />
          <h2>Premium Package</h2>
          <p class="price">₱35,000</p>
          <ul>
            <li>All Basic inclusions</li>
            <li>Customized floral & table styling</li>
            <li>Themed backdrop & props</li>
            <li>Program assistance</li>
          </ul>

          <Button color="#8c8c8c" size="lg" radius={"md"}>
            Inquire now
          </Button>
        </div>

        <div class="card">
          <img src="luxury-package.jpg" alt="Luxury Package" />
          <h2>Luxury Package</h2>
          <p class="price">₱60,000</p>
          <ul>
            <li>All Premium inclusions</li>
            <li>Full concept styling & planning</li>
            <li>Premium décor elements</li>
            <li>On-site stylist & coordination team</li>
          </ul>

          <Button color="#8c8c8c" size="lg" radius={"md"}>
            Inquire now
          </Button>
        </div>

        <div class="card">
          <img src="custom-package.jpg" alt="Custom Events" />
          <h2>Custom Events</h2>
          <p class="price">Contact for Quote</p>
          <ul>
            <li>Weddings</li>
            <li>Corporate Events</li>
            <li>Large-Scale Productions</li>
            <li>Special Requests</li>
          </ul>

          <Button color="#8c8c8c" size="lg" radius={"md"}>
            Inquire now
          </Button>
        </div>
        <div class="card">
          <img src="custom-package.jpg" alt="Custom Events" />
          <h2>Custom Events</h2>
          <p class="price">Contact for Quote</p>
          <ul>
            <li>Weddings</li>
            <li>Corporate Events</li>
            <li>Large-Scale Productions</li>
            <li>Special Requests</li>
          </ul>

          <Button color="#8c8c8c" size="lg" radius={"md"}>
            Inquire now
          </Button>
        </div>
        <div class="card">
          <img src="custom-package.jpg" alt="Custom Events" />
          <h2>Custom Events</h2>
          <p class="price">Contact for Quote</p>
          <ul>
            <li>Weddings</li>
            <li>Corporate Events</li>
            <li>Large-Scale Productions</li>
            <li>Special Requests</li>
          </ul>

          <Button color="#8c8c8c" size="lg" radius={"md"}>
            Inquire now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPage;
