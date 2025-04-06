import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { addFood } from "../apis/food/addFood";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFood } from "../storeContext/ContextApi";


const categories = [
  "Salad", "Rolls", "Deserts", "Sandwich", "Cake",
  "Pure Veg", "Pasta", "Momo"
];

const AddFood = ({ handleViewAll }) => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(false);
  const { fetchFoods } = useFood();

  const notify = () => {
    toast.success("Product added successfully!", {
      position: "top-right", // Adjust position
      autoClose: 2000, // Auto-close after 3 sec
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };
  // console.log("img is ",imageFile.name);


  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      price: "",

    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      category: Yup.string().required("Select a category"),
      price: Yup.number()
        .positive("Price must be positive")
        .required("Price is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("price", values.price);

      if (imageFile) {
        formData.append("image", imageFile); // ✅ Append actual file
      }

      // Debugging: Log FormData key-value pairs
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ": ", pair[1]);  // Display key-value pairs
      // }

      try {
        const res = await addFood(formData);
        if (res.success == true) {

          fetchFoods();
          notify();
          resetForm();
          setImageFile(false)

        }
      } catch (error) {
        console.error("Error adding food:", error);
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log("file name is :", file);

    if (file) {
      setImage(URL.createObjectURL(file)); // Preview URL
      setImageFile(file); // Store the actual file
    }
  };

  return (
    <>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 3,

        }}
      >
        <Card
          sx={{
            width: "90%",
            maxWidth: 800,
            p: 4,
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              textAlign="center"
              gutterBottom
              sx={{ color: "#da1142" }}
            >
              Add New Product
            </Typography>

            <form
              onSubmit={formik.handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Image Upload */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <label htmlFor="image">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 120,
                      height: 120,
                      border: "2px dashed gray",
                      cursor: "pointer",
                      borderRadius: "50%",
                      overflow: "hidden",
                      transition: "border 0.3s ease",
                      "&:hover": { border: "2px solid black" },
                      mx: "auto",
                    }}
                  >
                    <img
                      src={image || "https://www.pngplay.com/wp-content/uploads/8/Upload-Icon-Logo-PNG-Photos.png"}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                </label>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Click to Upload Image
                </Typography>
                <input type="file" id="image" hidden onChange={handleImageChange} accept="image/*" />
              </Box>

              {/* Product Name & Description */}
              <TextField
                label="Product Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
              />

              <TextField
                label="Product Description"
                name="description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                fullWidth
              />

              {/* Category & Price */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  fullWidth
                />
              </Box>

              {/* Submit Button */}
              <Box sx={{display:"flex",justifyContent:"flex-end"}}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mt: 2, fontWeight: "bold", background: "#da1142", width: "200px" }}

                >
                  Add Product
                </Button>
              </Box>
              <ToastContainer />
            </form>
          </CardContent>
        </Card>
      </Box>
    </>

  );
};

export default AddFood;
