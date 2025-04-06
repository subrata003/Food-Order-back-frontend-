import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {  userDetails } from "../apis/user/user";
import { useNavigate } from "react-router-dom";
import { useFood } from "../storeContext/ContextApi";

const LogIn = () => {
 const {fetchProfile}=useFood();
 const navigate = useNavigate();
 const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
 });

 return (
  <Container
      maxWidth="100vw"
      sx={{
        height: "100vh",
        backgroundImage: "linear-gradient(135deg, #a7062d, #ff4b2b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Box
        sx={{
          width: "30%",
          p: 4,
          boxShadow: 3,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom color="#a7062d">
          Login
        </Typography>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("Login Data:", values);
            const res = await userDetails(values);
            if (res.success === true) {
              navigate("/sidebar/dashbord");
              window.location.reload();
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                label="Email"
                name="email"
                variant="outlined"
                margin="normal"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <Field
                as={TextField}
                fullWidth
                label="Password"
                type="password"
                name="password"
                variant="outlined"
                margin="normal"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button type="submit" variant="contained"  fullWidth sx={{ mt: 3, py: 1.5,background:"#a7062d" }}>
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
 );
};

export default LogIn;
