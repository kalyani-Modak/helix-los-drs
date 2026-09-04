import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { HAxiosService, useToast, HDialog } from "@helix/component-library";
import { ClientDetailsAPI, UserManagementAPI } from "./apiEndpoints";

function AssignRoleDialog({ open, onClose, userNameId, realm }) {
  const [roleGroups, setRoleGroups] = useState({});
  const [selectedRolesByGroup, setSelectedRolesByGroup] = useState({});
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();
  useEffect(() => {
    if (open) {
      fetchRoles();
    } else {
      // Reset state on close for clean re-entry
      setSearchTerm("");
      setSelectedRolesByGroup({});
      setRoleGroups({});
      setLoading(false);
      setAssignLoading(false);
    }
  }, [open]);

  const fetchRoles = () => {
    setLoading(true);
    HAxiosService.GET(ClientDetailsAPI.ROLES(realm))
      .then((res) => {
        const raw = res?.data;
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
          setRoleGroups({});
          return;
        }
        const out = {};
        Object.entries(raw).forEach(([group, roles]) => {
          if (!Array.isArray(roles)) return;
          out[group] = roles
            .map((r, idx) => {
              if (typeof r === "string") return { id: `${group}-${r}`, name: r, description: "" };
              if (r?.name) return { id: r.id || `${group}-${r.name}-${idx}`, name: r.name, description: r.description || "" };
              return null;
            })
            .filter(Boolean);
        });
        setRoleGroups(out);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        toast.error("Failed to load roles");
      })
      .finally(() => setLoading(false));
  };

  const handleRoleToggle = (roleName, group) => {
    setSelectedRolesByGroup((prev) => {
      const current = prev[group] || [];
      const exists = current.includes(roleName);
      const updated = exists ? current.filter((r) => r !== roleName) : [...current, roleName];
      return updated.length > 0 ? { ...prev, [group]: updated } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== group));
    });
  };

  const handleAssign = () => {
    if (!Object.keys(selectedRolesByGroup).length) {
      toast.warn("Please select at least one role to assign.");
      return;
    }
    setAssignLoading(true);
    HAxiosService.POST(UserManagementAPI.assign_role(), {
      realm,
      userName: userNameId,
      roles: selectedRolesByGroup,
    })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          toast.success(res.data.msg || "Roles assigned successfully");
          onClose();
        } else {
          toast.error(res.data.msg || "Failed to assign roles");
        }
      })
      .catch((err) => {
        console.error("Error assigning roles:", err);
        toast.error(err.response?.data?.message || "Error assigning roles");
      })
      .finally(() => setAssignLoading(false));
  };

  const roleRows = useMemo(() => {
    const rows = [];
    const q = searchTerm.toLowerCase();
    Object.entries(roleGroups).forEach(([group, roles]) => {
      (roles || [])
        .filter((role) => (role?.name || "").toLowerCase().includes(q))
        .forEach((role) => {
          rows.push({
            id: `${group}-${role.id || role.name}`,
            name: role.name,
            description: role.description || "-",
            group,
          });
        });
    });
    return rows;
  }, [roleGroups, searchTerm]);

  const columns = [
  { field: "name", headerName: "Role Name", flex: 1 },
  { field: "description", headerName: "Description", flex: 1 },
  { field: "group", headerName: "Group", flex: 0.7 }, 
  {
    field: "action",
    headerName: "Action",
    flex: 0.5,
    sortable: false,
    renderCell: (params) => {
      const { name, group } = params.row;
      const isSelected = selectedRolesByGroup[group]?.includes(name) || false;
      return (
        <Button
          size="small"
          variant={isSelected ? "contained" : "outlined"}
          color={isSelected ? "success" : "primary"}
          onClick={() => handleRoleToggle(name, group)}
        >
          {isSelected ? "Remove" : "Add"}
        </Button>
      );
    },
  },
];

  return (
    <HDialog
      disableContentWrapper
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      title={<>Assign Roles to: {userNameId}</>}
    >
      <DialogContent>
        <TextField
          label="Search Roles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={roleRows}
              columns={columns}
              pageSizeOptions={[10, 20, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={assignLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={assignLoading || loading || roleRows.length === 0}
        >
          {assignLoading ? "Assigning..." : "Assign"}
        </Button>
      </DialogActions>
    </HDialog>
  );
}

export default AssignRoleDialog;
