import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { Image } from "mui-image";
import COOPERTRAC from "../common/img/COOPERTRAC.png";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard/programacaodiaria");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const handleLogin = async (email, password) => {
    if (!email && !password) {
      enqueueSnackbar("Favor preencha e-mail e senha", {
        variant: "warning",
        autoHideDuration: 3000,
      });
      return;
    }
    if (!email) {
      enqueueSnackbar("Favor preencha e-mail", {
        variant: "warning",
        autoHideDuration: 3000,
      });
      return;
    }
    if (!password) {
      enqueueSnackbar("Favor preencha senha", {
        variant: "warning",
        autoHideDuration: 3000,
      });
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err.code);
      switch (err.code) {
        case "auth/invalid-email":
          return enqueueSnackbar("Email inválido", {
            variant: "error",
            autoHideDuration: 3000,
          });
        case "auth/wrong-password":
          return enqueueSnackbar("Senha inválida", {
            variant: "error",
            autoHideDuration: 3000,
          });
        case "auth/user-not-found":
          return enqueueSnackbar("Usuário não encontrado", {
            variant: "error",
            autoHideDuration: 3000,
          });
        default:
          return null;
      }
    }
  };

  const [values, setValues] = useState(false);
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            borderRadius: 2,
            boxShadow: 4,
          }}
        >
          <Image duration={625} src={COOPERTRAC} />
          <Box component="form" noValidate sx={{ mt: 6 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de email"
              name="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl required sx={{ my: 2 }} fullWidth variant="outlined">
              <InputLabel htmlFor="password">Senha</InputLabel>
              <OutlinedInput
                id="password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? (
                        <VisibilityOffRounded />
                      ) : (
                        <VisibilityRounded />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                name="password"
                label="Senha"
              />
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleLogin(email, password)}
            >
              Entrar
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
