import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { userDetails } from "../apis/user/user";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
 const navigate= useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async(values, { setSubmitting }) => {
            console.log("Login Data:", values);
            const res=await userDetails(values)
            if(res.success===true){
              navigate("/sidebar/dashbord")
              console.log("Login Response:", res);
              setSubmitting(false);
            }
            
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
              
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
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
