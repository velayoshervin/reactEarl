import React from "react";
import logo from "../assets/Slogo.png";
import { Image, Modal } from "@mantine/core";
import "./MyLandingPage.css";
import footerImage from "../assets/footer.jpg";
import Slogo from "../assets/SLogo.png";
import { logout } from "../ItemsAxios";
import {
  Group,
  Anchor,
  Menu,
  Button,
  Avatar,
  Stack,
  Divider,
  Text,
} from "@mantine/core";
import { Link, NavLink, Outlet } from "react-router-dom";
import { queryClient } from "../AxiosTanstack";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const MyLandingPage = () => {
  const user = queryClient.getQueryData(["currentUser"]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.setQueryData(["currentUser"], null);

      notifications.show({
        title: "Success",
        message: "Logged out",
        color: "green",
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  const goToDashboard = () => {
    const role = user.role;
    if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else if (role === "CUSTOMER") {
      navigate("/user-dashboard");
    }
  };

  const LoggedIn = () => (
    <Group>
      {/* <NavLink to="/logout">Logout</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink> */}
      <Menu trigger="click-hover" openDelay={100} closeDelay={400} shadow="sm">
        <Menu.Target>
          <Group>
            <Avatar src={user.avatarUrl} />
            <Text>
              {user?.firstname || ""} {user?.lastname || ""}
            </Text>
          </Group>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item value="help" onClick={goToDashboard}>
            dashboard
          </Menu.Item>
          <Menu.Item value="logout" onClick={handleLogout}>
            logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );

  return (
    <div className="bg-white p-0 m-0 relative">
      {/* Watermark */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          backgroundImage: `url(${Slogo})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <nav className="flex py-[15px] px-[30px] justify-between sticky top-0 bg-white shadow z-50">
        <img src={logo} className="h-[50px] w-[50px]"></img>

        <div className="flex border-box items-center gap-[15px]">
          <NavLink
            to="/"
            className="landing-page-navlink"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#f2f2f2" : "",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Home
          </NavLink>
          <NavLink to="services" className="landing-page-navlink">
            Services
          </NavLink>
          <NavLink to="#" className="landing-page-navlink">
            Community
          </NavLink>
          <NavLink to="resources" className="landing-page-navlink">
            Resources
          </NavLink>
          <NavLink to="pricing" className="landing-page-navlink">
            Pricing
          </NavLink>
          <NavLink to="#" className="landing-page-navlink ">
            Contacts
          </NavLink>
          <div className="flex gap-2">
            {user?.userId ? (
              <LoggedIn />
            ) : (
              <Group>
                <NavLink
                  to="/login"
                  className="landing-page-navlink bg-[#f2f2f2] rounded"
                >
                  Sign In
                </NavLink>

                <NavLink
                  to="sign-up"
                  className="landing-page-navlink bg-[#b97a57] rounded !text-white hover:!text-black"
                >
                  Register
                </NavLink>
              </Group>
            )}
          </div>
          <div className="hamburger">☰</div>
        </div>
      </nav>

      <Outlet className="bg-transparent" />

      <footer
        style={{
          background: `url(${footerImage}) no-repeat center center/cover`,
        }}
      >
        <div className="footer-content">
          <div className="socials">
            <a href="#">Instagram: @silvestre's_events</a>|{" "}
            <a href="#">Facebook: Silvestre's Events and Exquisite Styles</a>
          </div>
          <p>2019 Silvestre's Events and Exquisite Styles.</p>
          <p>All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MyLandingPage;
