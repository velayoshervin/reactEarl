import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
// import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import axios from "axios";
import {
  Button,
  Group,
  Menu,
  Tabs,
  Anchor,
  Container,
  Title,
  Text,
  Avatar,
  Modal,
  Stack,
  NavLink,
} from "@mantine/core";
import BookConsultation from "../../components/BookConsultation";
import { queryClient } from "../../AxiosTanstack";
import { logout } from "../../ItemsAxios";
import { notifications } from "@mantine/notifications";
//"

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const [quoteloginModalOpened, setQuoteLoginModalOpened] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

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
      notifications.show({
        title: "Error",
        message: "Log out failed" + err?.response,
        color: "red",
      });
    }
  };

  const LoggedIn = () => (
    <Group>
      <Avatar src={user?.avatarUrl} />
      <div className="relative">
        <Text onClick={() => setShowLinks((prev) => !prev)}>
          {user.firstname} {user.lastname}
        </Text>

        {/* Conditional Rendering of NavLinks */}
        {showLinks && (
          <Stack
            spacing={0}
            style={{
              "--group-gap": "0", // Override --group-gap to remove spacing
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              top: "100%",
              left: "0",
              zIndex: 999,
            }}
            className="absolute bg-white border border-gray-300 shadow-lg rounded mt-2"
          >
            <NavLink
              label="Logout"
              sx={{ marginBottom: 0, padding: 0 }}
              onClick={handleLogout}
            />
            <NavLink
              label="Dashboard"
              sx={{ marginBottom: 0, padding: 0 }}
              href="user-dashboard"
            />
          </Stack>
        )}
      </div>
    </Group>
  );

  const handleBookNow = () => {
    if (!user) {
      setLoginModalOpened(true);
      return;
    }
    open();
  };

  const handleGetQuote = () => {
    navigate("/getquoute");
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Make a request to your backend endpoint that validates the JWT in cookie
        const response = await axios.get(
          "http://localhost:8080/protected/api/userData/me",
          {
            withCredentials: true, // important for sending cookies
          }
        );

        console.log(response);
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.log("no user", error.response);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="bg-white mx-auto border border-gray-400 rounded">
      <header className="flex justify-around items-center py-4">
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          logo
        </div>
        <Group className="">
          <Anchor component={Link} to="/" className="!text-black !no-underline">
            Home
          </Anchor>
          <Anchor
            component={Link}
            to="/feature"
            className="!text-black !no-underline"
          >
            Feature
          </Anchor>
          <Anchor
            component={Link}
            to="/about"
            className="!text-black !no-underline"
          >
            About
          </Anchor>
          <Menu
            trigger="click-hover"
            openDelay={100}
            closeDelay={400}
            shadow="sm"
          >
            <Menu.Target>
              <Button variant="subtle" className="!text-black !font-light">
                Support
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item value="settings">FAQs</Menu.Item>
              <Menu.Item value="help">Terms and Policy</Menu.Item>
              <Menu.Item value="logout">Contacts</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {user && !loading ? (
          <LoggedIn></LoggedIn>
        ) : (
          <Group>
            <Button
              type="button"
              variant="default"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              type="button"
              variant=""
              onClick={() => navigate("sign-up")}
            >
              Sign Up
            </Button>
          </Group>
        )}
      </header>
      <Container fluid="hero" className="bg-gray-100 py-20">
        <Title order={1} className="text-4xl font-bold mb-4">
          Silvestre's Events and Exquisite Style
        </Title>
        <Text size="lg" className="text-gray-600 mb-6 max-w-2xl mx-auto">
          An Event Planner,Photo and Video,Catering ,and Styling Company from
          📍Pulilan Bulacan & 📍Apalit Pampanga
        </Text>

        <Group justify="left" p={20}>
          <Button size="lg" radius="md" onClick={handleBookNow}>
            Book now
          </Button>
          <Button
            size="lg"
            variant="outline"
            radius="md"
            onClick={handleGetQuote}
          >
            Get a Quote
          </Button>
        </Group>
      </Container>
      <Modal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
        title="Login Required"
        centered
      >
        <Text mb="md">You must be logged in to book a consultation.</Text>
        <Button fullWidth onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Modal>

      <Modal
        opened={quoteloginModalOpened}
        onClose={() => setQuoteLoginModalOpened(false)}
        title="Login Required"
        centered
      >
        <Text mb="md">You must be logged submit or saved this quotation.</Text>
        <Button fullWidth onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Modal>

      <Modal
        size={"lg"}
        opened={opened}
        onClose={close}
        title="Book Consultation"
        centered
      >
        <BookConsultation userId={user?.userId} close={close} />
      </Modal>
    </div>
  );
};

export default LandingPage;
