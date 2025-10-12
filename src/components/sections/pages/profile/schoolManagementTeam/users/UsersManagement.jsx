import { memo } from "react";

import UsersHeader from "./UsersHeader";
import UsersInfo from "./UsersInfo";

import { Paper } from "@mui/material";

const UsersManagement = ({ data, setSearchTerm, searchTerm }) => {
  const users = data?.users || [];

  return (
    <div>
      <Paper className="p-6 shadow-sm !rounded-2xl">
        <UsersHeader setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

        <UsersInfo users={users} organization={data._id} />
      </Paper>
    </div>
  );
};

export default memo(UsersManagement);
