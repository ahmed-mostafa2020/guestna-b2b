import { memo } from "react";

import UsersHeader from "./UsersHeader";
import UsersInfo from "./UsersInfo";

import { Paper } from "@mui/material";

const UsersManagement = ({ data, setSearchTerm, searchTerm }) => {
  const users = data?.users || [];

  return (
    <dev>
      <Paper className="p-6 shadow-sm rounded-lg">
        <UsersHeader setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

        <UsersInfo users={users} organization={data._id} />
      </Paper>
    </dev>
  );
};

export default memo(UsersManagement);
