import React, { useEffect, useState } from 'react';
import { useFood } from '../storeContext/ContextApi';
import EditIcon from '@mui/icons-material/Edit';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  Paper,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  Divider,
  Modal,
  TextField,
  MenuItem
} from '@mui/material';
import { getAllUserProfile } from '../apis/user/user';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const roles = ["admin", "manager", "staff"];

function Profile() {
  const { userData } = useFood();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    const fetchAllUsers = async () => {
      const res = await getAllUserProfile();
      setAllUsers(res.data);
    };
    fetchAllUsers();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const addStaff = () => {
    setInitialData({});
    setFormData({ name: '', email: '', password: '', role: '' });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData?._id) {
      // update user logic here
    } else {
      // create user logic here
    }
    console.log("form data is:", formData);
    setOpen(false);
  };

  const filteredUsers = userData?.role === "admin"
    ? allUsers.filter(user => user.role === 'manager' || user.role === 'staff')
    : userData?.role === "manager"
      ? allUsers.filter(user => user.role === 'staff')
      : [];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
          mt: 4,
          px: 2,
        }}
      >
        {/* User Profile Card */}
        <Card
          sx={{
            width: 320,
            boxShadow: 4,
            borderRadius: 3,
            textAlign: 'center',
            p: 3,
          }}
        >
          <Avatar
            src={userData?.avatar || ''}
            alt={userData?.name}
            sx={{
              width: 80,
              height: 80,
              margin: 'auto',
              mb: 2,
              bgcolor: '#a7062d',
              fontSize: 40,
            }}
          >
            {!userData?.avatar && userData?.name?.charAt(0).toUpperCase()}
          </Avatar>

          <CardContent>
            <Typography variant="h6" gutterBottom>
              {userData?.name || 'John Doe'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {userData?.email || 'johndoe@example.com'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Role: {userData?.role || 'User'}
            </Typography>
          </CardContent>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              size="small"
              sx={{ backgroundColor: '#a7062d', '&:hover': { backgroundColor: '#850423' } }}
              startIcon={<EditIcon />}
              onClick={() => console.log('Edit profile clicked')}
            >
              Edit
            </Button>
            <Button variant="outlined" size="small" color="error" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Card>

        {/* All Users List */}
        {userData?.role !== "staff" && (
          <Paper elevation={4} sx={{ width: 400, p: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
              Hotel Person
            </Typography>
            <List>
              {filteredUsers.map((user, index) => (
                <React.Fragment key={user._id || index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={user.avatar}>
                        {!user.avatar && user.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {user.email}
                          </Typography>
                          {' — '}
                          {user.role}
                        </>
                      }
                    />
                  </ListItem>
                  {index !== filteredUsers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button
              variant='contained'
              sx={{ marginTop: 2, backgroundColor: '#a7062d', '&:hover': { backgroundColor: '#850423' } }}
              onClick={addStaff}
            >
              Add Staff
            </Button>
          </Paper>
        )}

        {/* Modal for Add/Edit Staff */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <Typography variant="h6" mb={2}>
              {initialData?._id ? 'Edit User' : 'Add User'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                required
                margin="normal"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                required
                type="email"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />
              {!initialData._id && (
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  required
                  type="password"
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange}
                />
              )}
              <TextField
                select
                fullWidth
                label="Role"
                name="role"
                required
                margin="normal"
                value={formData.role}
                onChange={handleChange}
              >
                {roles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </TextField>

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  {initialData?._id ? 'Update' : 'Create'}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
    </>
  );
}

export default Profile;
