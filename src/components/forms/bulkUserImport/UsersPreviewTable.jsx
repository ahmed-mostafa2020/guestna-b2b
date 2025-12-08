import { Close, Delete, Edit, Save } from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

const UsersPreviewTable = ({
  uploadedUsers,
  validationErrors,
  duplicateUsers,
  roleOptions,
  t,
  onRemove,
  onEdit,
}) => {
  return (
    <Box className="px-8 py-6 overflow-auto">
      <Typography variant="h6" className="!font-somar mb-3">
        Preview ({uploadedUsers.length} users)
      </Typography>

      <TableContainer
        component={Paper}
        className="max-h-96 border rounded-md shadow-sm"
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width="18%">Name</TableCell>
              <TableCell width="20%">Email</TableCell>
              <TableCell width="14%">Phone</TableCell>
              <TableCell width="14%">Role</TableCell>
              <TableCell width="12%">Status</TableCell>
              <TableCell width="10%" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {uploadedUsers.map((user, index) => {
              const errors = validationErrors[index];
              const hasError = errors && Object.keys(errors).length > 0;
              const isDuplicate = duplicateUsers.has(index);

              const isEditing = user.isEditing || false;
              const toggleEdit = () => onEdit(index, "isEditing", !isEditing);

              return (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: hasError
                      ? "rgba(239,68,68,0.08)"
                      : isDuplicate
                      ? "rgba(59,130,246,0.08)"
                      : "transparent",
                  }}
                >
                  {/* NAME */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        value={user.name}
                        onChange={(e) => onEdit(index, "name", e.target.value)}
                      />
                    ) : (
                      <Typography
                        noWrap
                        sx={{
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.name}
                      </Typography>
                    )}
                  </TableCell>

                  {/* EMAIL */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        value={user.email}
                        onChange={(e) =>
                          onEdit(index, "email", e.target.value.toLowerCase())
                        }
                        error={Boolean(errors?.email)}
                        helperText={errors?.email}
                      />
                    ) : (
                      <Typography
                        noWrap
                        sx={{
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.email}
                      </Typography>
                    )}
                  </TableCell>

                  {/* PHONE */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        value={user.phone}
                        onChange={(e) => onEdit(index, "phone", e.target.value)}
                        error={Boolean(errors?.phone)}
                        helperText={errors?.phone}
                      />
                    ) : (
                      <Typography
                        noWrap
                        sx={{
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.phone}
                      </Typography>
                    )}
                  </TableCell>

                  {/* ROLE */}
                  <TableCell>
                    {isEditing ? (
                      <FormControl fullWidth size="small">
                        <Select
                          size="small"
                          value={user.role}
                          onChange={(e) =>
                            onEdit(index, "role", e.target.value)
                          }
                        >
                          {roleOptions.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography>{user.role}</Typography>
                    )}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    {hasError ? (
                      <Chip label="Errors" size="small" color="error" />
                    ) : isDuplicate ? (
                      <Chip label="Will Overwrite" size="small" color="info" />
                    ) : (
                      <Chip label="Valid" size="small" color="success" />
                    )}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="center">
                    {isEditing ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton
                            color="success"
                            onClick={toggleEdit}
                            size="small"
                          >
                            <Save fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Cancel">
                          <IconButton
                            color="inherit"
                            onClick={toggleEdit}
                            size="small"
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={toggleEdit}
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => onRemove(index)}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
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
