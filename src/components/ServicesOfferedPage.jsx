import React from "react";
import "./ProductsOffered.css";
import venue from "../assets/venue.jpg";
import catering from "../assets/catering.jpg";
import pv from "../assets/pv.jpg";
import ls from "../assets/ls.jpg";
import hm from "../assets/hm.jpg";
import others from "../assets/others.jpg";
import { Button } from "@mantine/core";

const ServicesOfferedPage = () => {
  return (
    <div>
      <section className="services-header">
        <h1>Services Offered</h1>
        <p>
          We provide professional event styling, planning, and venue
          arrangements tailored to your special occasions.
        </p>

        <div className="custom-grid">
          <div className="card">
            <img src={catering} alt="Catering" />
            <h2>Catering</h2>
            <p>Delicious menus crafted for your occasion.</p>
            <Button>See more</Button>
          </div>

          <div className="card">
            <img src={venue} alt="Weddings" />
            <h2>Venue Set-Up</h2>
            <p>Elegant arrangements to match your theme.</p>
            <Button>See more</Button>
          </div>

          <div className="card">
            <img src={pv} alt="Birthdays" />
            <h2>Photo and Video Coverage</h2>
            <p>Capturing your best memories beautifully.</p>
            <Button>See more</Button>
          </div>
        </div>
        <div className="custom-grid">
          <div className="card">
            <img src={ls} alt="Baptismal" />
            <h2>Lights and Sounds</h2>
            <p>Perfect ambiance with professional setup.</p>
            <Button>See more</Button>
          </div>

          <div className="card">
            <img src={hm} alt="Baptismal" />
            <h2>Hair and Make-Up</h2>
            <p>Stylish hair and make-up just for you.</p>
            <Button>See more</Button>
          </div>

          <div className="card">
            <img src={others} alt="Baptismal" />
            <h2>Other Services</h2>
            <p>Extra touches to make your event perfect.</p>
            <Button>See more</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesOfferedPage;
