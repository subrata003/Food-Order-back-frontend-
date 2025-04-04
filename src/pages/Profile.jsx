import React from 'react'
import { useFood } from '../storeContext/ContextApi'
import { Avatar, Modal, Typography } from '@mui/material';
import {Box, Paper } from "@mui/material";

function Profile({openModal,setOpenModal}) {
 const {userData}=useFood();
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="modal-title">
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          {/* <Paper elevation={3} sx={{ padding: 2, display: "flex", alignItems: "center", maxWidth: 350 }}>
            <Avatar sx={{ bgcolor: "primary.main", marginRight: 2 }}>
              {userData.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {userData.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userData.email}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
                {userData.role}
              </Typography>
            </Box>
          </Paper> */}
          {/* <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button onClick={() => setOpenModal(false)} variant="contained" color="primary">
              Close
            </Button>
          </Box> */}
        </Box>
      </Modal>
  )
}

export default Profile
