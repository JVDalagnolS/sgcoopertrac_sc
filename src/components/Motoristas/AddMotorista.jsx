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

const motoristaCollectionRef = collection(db, "motoristas");

export default function AddCliente({ id, setMotoristaId, open, setOpen }) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => [
    setOpen(false),
    setNome(""),
    setSobrenome(""),
    setApelido(""),
    setCelular(""),
    setMotoristaId(""),
  ];

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [apelido, setApelido] = useState("");
  const [celular, setCelular] = useState("");
  const nomeCompleto = nome + " " + sobrenome;

  const handleSubmit = async () => {
    if (!nome || !sobrenome) {
      return enqueueSnackbar("Nome completo é necessário!", {
        variant: "warning",
        autoHideDuration: 3000,
      });
    }
    const newMotorista = {
      nome,
      sobrenome,
      nomeCompleto,
      apelido,
      celular,
    };
    console.log(newMotorista);

    try {
      if (id !== undefined && id !== "") {
        const motoristaDoc = doc(motoristaCollectionRef, id);
        await updateDoc(motoristaDoc, newMotorista);
        setMotoristaId("");
        console.log("Motorista atualizado com sucesso!");
        enqueueSnackbar("Motorista atualizado com sucesso!", {
          variant: "success",
          autoHideDuration: 3000,
        });
      } else {
        await addDoc(motoristaCollectionRef, newMotorista);
        console.log("Motorista adicionado com sucesso!");
        enqueueSnackbar("Motorista adicionado com sucesso!", {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }

    setNome("");
    setSobrenome("");
    setApelido("");
    setCelular("");
    handleClose();
  };

  const editHandler = async () => {
    try {
      const docRef = doc(db, "motoristas", id);
      const docSnap = await getDoc(docRef);
      console.log("the record is :", docSnap.data());
      setNome(docSnap.data().nome);
      setSobrenome(docSnap.data().sobrenome);
      setApelido(docSnap.data().apelido);
      setCelular(docSnap.data().celular);
    } catch (err) {
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
          <Typography id="unstyled-modal-title" variant="h4" align="center">
            Motorista
          </Typography>
          <TextField
            label="Nome"
            margin="normal"
            required
            fullWidth
            defaultValue={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            label="Sobrenome"
            margin="normal"
            required
            fullWidth
            defaultValue={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
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
              label="Apelido"
              fullWidth
              defaultValue={apelido}
              onChange={(e) => setApelido(e.target.value)}
            />
            <TextField
              label="Celular"
              fullWidth
              defaultValue={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Button
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
