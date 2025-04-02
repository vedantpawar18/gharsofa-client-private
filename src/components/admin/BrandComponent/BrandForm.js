import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import { FaImage } from 'react-icons/fa';  
import { toast, Toaster } from 'react-hot-toast';
import api from "../../../config/axiosConfig"

const BrandForm = ({ open, handleClose }) => {
  const [brandName, setBrandName] = useState('');
  const [brandTitle, setBrandTitle] = useState('');
  const [brandLogo, setBrandLogo] = useState(null);
  const [description, setDescription] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [specialties, setSpecialties] = useState([]);

  const furnitureStyles = [
    'Modern', 'Contemporary', 'Traditional', 'Industrial', 
    'Rustic', 'Scandinavian', 'Mid-Century Modern', 'Minimalist',
    'Bohemian', 'Art Deco', 'Coastal', 'Farmhouse'
  ];
  
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandLogo(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSpecialtyChange = (event) => {
    setSpecialties(event.target.value);
  };

  const handleSaveBrand = async () => {
    try {
      const response = await api.post("/brand/addNewBrand", {
        brandName,
        brandTitle,
        logo: brandLogo,
        description,
        countryOfOrigin,
        yearEstablished,
        specialties
      });

      if(response.status === 200) {
        toast.success(response.data.message);
        resetForm();
        handleClose();
      }
    } catch(error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const resetForm = () => {
    setBrandLogo(null);
    setBrandName("");
    setBrandTitle("");
    setDescription("");
    setCountryOfOrigin("");
    setYearEstablished("");
    setSpecialties([]);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center pb-2">
        Add New Furniture Brand
        <IconButton onClick={handleClose} className="text-gray-500">
          <AiOutlineClose />
        </IconButton>
      </DialogTitle>
      <DialogContent className="pt-2">
        <Grid container spacing={2}>
          <Grid item xs={12} className="flex justify-center mb-4">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                {brandLogo ? (
                  <img src={brandLogo} alt="Brand Logo" className="object-contain" />
                ) : (
                  <FaImage className="text-gray-400 text-4xl" />
                )}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="brandName"
              label="Brand Name"
              type="text"
              fullWidth
              variant="outlined"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              id="brandTitle"
              label="Brand Title"
              type="text"
              fullWidth
              variant="outlined"
              value={brandTitle}
              onChange={(e) => setBrandTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              id="description"
              label="Description"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              id="countryOfOrigin"
              label="Country of Origin"
              type="text"
              fullWidth
              variant="outlined"
              value={countryOfOrigin}
              onChange={(e) => setCountryOfOrigin(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              id="yearEstablished"
              label="Year Established"
              type="number"
              fullWidth
              variant="outlined"
              value={yearEstablished}
              onChange={(e) => setYearEstablished(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Specialties</InputLabel>
              <Select
                multiple
                value={specialties}
                onChange={handleSpecialtyChange}
                label="Specialties"
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                )}
              >
                {furnitureStyles.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSaveBrand}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            marginRight: '10px',
            '&:hover': {
              backgroundColor: 'black',
            },
          }}
        >
          Save
        </Button>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid black',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
      <Toaster position="top-center" />
    </Dialog>
  );
};

export default BrandForm;
