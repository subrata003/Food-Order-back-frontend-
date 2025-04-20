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
import { getAllUserProfile, NewUserAdd } from '../apis/user/user';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";


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
  const notify = () => {
    toast.success("User Added Successfully!", {
      position: "top-right", // Adjust position
      autoClose: 2000, // Auto-close after 3 sec
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);
  const fetchAllUsers = async () => {
    const res = await getAllUserProfile();
    setAllUsers(res.data);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData?._id) {
      // update user logic here
    } else {
      // create user logic here
    }
    try {
      const res = await NewUserAdd(formData);
      if (res.success == true) {

        // alert("User Added Successfully")
        setOpen(false);

      }


    } catch (error) {

    }
    finally {
      fetchAllUsers();
      notify();

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
          <Card
            sx={{
              width: 350,
              boxShadow: 4,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
            {/* Header */}
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
              Hotel Person
            </Typography>

            {/* User List */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
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
                        primary={<Typography variant="subtitle1">{user.name}</Typography>}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary">
                              {user.email}- <Typography variant="caption" color="text.secondary">
                                {user.role}
                              </Typography>
                            </Typography>

                          </>
                        }
                      />
                    </ListItem>
                    {index !== filteredUsers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#a7062d',
                  '&:hover': { backgroundColor: '#850423' },
                  textTransform: 'none',
                }}
                onClick={addStaff}
              >
                Add Staff
              </Button>
            </Box>
          </Card>

        )}

        {/* Modal for Add/Edit Staff */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <Typography variant="h6" mb={2}>
              Add User
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
                {userData?.role === "admin" ? roles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                )) : roles.filter(role => role == "staff").map(role => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </TextField>

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={() => setOpen(false)} sx={{ color: "#850423", border: "1px solid #850423" }}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" sx={{
                  backgroundColor: '#a7062d',
                  '&:hover': { backgroundColor: '#850423' },
                  textTransform: 'none',
                }}>
                  Create
                </Button>
              </Box>

            </form>
          </Box>
        </Modal>
        <ToastContainer />
      </Box>
    </>
  );
}

export default Profile;
