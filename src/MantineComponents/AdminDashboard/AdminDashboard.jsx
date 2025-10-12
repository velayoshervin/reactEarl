/* eslint-disable no-unused-vars */
import {
  AppShell,
  Burger,
  Tooltip,
  useMantineTheme,
  Button,
  Avatar,
  Indicator,
  Modal,
  Group,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import "./AdminDashboard.css";
import DashboardPage from "./DashboardPage";
import BookingsAdmin from "./BookingsAdmin";
import Messages from "./Messages";
import PaymentTransactions from "./PaymentTransactions";
import ReportsPage from "./ReportsPage";
import PackagesAndServices from "./PackagesAndServices";
import CalendarAvailability from "./CalendarAvailability";
import CalendarTUI from "../../pages/CalendarTUI";
import React, { useEffect } from "react";
import { IconLogout } from "@tabler/icons-react";
import { logout } from "../../ItemsAxios";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import GeneralSetting from "../../pages/GeneralSetting";
import UserRoleManager from "../../pages/UserRoleManager";
import { fetchUserContacts } from "../../AxiosTanstack";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { modals } from "@mantine/modals";
import { uploadAvatar, fetchCurrentUser } from "../../AxiosTanstack";
import Analytics from "../../pages/Analytics/Analytics";
import ImageAndContact from "../../components/ImageAndContact";
import ConsultationTable from "../../components/ConsultationTable";
import PaymentsAdmin from "./PaymentsAdmin";
import Messaging from "../../pages/Messaging/Messaging";
import AdminQuotationsView from "./AdminQuotationsView";
import AdminBooking from "./AdminBooking";
import PackageBundle from "../../components/ProductComponents/PackageBundle";
import PackageForm from "../../components/ProductComponents/PackageForm";
import TaskAssignment from "./TaskAssignment";

export default function AdminDashboard() {
  const [opened, { toggle }] = useDisclosure();
  const [activeNavlink, setActiveNavLink] = useState("dashboard");
  const navigate = useNavigate();
  const [isOpen, { open, close }] = useDisclosure(false);
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState();
  const queryClient = useQueryClient();

  const handleDrop = (files) => {
    if (files.length > 0) {
      setPhoto(URL.createObjectURL(files[0]));
      setFile(files[0]);
    }
    console.log(files[0]);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      console.log(file + "file send in <mutation></mutation>");
      if (!userData || !userData.userId) {
        notifications.show({
          title: "Error",
          message: "User data not loaded yet. Try again shortly.",
          color: "red",
        });
        return;
      }
      const userId = userData.userId;
      return uploadAvatar(file, userId);
    },
    onSuccess: (updatedUser) => {
      // ✅ directly set the new user in cache
      queryClient.setQueryData(["currentUser"], updatedUser);

      notifications.show({
        title: "Success",
        message: "Avatar updated",
        color: "green",
      });

      setPhoto(null);
      setFile(null);
      close();
    },
    onError: (error) => {
      const message = error.response?.data || "Unknown error";
      console.error("Avatar upload failed:", error);
      notifications.show({
        title: "Error",
        message: "Avatar update failed",
        color: "red",
      });
    },
  });

  const handlePhotoSubmit = (e) => {
    e.preventDefault();

    if (!userData || !userData.userId) {
      notifications.show({
        title: "Error",
        message: "User data not loaded yet. Please wait a moment.",
        color: "red",
      });
      return;
    }

    const showConfirmModal = () => {
      modals.openConfirmModal({
        title: "Warning",
        centered: true,
        children: <p>Your current profile will be deleted. Proceed?</p>,
        labels: { confirm: "Upload new avatar", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onConfirm: () => {
          mutation.mutate();
        },
      });
    };

    if (!file) {
      if (userData.avatarUrl) {
        // User has an existing avatar but didn't select a file
        showConfirmModal();
      } else {
        notifications.show({
          title: "No file selected",
          message: "Please select an image before uploading.",
          color: "yellow",
        });
      }
      return;
    }

    if (userData.avatarUrl) {
      // User has an avatar and selected a file
      showConfirmModal();
      return;
    }
    // User has no avatar and selected a file
    mutation.mutate();
  };
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["contacts"],
      queryFn: fetchUserContacts,
    });
  }, [queryClient]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetchCurrentUser(),
    retry: false,
    onSuccess: (data) => {
      if (data.role !== "ADMIN") {
        navigate("/login");
      }
    },
    onError: () => {
      navigate("/login");
    },
  });

  useEffect(() => {
    if (userData && userData.role !== "ADMIN") {
      navigate("/login");
    }
    if (!isLoading && !userData) {
      navigate("/login"); // In case userData is still undefined or null
    }
  }, [userData, navigate, isLoading]);

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
        message: "Log out failed",
        color: "red",
      });
    }
  };

  if (isLoading) {
    // Show loader while still loading
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 180,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      styles={{
        root: {
          minHeight: "100vh",
        },
        main: {
          border: "none",
        },
      }}
    >
      <AppShell.Header className="">
        <div className="h-full flex items-center justify-around px-10">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div
            style={{ flex: 1, textAlign: "center" }}
            className="font-semibold"
          >
            Silvestre
          </div>
          <div className=" flex justify-end gap-2">
            <p>Welcome back, {userData?.firstname}</p>
            <Tooltip label="logout">
              <Button
                unstyled
                leftSection={<IconLogout size={18}>logout</IconLogout>}
                onClick={handleLogout}
              ></Button>
            </Tooltip>
          </div>
        </div>
      </AppShell.Header>

      <AppShell.Navbar
        className={`text-start pl-6 pr-6 py-12 border-none  flex flex-col justify-between bg-white`}
      >
        <div className="flex flex-col">
          <NavLink
            className={`admin-btn ${
              activeNavlink === "dashboard" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/dashboard"
            onClick={() => setActiveNavLink("dashboard")}
          >
            Home
          </NavLink>

          <NavLink
            className={`admin-btn ${
              activeNavlink === "bookings" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/Bookings"
            onClick={() => setActiveNavLink("bookings")}
          >
            Bookings
          </NavLink>
          {/* <NavLink
            className={`admin-btn ${
              activeNavlink === "consultations" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/consultations"
            onClick={() => setActiveNavLink("consultations")}
          >
            Consultations
          </NavLink> */}

          <NavLink
            className={`admin-btn ${
              activeNavlink === "quotations" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/quotations"
            onClick={() => setActiveNavLink("quotations")}
          >
            Quotations
          </NavLink>

          {/* <NavLink
            className={`admin-btn ${
              activeNavlink === "real-booking" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/Bookings"
            onClick={() => setActiveNavLink("real-booking")}
          >
            Bookings
          </NavLink> */}
          <NavLink
            className={`admin-btn ${
              activeNavlink === "Payments" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/payments"
            onClick={() => setActiveNavLink("Payments")}
          >
            Payment Transactions
          </NavLink>
          <NavLink
            className={`admin-btn ${
              activeNavlink === "calendar" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/manage-calendar"
            onClick={() => setActiveNavLink("calendar")}
          >
            Manage Calendar
          </NavLink>
          <NavLink
            className={`admin-btn ${
              activeNavlink === "events" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/events"
            onClick={() => setActiveNavLink("events")}
          >
            Events
          </NavLink>
          <NavLink
            className={`admin-btn ${
              activeNavlink === "messages" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/messages"
            onClick={() => setActiveNavLink("messages")}
          >
            Messages
          </NavLink>
          <NavLink
            className={`admin-btn ${
              activeNavlink === "tasks-assignment" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/tasks-assignment"
            onClick={() => setActiveNavLink("task-assignment")}
          >
            Tasks Assignment
          </NavLink>
          <NavLink
            className={`admin-btn ${
              activeNavlink === "reports" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/reports"
            onClick={() => setActiveNavLink("reports")}
          >
            Reports
          </NavLink>
          <NavLink
            className={`admin-btn ${
              activeNavlink === "user-role-setting" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/user-role-setting"
            onClick={() => setActiveNavLink("user-role-setting")}
          >
            Role Management
          </NavLink>
          <NavLink
            className={`admin-btn ${
              activeNavlink === "general-setting" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/general-setting"
            onClick={() => setActiveNavLink("general-setting")}
          >
            Account Settings
          </NavLink>
          <NavLink
            className={`admin-btn ${
              activeNavlink === "packages" ? "admin-active-btn" : ""
            }`}
            to="/admin-dashboard/packagesAndServices"
            onClick={() => setActiveNavLink("packages")}
          >
            Packages and Services
          </NavLink>
        </div>
        <div className="flex items-center gap-2 justify-around">
          <Indicator
            inline
            size={24} // bigger so JSX fits
            offset={7}
            position="bottom-end"
            color="blue"
            withBorder
            label={
              <Tooltip label="update avatar" withArrow color="blue">
                <div>
                  <IconUpload size={12} />
                </div>
              </Tooltip>
            }
            onClick={open}
            className="hover:opacity-80 transition-opacity"
          >
            <Avatar src={userData?.avatarUrl} radius="xl" size="lg" />
          </Indicator>
          {/* {user.firstname} {user.lastname} */}
        </div>
      </AppShell.Navbar>

      <AppShell.Main className="!border-t-2 !border-gray-300 !bg-[#EFF6FF] !rounded-xl ">
        <Routes>
          <Route path="dashboard" element={<Analytics />} />
          <Route path="consultations" element={<ConsultationTable />} />
          <Route path="Bookings" element={<AdminBooking></AdminBooking>} />
          <Route path="manage-calendar" element={<CalendarAvailability />} />
          <Route
            path="events"
            element={<CalendarTUI userId={userData?.userId} />}
          />
          <Route path="quotations" element={<AdminQuotationsView />} />
          <Route path="messages" element={<Messaging />} />
          {/* <Route path="tasks-assignment" element={<TaskAssignment />} /> */}
          <Route path="payments" element={<PaymentsAdmin />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="packagesAndServices" element={<PackagesAndServices />} />
          <Route path="/general-setting" element={<GeneralSetting />} />
          <Route path="/user-role-setting" element={<UserRoleManager />} />
          <Route path="package-bundle" element={<PackageBundle />} />
          <Route path="package-update" element={<PackageForm />} />
          <Route index element={<DashboardPage />} />
        </Routes>
      </AppShell.Main>
      <>
        <Modal opened={isOpen} onClose={close} title="Update Profile">
          <div className={`${photo ? "block" : "hidden"} py-4 px-4`}>
            <div className="flex items-end gap-1">
              <div className="inline-block rounded-full ring-4 ring-indigo-300 p-1">
                <Avatar
                  src={photo}
                  size={32}
                  className="rounded-full ring-4 ring-white"
                />
              </div>
              <span>32px</span>
              <div className="inline-block rounded-full ring-4 ring-indigo-300 p-1">
                <Avatar
                  src={photo}
                  size={64}
                  className="rounded-full ring-4 ring-white"
                />
              </div>
              <span>64px</span>
              <div className="inline-block rounded-full ring-4 ring-indigo-300 p-1">
                <Avatar
                  src={photo}
                  size={128}
                  className="rounded-full ring-4 ring-white"
                />
              </div>
              <span>128px</span>
            </div>
          </div>
          <form className="flex flex-col gap-2" onSubmit={handlePhotoSubmit}>
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              onDrop={handleDrop}
              maxFiles={1}
              loading={mutation.isPending}
              onDropRejected={(files) => {
                setFile(null);
                notifications.show({
                  title: "Invalid file type",
                  message: "Only image files are accepted",
                  color: "red",
                });
              }}
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: "none" }}
              >
                {mutation.isPending ? (
                  <Text size="md">Uploading...</Text>
                ) : (
                  <>
                    <Dropzone.Accept>
                      <IconUpload
                        size={52}
                        color="var(--mantine-color-blue-6)"
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        size={52}
                        color="var(--mantine-color-red-6)"
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        size={52}
                        color="var(--mantine-color-dimmed)"
                        stroke={1.5}
                      />
                    </Dropzone.Idle>
                    <div>
                      <Text size="xl" inline>
                        Drag image here or click to select files
                      </Text>
                    </div>
                  </>
                )}
              </Group>
            </Dropzone>
            <button
              className="border border-gray-300 rounded-xl px-4 py-1 w-full"
              type="submit"
            >
              upload
            </button>
          </form>
          <button
            className="border border-gray-300 rounded-xl px-4 py-1 w-full mt-2"
            type="buttton"
            onClick={() => {
              setPhoto(null);
            }}
          >
            remove
          </button>
        </Modal>
      </>
    </AppShell>
  );
}
