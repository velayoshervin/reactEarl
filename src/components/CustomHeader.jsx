import React from "react";
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
import { Link, NavLink } from "react-router-dom";
import { queryClient } from "../AxiosTanstack";

const CustomHeader = () => {
  const user = queryClient.getQueryData(["currentUser"]);

  const LoggedIn = () => (
    <Group>
      <Avatar />
      <Text>
        {user?.firstname || ""} {user?.lastname || ""}
      </Text>
      {/* <Stack>
        <NavLink to="/logout">Logout</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </Stack> */}
    </Group>
  );

  return (
    <div className="bg-white">
      <header className="flex justify-around items-center py-4 bg-white">
        <div>logo</div>

        {user?.userId ? (
          <LoggedIn />
        ) : (
          <Group>
            <Button type="button" variant="default">
              Login
            </Button>
            <Button type="button">Sign Up</Button>
          </Group>
        )}
      </header>
      <Divider className="mb-4" />
    </div>
  );
};

export default CustomHeader;
