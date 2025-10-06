// UserDashboard.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { queryClient } from "../../AxiosTanstack";
import { Group, Avatar, Text } from "@mantine/core";

const user = queryClient.getQueryData(["currentUser"]);

const UserDashboard = () => {
  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-100 p-4">
          <div className="flex flex-col items-center">
            {user?.avatarUrl ? (
              <Avatar
                url={user?.avatarUrl}
                style={{
                  boxShadow: "inset 0 0 0 4px white", // inset white ring
                }}
              ></Avatar>
            ) : (
              <Avatar
                style={{
                  boxShadow: "inset 0 0 0 4px white", // inset white ring
                }}
              >
                {user?.firstname[0]}
                {user?.lastname[0]}
              </Avatar>
            )}
            <Text>Welcome back!</Text>
            <Text size={"sm"} c="dimmed">
              {user?.firstname}
              <span> </span>
              {user?.lastname}
            </Text>
          </div>
          <NavLink
            to="quotations"
            className={({ isActive }) =>
              isActive ? "block p-2 bg-blue-500 text-white" : "block p-2"
            }
          >
            Booking
          </NavLink>
          <NavLink
            to="payments"
            className={({ isActive }) =>
              isActive ? "block p-2 bg-blue-500 text-white" : "block p-2"
            }
          >
            Payments
          </NavLink>
          <NavLink
            to="messages"
            className={({ isActive }) =>
              isActive ? "block p-2 bg-blue-500 text-white" : "block p-2"
            }
          >
            Messaging
          </NavLink>

          <NavLink
            to="calendar"
            className={({ isActive }) =>
              isActive ? "block p-2 bg-blue-500 text-white" : "block p-2"
            }
          >
            Calendar
          </NavLink>

          <NavLink
            to="settings"
            className={({ isActive }) =>
              isActive ? "block p-2 bg-blue-500 text-white" : "block p-2"
            }
          >
            Settings
          </NavLink>
        </nav>

        {/* Main content */}
        <div className="flex-1 p-4 bg-white w-full">
          <Outlet className="w-full" />
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
