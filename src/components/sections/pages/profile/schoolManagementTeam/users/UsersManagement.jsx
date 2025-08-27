import { memo } from "react";
import { Container, Paper } from "@mui/material";
import UsersHeader from "./UsersHeader";
import UsersInfo from "./UsersInfo";

const UsersManagement = ({ data, setCearchTerm, searchTerm }) => {
  const users = data?.users || [];

  return (
    <dev>
      <Paper className="p-6 shadow-sm rounded-lg">
        <UsersHeader setCearchTerm={setCearchTerm} searchTerm={searchTerm} />

        <UsersInfo users={users} organization={data._id} />
      </Paper>
    </dev>
  );
};

export default memo(UsersManagement);
