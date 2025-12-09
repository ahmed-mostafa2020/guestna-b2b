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
import { useTranslations } from "next-intl";

const UsersPreviewTable = ({
  uploadedUsers,
  validationErrors,
  duplicateUsers,
  roleOptions,

  onRemove,
  onEdit,
}) => {
  const t = useTranslations();
  return (
    <Box className="px-8 py-6 overflow-auto">
      <Typography variant="h6" className="!font-somar mb-3">
        {t("profile.schools_users.bulkImport.userPreview.title", {
          count: uploadedUsers.length,
        })}
      </Typography>

      <TableContainer
        component={Paper}
        className="max-h-96 border rounded-md shadow-sm"
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                className={"!border-e-2 !text-center !border-border !font-somar"}
                width="18%"
              >
                {t("profile.schools_users.bulkImport.userPreview.name")}
              </TableCell>
              <TableCell
                className={"!border-e-2 !text-center !border-border !font-somar"}
                width="20%"
              >
                {t("profile.schools_users.bulkImport.userPreview.email")}
              </TableCell>
              <TableCell
                className={"!border-e-2 !text-center !border-border !font-somar"}
                width="14%"
              >
                {t("profile.schools_users.bulkImport.userPreview.phone")}
              </TableCell>
              <TableCell
                className={"!border-e-2 !text-center !border-border !font-somar"}
                width="14%"
              >
                {t("profile.schools_users.bulkImport.userPreview.role")}
              </TableCell>
              <TableCell
                className={"!border-e-2 !text-center !border-border !font-somar"}
                width="12%"
              >
                {t("profile.schools_users.bulkImport.userPreview.status")}
              </TableCell>
              <TableCell
                className={" !text-center !border-border"}
                width="10%"
                align="center"
              >
                {t("profile.schools_users.bulkImport.userPreview.actions")}
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
                  <TableCell
                    className={
                      "!border-e-2 !text-center !border-border !font-somar"
                    }
                  >
                    {isEditing ? (
                      <TextField
                        slotProps={{
                          input: {
                            className:
                              " bg-white !font-somar w-full !text-xs border-border border-2 p-1.5 rounded-md",
                          },
                        }}
                        size="small"
                        fullWidth
                        variant="outlined"
                        value={user.name}
                        onChange={(e) => onEdit(index, "name", e.target.value)}
                      />
                    ) : (
                      <Typography
                        className="!font-somar !text-sm "
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
                  <TableCell
                    className={
                      "!border-e-2 !text-center !border-border !font-somar"
                    }
                  >
                    {isEditing ? (
                      <TextField
                        size="small"
                        fullWidth
                        slotProps={{
                          input: {
                            className:
                              " bg-white !font-somar w-full !text-xs border-border border-2 p-1.5 rounded-md",
                          },
                        }}
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
                        className="!font-somar !text-sm "
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
                  <TableCell
                    className={
                      "!border-e-2 !text-center !border-border !font-somar"
                    }
                  >
                    {isEditing ? (
                      <TextField
                        size="small"
                        fullWidth
                        slotProps={{
                          input: {
                            className:
                              " bg-white !font-somar w-full !text-xs border-border border-2 p-1.5 rounded-md",
                          },
                        }}
                        variant="outlined"
                        value={user.phone}
                        onChange={(e) => onEdit(index, "phone", e.target.value)}
                        error={Boolean(errors?.phone)}
                      />
                    ) : (
                      <Typography
                        className="!font-somar !text-sm "
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
                  <TableCell
                    className={
                      "!border-e-2 !text-center !border-border !font-somar"
                    }
                  >
                    {isEditing ? (
                      <FormControl fullWidth size="small">
                        <Select
                          slotProps={{
                            input: {
                              className:
                                " bg-white w-full !text-xs border-border !font-somar border-2 p-1.5 rounded-md",
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={user.role}
                          onChange={(e) =>
                            onEdit(index, "role", e.target.value)
                          }
                        >
                          {roleOptions.map((role) => (
                            <MenuItem
                              className="!text-xs border-border border-2 p-1.5 !font-somar rounded-md"
                              key={role}
                              value={role}
                            >
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography className="!font-somar !text-sm ">
                        {user.role}
                      </Typography>
                    )}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell
                    className={
                      "!border-e-2 !text-center !border-border !font-somar"
                    }
                  >
                    {hasError ? (
                      <Chip
                        label={t(
                          "profile.schools_users.bulkImport.userPreview.error"
                        )}
                        size="small"
                        color="error"
                        className="!font-somar !text-sm "
                      />
                    ) : isDuplicate ? (
                      <Chip
                        label={t(
                          "profile.schools_users.bulkImport.userPreview.duplicate"
                        )}
                        size="small"
                        color="info"
                      />
                    ) : (
                      <Chip
                        label={t(
                          "profile.schools_users.bulkImport.userPreview.valid"
                        )}
                        size="small"
                        color="success"
                      />
                    )}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell
                    className={" !text-center !border-border !font-somar"}
                    align="center"
                  >
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
        <Alert severity="error" className="my-3 !font-somar">
          <strong>
            {t("profile.schools_users.bulkImport.userPreview.validationErrors")}
          </strong>
          <ul className="list-disc list-inside my-2  text-sm gap-1 flex flex-col">
            {Object.entries(validationErrors).map(([i, err]) => (
              <li key={i}>
                {t(`profile.schools_users.bulkImport.userPreview.row`, {
                  row: +i + 1,
                })}
                : {Object.values(err).join(" , ")}
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </Box>
  );
};

export default UsersPreviewTable;
