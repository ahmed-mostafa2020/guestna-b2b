import { Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const UsersPreviewTable = ({
  uploadedUsers,
  validationErrors,
  duplicateUsers,
  roleOptions,
  t,
  onRemove,
}) => {
  return (
    <Box className="px-8 py-6">
      <Typography variant="h6" className="!font-somar mb-3">
        Preview ({uploadedUsers.length} users)
      </Typography>

      <TableContainer component={Paper} className="max-h-96 border">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {uploadedUsers.map((user, index) => {
              const errors = validationErrors[index];
              const hasError = errors && Object.keys(errors).length > 0;
              const isDuplicate = duplicateUsers.has(index);

              return (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: hasError
                      ? "rgba(239,68,68,.1)"
                      : isDuplicate
                      ? "rgba(59,130,246,.1)"
                      : "transparent",
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>

                  <TableCell>
                    {roleOptions.includes(user.role) ? (
                      <Chip label={user.role} size="small" />
                    ) : (
                      <span className="text-error">Invalid Role</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {hasError ? (
                      <Chip label="Errors" size="small" color="error" />
                    ) : isDuplicate ? (
                      <Chip label="Will Overwrite" size="small" color="info" />
                    ) : (
                      <Chip label="Valid" size="small" color="success" />
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton onClick={() => onRemove(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {Object.keys(validationErrors).length > 0 && (
        <Alert severity="error" className="mt-3">
          <strong>Validation Errors:</strong>
          <ul className="list-disc ml-5 text-sm">
            {Object.entries(validationErrors).map(([i, err]) => (
              <li key={i}>
                Row {+i + 1}: {Object.values(err).join(", ")}
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </Box>
  );
};

export default UsersPreviewTable;
