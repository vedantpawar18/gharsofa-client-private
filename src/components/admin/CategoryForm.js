import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addCategoryItem, updateCategoryItem } from "../../redux/categorySlice";

const CategoryForm = ({
  open,
  handleClose,
  onCategoryAdded,
  editingCategory,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    roomType: "",
    status: true,
  });

  const roomTypes = [
    "Living Room",
    "Bedroom",
    "Dining Room",
    "Home Office",
    "Kitchen",
    "Bathroom",
    "Outdoor",
    "Kids Room",
    "Storage",
    "Entryway",
  ];

  const furnitureCategories = {
    "Living Room": [
      "Sofas & Couches",
      "Coffee Tables",
      "TV Stands",
      "Accent Chairs",
      "Side Tables",
    ],
    Bedroom: [
      "Beds & Mattresses",
      "Dressers",
      "Nightstands",
      "Wardrobes",
      "Vanities",
    ],
    "Dining Room": [
      "Dining Tables",
      "Dining Chairs",
      "Buffets & Sideboards",
      "Bar Stools",
      "Wine Racks",
    ],
    "Home Office": [
      "Desks",
      "Office Chairs",
      "Bookcases",
      "Filing Cabinets",
      "Desk Lamps",
    ],
    Kitchen: [
      "Kitchen Islands",
      "Bar Carts",
      "Kitchen Storage",
      "Breakfast Nooks",
    ],
    Bathroom: [
      "Bathroom Vanities",
      "Storage Cabinets",
      "Mirrors",
      "Shower Benches",
    ],
    Outdoor: [
      "Patio Sets",
      "Outdoor Chairs",
      "Garden Benches",
      "Outdoor Tables",
      "Hammocks",
    ],
    "Kids Room": [
      "Kids Beds",
      "Study Tables",
      "Storage Units",
      "Play Tables",
      "Bean Bags",
    ],
    Storage: [
      "Shelving Units",
      "Storage Cabinets",
      "Shoe Racks",
      "Wall Shelves",
      "Coat Racks",
    ],
    Entryway: [
      "Console Tables",
      "Hall Trees",
      "Benches",
      "Key Holders",
      "Umbrella Stands",
    ],
  };

  // On component mount, update form data if we're editing a category
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        categoryName: editingCategory.categoryName || "",
        description: editingCategory.description || "",
        roomType: editingCategory.roomType || "", // Make sure roomType is properly set
        status: editingCategory.status !== undefined ? editingCategory.status : true,
      });
    }
  }, [editingCategory]);

  // Handle input changes on form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (formData.categoryName && formData.roomType) {
        if (editingCategory) {
          await dispatch(updateCategoryItem({ ...formData, _id: editingCategory._id })).unwrap();
        } else {
          await dispatch(addCategoryItem(formData)).unwrap();
        }
        onCategoryAdded();
        handleClose();
        resetForm();
      } else {
        alert("Please fill all required fields.");
      }
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      categoryName: "",
      description: "",
      roomType: "",
      status: true,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {editingCategory ? "Edit Category" : "Add New Category"}
        <IconButton onClick={handleClose}>
          <AiOutlineClose />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Room Type</InputLabel>
              <Select
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                label="Room Type"
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Category Name</InputLabel>
              <Select
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                label="Category Name"
                disabled={!formData.roomType} // Disable if roomType is not selected
              >
                {/* Check if roomType is valid before rendering categories */}
                {formData.roomType && furnitureCategories[formData.roomType] ? (
                  furnitureCategories[formData.roomType].map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No categories available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "black",
            "&:hover": { backgroundColor: "black" },
          }}
        >
          {editingCategory ? "Update" : "Save"}
        </Button>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: "black",
            borderColor: "black",
            "&:hover": { borderColor: "black" },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;
