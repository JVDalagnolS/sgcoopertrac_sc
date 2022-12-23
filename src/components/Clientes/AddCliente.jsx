import * as React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled } from "@mui/system";
import Box from "@mui/system/Box";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useSnackbar } from "notistack";

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

const clienteCollectionRef = collection(db, "clientes");

export default function AddCliente({ id, setClienteId, open, setOpen }) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => [
    setOpen(false),
    setNomeCliente(""),
    setEndereco(""),
    setCidade(""),
    setEstado(""),
    setEmail(""),
    setCelular(""),
    setTelFixo(""),
    setClienteId(""),
  ];

  const [nomeCliente, setNomeCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [telFixo, setTelFixo] = useState("");

  const handleSubmit = async () => {
    if (!nomeCliente) {
      console.log("Nome é necessário!");
      enqueueSnackbar("Nome é necessário!", {
        variant: "warning",
        autoHideDuration: 3000,
      });
      return;
    }
    const newCliente = {
      nomeCliente,
      endereco,
      bairro,
      cidade,
      estado,
      email,
      celular,
      telFixo,
    };
    console.log(newCliente);

    try {
      if (id !== undefined && id !== "") {
        const clienteDoc = doc(clienteCollectionRef, id);
        await updateDoc(clienteDoc, newCliente);
        setClienteId("");
        console.log("Cliente atualizado com sucesso!");
        enqueueSnackbar("Cliente atualizado com sucesso!", {
          variant: "success",
          autoHideDuration: 3000,
        });
      } else {
        await addDoc(clienteCollectionRef, newCliente);
        console.log("Cliente adicionado com sucesso!");
        enqueueSnackbar("Cliente adicionado com sucesso!", {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }

    setNomeCliente("");
    setEndereco("");
    setBairro("");
    setCidade("");
    setEstado("");
    setEmail("");
    setCelular("");
    setTelFixo("");
    handleClose();
  };

  const editHandler = async () => {
    try {
      const docRef = doc(db, "clientes", id);
      const docSnap = await getDoc(docRef);
      console.log("the record is :", docSnap.data());
      setNomeCliente(docSnap.data().nomeCliente);
      setEndereco(docSnap.data().endereco);
      setBairro(docSnap.data().bairro);
      setCidade(docSnap.data().cidade);
      setEstado(docSnap.data().estado);
      setEmail(docSnap.data().email);
      setCelular(docSnap.data().celular);
      setTelFixo(docSnap.data().telFixo);
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
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

  const handleEstadoChange = (event) => {
    setEstado(event.target.value);
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
          <Typography id="unstyled-modal-title" variant="h4" align="center">
            Cliente
          </Typography>
          <TextField
            label="Nome"
            margin="normal"
            required
            defaultValue={nomeCliente}
            fullWidth
            onChange={(e) => setNomeCliente(e.target.value)}
          />
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={2}
            mb={1}
            spacing={2}
          >
            <FormControl fullWidth sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Estado
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={estado}
                label="Estado"
                onChange={handleEstadoChange}
              >
                <MenuItem value="">
                  <em>Escolher</em>
                </MenuItem>
                <MenuItem value="AC">AC</MenuItem>
                <MenuItem value="AL">AL</MenuItem>
                <MenuItem value="AP">AP</MenuItem>
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="BA">BA</MenuItem>
                <MenuItem value="CE">CE</MenuItem>
                <MenuItem value="DF">DF</MenuItem>
                <MenuItem value="ES">ES</MenuItem>
                <MenuItem value="GO">GO</MenuItem>
                <MenuItem value="MA">MA</MenuItem>
                <MenuItem value="MT">MT</MenuItem>
                <MenuItem value="MS">MS</MenuItem>
                <MenuItem value="MG">MG</MenuItem>
                <MenuItem value="PA">PA</MenuItem>
                <MenuItem value="PB">PB</MenuItem>
                <MenuItem value="PR">PR</MenuItem>
                <MenuItem value="PE">PE</MenuItem>
                <MenuItem value="PI">PI</MenuItem>
                <MenuItem value="RJ">RJ</MenuItem>
                <MenuItem value="RN">RN</MenuItem>
                <MenuItem value="RS">RS</MenuItem>
                <MenuItem value="RO">RO</MenuItem>
                <MenuItem value="RR">RR</MenuItem>
                <MenuItem value="SC">SC</MenuItem>
                <MenuItem value="SP">SP</MenuItem>
                <MenuItem value="SE">SE</MenuItem>
                <MenuItem value="TO">TO</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Cidade"
              fullWidth
              defaultValue={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </Stack>
          <TextField
            label="Endereço"
            margin="normal"
            fullWidth
            defaultValue={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
          <TextField
            label="Bairro"
            margin="normal"
            fullWidth
            defaultValue={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
          <TextField
            label="Email"
            margin="normal"
            fullWidth
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={2}
            mb={3}
            spacing={2}
          >
            <TextField
              label="Celular"
              fullWidth
              defaultValue={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
            <TextField
              label="Telefone Fixo"
              fullWidth
              defaultValue={telFixo}
              onChange={(e) => setTelFixo(e.target.value)}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Button
              color="success"
              sx={{ width: "8rem" }}
              onClick={handleSubmit}
              variant="contained"
            >
              Salvar
            </Button>
            <Button
              sx={{ width: "8rem" }}
              onClick={handleClose}
              variant="contained"
              color="error"
            >
              Fechar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
