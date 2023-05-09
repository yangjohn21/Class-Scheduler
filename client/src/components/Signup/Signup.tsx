import {
  TextField,
  Container,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Grid,
  Link
} from "@mui/material";

import {useState,useEffect} from 'react';
import axios from "axios";

  import { signup } from '../api_file'

const Signup = () => {
  //const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const userData = {
          name: data.get('firstName'),
          email: data.get('email'),
          password: data.get('password'),
          confirmPassword: data.get('password')
          }
        console.log({
        email: data.get('email'),
        password: data.get('password'),
        });
        const result = await signup(userData)
        console.log(result)
    };

    return (
          <Container component="main" maxWidth="xs">
            {/* <CssBaseline /> */}
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      value = {first}
                      onChange = {(e) => {setFirstname(e.target.value)}}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      value={last}
                      onChange = {(e) => setLastname(e.target.value)}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      value={email}
                      onChange = {(e) => {setEmail(e.target.value)}}
                      autoComplete="email"
                    />
                  </Grid>
                  <Typography color="#ff0000" sx = {{mx: 2}} variant ="caption"> {emailError? emailError:""} </Typography>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      value={password}
                      onChange = {(e) => {setPassword(e.target.value)}}
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Typography color="#ff0000" sx = {{mx: 2}} variant ="caption"> {passwordError? passwordError:""} </Typography>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange = {(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Typography color="#ff0000" sx = {{mx: 2}} variant ="caption"> {confirmError? confirmError:""} </Typography>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/Login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
                {register ? (
                  <p className="text-success">You Are Registered Successfully</p>
                ) : (
                  <p className="text-danger">You Are Not Registered</p>
                )}
              </Box>
            </Box>
          </Container>
      );
}
export default Signup;