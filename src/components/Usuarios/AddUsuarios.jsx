import * as React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled } from "@mui/system";
import Box from "@mui/system/Box"
import ModalUnstyled from "@mui/base/ModalUnstyled";
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useSnackbar } from 'notistack'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Checkbox, FormControlLabel, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";


const BackdropUnstyled = React.forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ "MuiBackdrop-open": open }, className)}
      ref={ref}
      {...other}
    />
  );
});

BackdropUnstyled.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const Modal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled(BackdropUnstyled)`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme) => ({
  width: 400,
  bgcolor: theme.palette.mode === "dark" ? "#0A1929" : "white",
  borderRadius: "6px",
  padding: "16px 32px 24px 32px",
});

export default function AddUsuarios({ id, setUsuariosId, open, setOpen }) {
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = () => [
    setOpen(false),
    setUsuariosId(""),
  ];

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password, setPassword] = useState("");

  const registerWithEmailAndPassword = async () => {
    if (password1 !== password2) {
      enqueueSnackbar('As senhas não coincidem!', {variant: 'error', autoHideDuration: 3000});
      return;
    }
    setPassword(password1);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "usuarios"), {
        uid: user.uid,
        nome,
        sobrenome,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
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
    <div>
      <Modal
        aria-labelledby="unstyled-modal-title"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
      >
        <Box sx={style}>
          <Typography id="unstyled-modal-title" variant="h4" align="center">Usuário</Typography>
          <TextField
            label="Nome"
            margin="normal"
            required
            defaultValue={nome}
            fullWidth
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            label="Sobrenome"
            margin="normal"
            defaultValue={nome}
            fullWidth
            onChange={(e) => setSobrenome(e.target.value)}
          />
          <TextField
            label="Email"
            margin="normal"
            required
            fullWidth
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <TextField
            label="Senha"
            margin="normal"
            fullWidth
            defaultValue={password1}
            onChange={(e) => setPassword1(e.target.value)}
          /> */}
            <FormControl required sx={{ my: 2 }} fullWidth variant="outlined">
              <InputLabel htmlFor="password1">Senha</InputLabel>
              <OutlinedInput
                id="password1"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password1}
                onChange={(e) => setPassword1(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                    </IconButton>
                  </InputAdornment>
                }
                name="password1"
                label="Senha"
              />
            </FormControl>
          {/* <TextField
            label="Confirme a senha"
            margin="normal"
            fullWidth
            defaultValue={password2}
            onChange={(e) => setPassword2(e.target.value)}
          /> */}
          <FormControl required sx={{ my: 2 }} fullWidth variant="outlined">
              <InputLabel htmlFor="password2">Confirme a senha</InputLabel>
              <OutlinedInput
                id="password2"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password2}
                onChange={(e) => setPassword2(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                    </IconButton>
                  </InputAdornment>
                }
                name="password2"
                label="Confirme a senha"
              />
            </FormControl>
          <FormControlLabel
            sx={{ width: "100%", justifyContent: "start", mb:2, ml: 1,}}
            control={
              <Checkbox
                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            }
            label="Será administrador?"
            labelPlacement="start"
          />
          <Stack 
            direction="row"
            justifyContent="space-between"
          >
            <Button color="success" sx={{width: "8rem"}} onClick={registerWithEmailAndPassword} variant="contained">
              Salvar
            </Button>
            <Button sx={{width: "8rem"}} onClick={handleClose} variant="contained" color="error">
              Fechar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
