import { useEffect, useState } from 'react';
import {
  Box, Button, Container, Dialog, DialogTitle, DialogContent,
  Grid, TextField, Typography, InputAdornment, Table, TableBody,
  TableCell, TableHead, TableRow, Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { HAxiosService, useToast, HDialog } from "@helix/component-library";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { UserManagementAPI } from './apiEndpoints';
import { isApiSuccess, getApiMsg } from "./apiResponse";

function GroupComponent() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [editGroup, setEditGroup] = useState(null);
  const [editName, setEditName] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const handleOpen = () => setOpen(true);
  const toast = useToast();
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '' });
  };
const handleDeleteGroup = async (groupId) => {
  try {
    const res = await HAxiosService.DELETE(UserManagementAPI.delete_group(groupId));
	

    isApiSuccess(res)
      ? toast.success(getApiMsg(res, "Group deleted"), { position: "top-right", autoClose: 700 })
      : toast.error(getApiMsg(res, "Failed to delete group"), { position: "top-right", autoClose: 700 });

    fetchGroups();
  } catch (error) {
    toast.error(error?.response?.data?.msg || 'Error deleting group', {
      position: "top-right",
      autoClose: 700,
    });
  }
};

  const fetchGroups = async () => {
    try {
      const res = await HAxiosService.GET(UserManagementAPI.fetch_groups());
      setGroups(res.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchGroupById = async (groupId) => {
    try {
      const res = await HAxiosService.GET(UserManagementAPI.fetch_groups_by_id(groupId));
      setEditGroup(res.data);
      setEditName(res.data.name);
      setShowEditDialog(true);
    } catch (error) {
      console.error('Error fetching group by ID:', error);
    }
  };
const handleUpdateGroup = async () => {
  if (!editName.trim()) return;
  try {
    const res = await HAxiosService.PUT(UserManagementAPI.groups(), {
      groupName: editName,
      id: editGroup.id,
    });
    isApiSuccess(res)
      ? toast.success(getApiMsg(res, "Group updated"), { position: "top-right", autoClose: 700 })
      : toast.error(getApiMsg(res, "Failed to update group"), { position: "top-right", autoClose: 700 });

    fetchGroups();
    setShowEditDialog(false);
  } catch (error) {
    toast.error(error?.response?.data?.msg || 'Error updating group', {
      position: "top-right",
      autoClose: 700,
    });
  }
};

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async () => {
  if (!formData.name.trim()) return;
  try {
    const res = await HAxiosService.POST(UserManagementAPI.groups(), {
      groupName: formData.name,
    });
    isApiSuccess(res)
      ? toast.success(getApiMsg(res, "Group created"), { position: "top-right", autoClose: 700 })
      : toast.error(getApiMsg(res, "Group creation failed"), { position: "top-right", autoClose: 700 });

    fetchGroups();
    handleClose();
  } catch (err) {
    toast.error(err?.response?.data?.msg || 'Group creation failed', {
      position: "top-right",
      autoClose: 700,
    });
  }
};

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Groups</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          className='custom-button'
        >
          Create Group
        </Button>
      </Box>

      <TextField
        placeholder="Search Groups..."
        fullWidth
        variant="outlined"
        size='small'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 2 }}
        className="custom-textfield"
      />

      <Table>
       <TableHead>
  <TableRow>
    <TableCell><strong>Group Name</strong></TableCell>
    <TableCell><strong>Actions</strong></TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {filteredGroups.map((group, idx) => (
    <TableRow key={idx}>
      <TableCell>
        <Link
          component="button"
          onClick={() => fetchGroupById(group.id)}
          underline="hover"
        >
          {group.name}
        </Link>
      </TableCell>
      <TableCell>
        <IconButton size='small' color="error" onClick={() => handleDeleteGroup(group.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>

      {/* Create Group Dialog */}
      <HDialog disableContentWrapper open={open} onClose={handleClose} fullWidth maxWidth="sm" title="Create Group">
        <DialogContent>
          <Grid container spacing={2} marginTop="1rem">
            <Grid style={{ display: 'flex', alignItems: 'center' }} size={3}>
              <Typography variant="subtitle1" marginLeft="1rem" fontWeight="bold">
                Group Name:
              </Typography>
            </Grid>
            <Grid size={9}>
              <TextField
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" gap="1rem" mt={3} mb={2}>
            <Button className='custom-button' variant="outlined" onClick={handleSubmit}>
              Create Group
            </Button>
            <Button variant="text" className='custom-button' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </HDialog>

      <HDialog disableContentWrapper open={showEditDialog} onClose={(e, reason) => { if (reason === "backdropClick") { e.stopPropagation(); } else { setShowEditDialog(false); } }} title="Edit Group Name" slotProps={{ paper: {
          sx: {
            padding: "20px",
            borderRadius: "6px",
            minWidth: "450px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          },
        } }}>
        <DialogContent>
          <TextField
            label="Group Name"
            size='small'
        className="custom-textfield"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            variant="outlined"
            sx={{ mb: 3,mt:3 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button className='custom-button' variant="contained" onClick={handleUpdateGroup}>
              Update
            </Button>
            <Button variant="outlined" className='custom-button'  onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </HDialog>
    </Container>
         
  );
}

export default GroupComponent;
