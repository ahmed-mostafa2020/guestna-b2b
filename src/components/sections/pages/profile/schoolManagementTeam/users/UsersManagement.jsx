import { memo } from "react";
import { Container, Paper } from "@mui/material";
import UsersHeader from "./UsersHeader";
import UsersInfo from "./UsersInfo";

const UsersManagement = ({ data, setCearchTerm, searchTerm }) => {
  const users = data?.users || [];

  return (
    <Container maxWidth="xl" className="py-6">
      <Paper className="p-6 shadow-sm">
        <UsersHeader setCearchTerm={setCearchTerm} searchTerm={searchTerm} />

        {/* <UsersStats users={users} /> */}

        <UsersInfo users={users} />
      </Paper>
    </Container>
  );
};

export default memo(UsersManagement);
