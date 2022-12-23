import * as React from "react";
import { useEffect } from "react";
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
import { db } from "../../firebase-config";
import { useSnackbar } from 'notistack'


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

const veiculoCollectionRef = collection(db, "veiculos");

export default function AddVeiculo({ id, setVeiculoId, open, setOpen }) {
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = () => [
    setOpen(false),
    setPlaca(""),
    setTipo(""),
    setMarca(""),
    setModelo(""),
    setRastreador(""),
    setIdRastreador(""),
    setVeiculoId(""),
  ];

  const [placa, setPlaca] = React.useState("");
  const [tipo, setTipo] = React.useState("");
  const [marca, setMarca] = React.useState("");
  const [modelo, setModelo] = React.useState("");
  const [rastreador, setRastreador] = React.useState("");
  const [idRastreador, setIdRastreador] = React.useState("");

  const handleSubmit = async () => {
    if (!placa || !tipo) {
      console.log("Placa é necessário!");
      enqueueSnackbar('Placa é necessário!', {variant: 'warning', autoHideDuration: 3000});
      return;
    }
    const newVeiculo = {
      placa,
      tipo,
      marca,
      modelo,
      rastreador,
      idRastreador,
    };
    console.log(newVeiculo);

    try {
      if (id !== undefined && id !== "") {
        const veiculoDoc = doc(veiculoCollectionRef, id);
        await updateDoc(veiculoDoc, newVeiculo);
        setVeiculoId("");
        console.log("Veículo atualizado com sucesso!");
        enqueueSnackbar('Veículo atualizado com sucesso!', {variant: 'success', autoHideDuration: 3000});
      } else {
        await addDoc(veiculoCollectionRef, newVeiculo);
        console.log("Veículo adicionado com sucesso!");
        enqueueSnackbar('Veículo adicionado com sucesso!', {variant: 'success', autoHideDuration: 3000});
        
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err, {variant: 'error', autoHideDuration: 5000});
    }

    setPlaca("");
    setTipo("");
    setMarca("");
    setModelo("");
    setRastreador("");
    setIdRastreador("");
    handleClose();
  };

  const editHandler = async () => {
    try {
      const docRef = doc(db, "veiculos", id);
      const docSnap = await getDoc(docRef);
      console.log("the record is :", docSnap.data());
      setPlaca(docSnap.data().placa);
      setTipo(docSnap.data().tipo);
      setMarca(docSnap.data().marca);
      setModelo(docSnap.data().modelo);
      setRastreador(docSnap.data().rastreador);
      setIdRastreador(docSnap.data().idRastreador);
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err, {variant: 'error', autoHideDuration: 5000});
    }
    setOpen(true);
  };

  useEffect(() => {
    console.log("The id here is : ", id);
    if (id !== undefined && id !== "") {
      editHandler();
    }
    // eslint-disable-next-line
  }, [id]);

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  return (
    <div>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
      >
        <Box sx={style}>

          <Typography id="unstyled-modal-title" variant="h4" align="center">Veículo</Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={2}
            mb={1}
            spacing={2}
          >
            <TextField
              label="Placa"
              required
              defaultValue={placa}
              fullWidth
              onChange={(e) => setPlaca(e.target.value)}
            />
            <FormControl fullWidth sx={{ minWidth: 120 }}>
              <InputLabel required id="select-helper-label">Tipo</InputLabel>
              <Select
                labelId="select-helper-label"
                id="select-helper"
                value={tipo}
                label="Tipo"
                onChange={handleTipoChange}
              >
                <MenuItem value="">
                  <em>Escolher</em>
                </MenuItem>
                <MenuItem value="Cavalo">Cavalo</MenuItem>
                <MenuItem value="Carreta">Carreta</MenuItem>
                <MenuItem value="Central">Central</MenuItem>
                <MenuItem value="Dolly">Dolly</MenuItem>
                <MenuItem value="Truck">Truck</MenuItem>
                <MenuItem value="Bitruck">Bitruck</MenuItem>
                <MenuItem value="Toco">Toco</MenuItem>
                <MenuItem value="Van">Van</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={2}
            mb={1}
            spacing={2}
          >
            <TextField
              label="Marca"
              fullWidth
              defaultValue={marca}
              onChange={(e) => setMarca(e.target.value)}
            />
            <TextField
              label="Modelo"
              fullWidth
              defaultValue={modelo}
              onChange={(e) => setModelo(e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={2}
            mb={3}
            spacing={2}
          >
            <FormControl fullWidth>
              <InputLabel id="rastreador-label">Rastreador</InputLabel>
              <Select
                labelId="rastreador-label"
                id="select-helper"
                value={rastreador}
                label="Rastreador"
                onChange={(valuePick) => {
                  setRastreador(valuePick.target.value)
                }}
              >
                <MenuItem value="">
                  <em>Escolher</em>
                </MenuItem>
                <MenuItem value="Onixsat/Jabur">Onixsat/Jabur</MenuItem>
                <MenuItem value="Omnilink">Omnilink</MenuItem>
                <MenuItem value="Autotrac">Autotrac</MenuItem>
                <MenuItem value="Sascar/Sasgc">Sascar/Sasgc</MenuItem>
                <MenuItem value="Outros">Outros</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="ID / MCT"
              fullWidth
              defaultValue={idRastreador}
              onChange={(e) => setIdRastreador(e.target.value)}
            />
          </Stack>
          <Stack 
            direction="row"
            justifyContent="space-between"
          >
            <Button sx={{width: "8rem"}} onClick={handleSubmit} variant="contained">
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
