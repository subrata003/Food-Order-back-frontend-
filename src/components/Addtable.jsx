import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography
} from '@mui/material';
import { addTable } from '../apis/table/table';

const Addtable = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    tableNumber: '',
    status: 'free',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async() => {
    console.log("Submitted Table:", formData);
    const res=await addTable(formData)
    if(res){
      alert("Table Added Successfully") 
    }
    setFormData('')
    onSubmit?.(formData);
  };

  return (
    <Box sx={{ width: 300, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add / Edit Table
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Table Number"
        name="tableNumber"
        value={formData.tableNumber}
        onChange={handleChange}
        required
      />

      <TextField
        select
        fullWidth
        margin="normal"
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <MenuItem value="free">Free</MenuItem>
        <MenuItem value="reserved">Reserved</MenuItem>
      </TextField>

      <Button
        fullWidth
        variant="contained"
        // color="primary"
        
        sx={{ mt: 2,background:"#da1142" }}
        onClick={handleSubmit}
        
      >
        Submit
      </Button>
    </Box>
  );
};

export default Addtable;
