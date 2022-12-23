import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import { NumericFormat } from "react-number-format";
//import AddCliente from "../Clientes/AddCliente";

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
  width: 740,
  height: 600,
  bgcolor: theme.palette.mode === "dark" ? "#0A1929" : "white",
  borderRadius: "6px",
  padding: "16px 32px 24px 32px",
  overflow: "scroll",
});

const pgrCollectionRef = collection(db, "pgrDiaria");

export default function PgrAddModal({ id, setPgrId, filterDate }) {
  const { enqueueSnackbar } = useSnackbar();
  const [pgrAddOpen, setPgrAddOpen] = useState(false);
  const handlePgrAddOpen = () => [setPgrAddOpen(true)];
  const handlePgrAddClose = () => [
    setPgrAddOpen(false),
    setPgrId(""),
    setStatus("Agendado"),
    setClienteOrigem(""),
    setClienteDestino(""),
    //setClienteId(""),
    setCidadeOrigem(""),
    setEstadoOrigem(""),
    setCidadeDestino(""),
    setEstadoDestino(""),
    setClientePagador(""),
    setMotorista(""),
    setVeiculo(""),
    setComplemento1(""),
    setComplemento2(""),
    setComplemento3(""),
    setDescricao(""),
    setCombinado(""),
    setAdiantamento(""),
    setAdiantamentoFeito(false),
    setPedagio(""),
    setConsulta(""),
    setCooperado(""),
    setRastreador(""),
    setEspelhado(false),
    setChecklist(""),
    setSm(""),
    setPrevisaoChegada(null),
    setFimViagem(null),
  ];
  let now = dayjs().format("MM DD YYYY");
  const [status, setStatus] = useState("Agendado");
  const [clienteOrigem, setClienteOrigem] = useState("");
  const [clienteDestino, setClienteDestino] = useState("");
  //const [clienteId, setClienteId] = useState("");
  const [cidadeOrigem, setCidadeOrigem] = useState("");
  const [estadoOrigem, setEstadoOrigem] = useState("");
  const [cidadeDestino, setCidadeDestino] = useState("");
  const [estadoDestino, setEstadoDestino] = useState("");
  const [clientePagador, setClientePagador] = useState("");
  const [motorista, setMotorista] = useState("");
  const [veiculos, setVeiculos] = useState([]);
  const [complementos, setComplementos] = useState([]);
  const [veiculo, setVeiculo] = useState("");
  const [complemento1, setComplemento1] = useState("");
  const [complemento2, setComplemento2] = useState("");
  const [complemento3, setComplemento3] = useState("");
  const [descricao, setDescricao] = useState("");
  const [combinado, setCombinado] = useState("");
  const [adiantamento, setAdiantamento] = useState("");
  const [adiantamentoFeito, setAdiantamentoFeito] = useState(false);
  const [pedagio, setPedagio] = useState("");
  const [consulta, setConsulta] = useState("");
  const [cooperado, setCooperado] = useState("");
  const [rastreador, setRastreador] = useState("");
  const [espelhado, setEspelhado] = useState(false);
  const [checklist, setChecklist] = useState("");
  const [sm, setSm] = useState("");
  const [previsaoChegada, setPrevisaoChegada] = useState(null);
  const [fimViagem, setFimViagem] = useState(null);
  const [date, setDate] = useState(filterDate);

  const handleSubmit = async () => {
    const novaProgramacao = {
      status,
      clienteOrigem,
      clienteDestino,
      cidadeOrigem,
      estadoOrigem,
      cidadeDestino,
      estadoDestino,
      clientePagador,
      motorista,
      veiculo,
      complemento1,
      complemento2,
      complemento3,
      descricao,
      combinado,
      adiantamento,
      adiantamentoFeito,
      pedagio,
      consulta,
      cooperado,
      rastreador,
      espelhado,
      checklist,
      sm,
      previsaoChegada,
      fimViagem,
      date,
    };
    console.log(novaProgramacao);

    try {
      if (id !== undefined && id !== "") {
        const pgrDoc = doc(pgrCollectionRef, id);
        await updateDoc(pgrDoc, novaProgramacao);
        setPgrId("");
        enqueueSnackbar("Programação atualizada com sucesso!", {
          variant: "success",
          autoHideDuration: 3000,
        });
      } else {
        await addDoc(pgrCollectionRef, novaProgramacao);
        enqueueSnackbar("Programação adicionado com sucesso!", {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }

    setClienteOrigem("");
    setClienteDestino("");
    //setClienteId("");
    setCidadeOrigem("");
    setEstadoOrigem("");
    setCidadeDestino("");
    setEstadoDestino("");
    setClientePagador("");
    setMotorista("");
    setVeiculo("");
    setComplemento1("");
    setComplemento2("");
    setComplemento3("");
    setDescricao("");
    setCombinado("");
    setAdiantamento("");
    setAdiantamentoFeito(false);
    setPedagio("");
    setConsulta("");
    setCooperado("");
    setRastreador("");
    setEspelhado(false);
    setChecklist("");
    setSm("");
    setPrevisaoChegada(null);
    setFimViagem(null);
    setStatus("Agendado");
    setDate(now);
    handlePgrAddClose();
  };

  const editHandler = async () => {
    try {
      const docRef = doc(db, "pgrDiaria", id);
      const docSnap = await getDoc(docRef);
      console.log("the record is :", docSnap.data());
      setClienteOrigem(docSnap.data().clienteOrigem);
      setClienteDestino(docSnap.data().clienteDestino);
      setCidadeOrigem(docSnap.data().cidadeOrigem);
      setEstadoOrigem(docSnap.data().estadoOrigem);
      setCidadeDestino(docSnap.data().cidadeDestino);
      setEstadoDestino(docSnap.data().estadoDestino);
      setClientePagador(docSnap.data().clientePagador);
      setMotorista(docSnap.data().motorista);
      setVeiculo(docSnap.data().veiculo);
      setComplemento1(docSnap.data().complemento1);
      setComplemento2(docSnap.data().complemento2);
      setComplemento3(docSnap.data().complemento3);
      setDescricao(docSnap.data().descricao);
      setCombinado(docSnap.data().combinado);
      setAdiantamento(docSnap.data().adiantamento);
      setAdiantamentoFeito(docSnap.data().adiantamentoFeito);
      setPedagio(docSnap.data().pedagio);
      setConsulta(docSnap.data().consulta);
      setCooperado(docSnap.data().cooperado);
      setRastreador(docSnap.data().rastreador);
      setEspelhado(docSnap.data().espelhado);
      setChecklist(docSnap.data().checklist);
      setSm(docSnap.data().sm);
      setPrevisaoChegada(docSnap.data().previsaoChegada);
      setFimViagem(docSnap.data().fimViagem);
      setDate(docSnap.data().date);
      setStatus(docSnap.data().status);
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
    handlePgrAddOpen(true);
  };

  useEffect(() => {
    console.log("The id here is : ", id);
    if (id !== undefined && id !== "") {
      editHandler();
    }
    // eslint-disable-next-line
  }, [id]);

  const [clientes, setClientes] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "clientes"), (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setClientes(items);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, []);
  // const [addClienteModalOpen, setAddClienteModalOpen] = useState(false);
  // const handleAddClienteModalOpen = () => setAddClienteModalOpen(true);

  const [motoristas, setMotoristas] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "motoristas"), (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setMotoristas(items);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "veiculos"),
      where("tipo", "in", [
        "Cavalo",
        "Truck",
        "Bitruck",
        "Van",
        "Toco",
        "Outro",
      ]) // does not need index
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setVeiculos(items);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "veiculos"),
      where("tipo", "in", ["Carreta", "Central", "Dolly", "Outro"]) // does not need index
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setComplementos(items);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"pt-br"}>
        <Button variant="contained" color="success" onClick={handlePgrAddOpen}>
          Adicionar
        </Button>
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={pgrAddOpen}
          onClose={handlePgrAddClose}
          slots={{ backdrop: Backdrop }}
        >
          <Box sx={style}>
            {/* <AddCliente
              open={addClienteModalOpen}
              setOpen={setAddClienteModalOpen}
              id={""}
              ienteId={""}
            /> */}
            <Typography id="unstyled-modal-title" variant="h4" align="center">
              Carregamento
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={2}
              mb={1}
              spacing={48.5}
            >
              <DatePicker
                label="Dia do carregamento"
                value={date}
                onChange={(datePick) => {
                  const newDate = datePick.format("MM DD YYYY");
                  setDate(newDate);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel id="select-helper-label">Status</InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="select-helper-label"
                  id="select-helper"
                  value={status}
                  label="Status"
                  onChange={(statusPick) => {
                    setStatus(statusPick.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Escolher</em>
                  </MenuItem>
                  <MenuItem value="Agendado">Agendado</MenuItem>
                  <MenuItem value="Feito">Feito</MenuItem>
                  <MenuItem value="Prorrogado">Prorrogado</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Divider sx={{ marginTop: 2 }}>
              <Typography>Básicos</Typography>
            </Divider>

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={2}
              mb={1}
              spacing={0}
            >
              <Autocomplete
                inputValue={clienteOrigem}
                onInputChange={(event, newInputValue) => {
                  console.log(newInputValue);
                }}
                disablePortal
                options={clientes}
                defaultValue={{ nomeCliente: clienteOrigem }}
                getOptionLabel={(option) => option.nomeCliente}
                isOptionEqualToValue={(option, value) =>
                  option.nomeCliente === value.nomeCliente
                }
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Cliente Origem" />
                )}
                onChange={(e, nv) => {
                  setClienteOrigem(nv.nomeCliente);
                  setCidadeOrigem(nv.cidade);
                  setEstadoOrigem(nv.estado);
                  //setClienteId(nv.id)
                }}
              />
              {/* {clienteOrigem
                    ? <Button
                      sx={{
                        width: 110,
                        height: 60,
                      }}
                      color="success"
                      onClick={handleAddClienteModalOpen}
                    >
                      Editar 
                    </Button>
                  : <Button
                      sx={{
                        width: 110,
                        height: 60,
                      }}
                      color="success"
                      onClick={handleAddClienteModalOpen}
                    >
                      Adicionar Novo
                    </Button>
                  } */}
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={2}
              mb={1}
              spacing={0}
            >
              <Autocomplete
                inputValue={clienteDestino}
                onInputChange={(event, newInputValue) => {
                  console.log(newInputValue);
                }}
                disablePortal
                defaultValue={{ nomeCliente: clienteDestino }}
                options={clientes}
                getOptionLabel={(option) => option.nomeCliente}
                isOptionEqualToValue={(option, value) =>
                  option.nomeCliente === value.nomeCliente
                }
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Cliente Destino" />
                )}
                onChange={(e, nv) => {
                  setClienteDestino(nv.nomeCliente);
                  setCidadeDestino(nv.cidade);
                  setEstadoDestino(nv.estado);
                }}
              />
              {/* <Button
                    color="success"
                    onClick={handleAddClienteModalOpen}
                  >
                    Adicionar Novo
                  </Button> */}
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
                label="Cidade Origem"
                fullWidth
                value={cidadeOrigem}
                inputProps={{ readOnly: true }}
              />
              <TextField
                label="Cidade Destino"
                fullWidth
                value={cidadeDestino}
                inputProps={{ readOnly: true }}
              />
              <FormControl fullWidth>
                <InputLabel id="clientePagador-label">
                  Cliente pagador do frete:{" "}
                </InputLabel>
                <Select
                  labelId="clientePagador-label"
                  id="select-helper"
                  value={clientePagador}
                  label="Cliente pagador do frete: "
                  onChange={(valuePick) => {
                    setClientePagador(valuePick.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Escolher</em>
                  </MenuItem>
                  <MenuItem value={clienteOrigem}>Cliente Origem</MenuItem>
                  <MenuItem value={clienteDestino}>Cliente Destino</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Autocomplete
              inputValue={motorista}
              onInputChange={(event, newInputValue) => {
                console.log(newInputValue);
              }}
              disablePortal
              defaultValue={{ nomeCompleto: motorista }}
              options={motoristas}
              getOptionLabel={(option) => option.nomeCompleto}
              isOptionEqualToValue={(option, value) =>
                option.nomeCompleto === value.nomeCompleto
              }
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Motorista" />
              )}
              onChange={(e, nv) => {
                setMotorista(nv.nomeCompleto);
              }}
            />
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={2}
              mb={3}
              spacing={2}
            >
              <Autocomplete
                inputValue={veiculo}
                onInputChange={(event, newInputValue) => {
                  console.log(newInputValue);
                }}
                disablePortal
                defaultValue={{ placa: veiculo }}
                options={veiculos}
                getOptionLabel={(option) => option.placa}
                isOptionEqualToValue={(option, value) =>
                  option.placa === value.placa
                }
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Veículo" />
                )}
                onChange={(e, nv) => {
                  setVeiculo(nv.placa);
                  setRastreador(nv.rastreador);
                }}
              />
              <Autocomplete
                inputValue={complemento1}
                onInputChange={(event, newInputValue) => {
                  console.log(newInputValue);
                }}
                disablePortal
                defaultValue={{ placa: complemento1 }}
                options={complementos}
                getOptionLabel={(option) => option.placa}
                isOptionEqualToValue={(option, value) =>
                  option.placa === value.placa
                }
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Complemento 1" />
                )}
                onChange={(e, nv) => {
                  setComplemento1(nv.placa);
                }}
              />
              <Autocomplete
                inputValue={complemento2}
                onInputChange={(event, newInputValue) => {
                  console.log(newInputValue);
                }}
                disablePortal
                defaultValue={{ placa: complemento2 }}
                options={complementos}
                getOptionLabel={(option) => option.placa}
                isOptionEqualToValue={(option, value) =>
                  option.placa === value.placa
                }
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Complemento 2" />
                )}
                onChange={(e, nv) => {
                  setComplemento2(nv.placa);
                }}
              />
              <Autocomplete
                inputValue={complemento3}
                onInputChange={(event, newInputValue) => {
                  console.log(newInputValue);
                }}
                disablePortal
                defaultValue={{ placa: complemento3 }}
                options={complementos}
                getOptionLabel={(option) => option.placa}
                isOptionEqualToValue={(option, value) =>
                  option.placa === value.placa
                }
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Complemento 3" />
                )}
                onChange={(e, nv) => {
                  setComplemento3(nv.placa);
                }}
              />
            </Stack>
            <Divider sx={{ marginTop: 2 }}>
              <Typography>Extras</Typography>
            </Divider>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={3}
              mb={1}
              spacing={2}
            >
              <NumericFormat
                label="Combinado"
                fullWidth
                defaultValue={combinado}
                onChange={(e) => setCombinado(e.target.value)}
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale
                decimalSeparator=","
                prefix={"R$"}
                thousandsGroupStyle="thousand"
                thousandSeparator="."
              />
              <NumericFormat
                label="Adiantamento"
                fullWidth
                defaultValue={adiantamento}
                onChange={(e) => setAdiantamento(e.target.value)}
                customInput={TextField}
                decimalScale={2}
                fixedDecimalScale
                decimalSeparator=","
                prefix={"R$"}
                thousandsGroupStyle="thousand"
                thousandSeparator="."
              />
              <FormControlLabel
                sx={{ width: "100%", justifyContent: "center" }}
                control={
                  <Checkbox
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    checked={adiantamentoFeito}
                    onChange={(e) => setAdiantamentoFeito(e.target.checked)}
                  />
                }
                label="Adiantamento feito"
                labelPlacement="start"
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={2}
              mb={1}
              spacing={2}
            >
              <FormControl fullWidth>
                <InputLabel id="pedagio-label">Pedágio</InputLabel>
                <Select
                  labelId="pedagio-label"
                  id="select-helper"
                  value={pedagio}
                  label="Pedágio"
                  onChange={(valuePick) => {
                    setPedagio(valuePick.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Escolher</em>
                  </MenuItem>
                  <MenuItem value="Via Fácil">Via Fácil</MenuItem>
                  <MenuItem value="Target">Target</MenuItem>
                  <MenuItem value="Cartão">Cartão</MenuItem>
                  <MenuItem value="Novo Cartão">Novo Cartão</MenuItem>
                  <MenuItem value="Outros">Outros</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="consulta-label">Consulta</InputLabel>
                <Select
                  labelId="consulta-label"
                  id="select-helper"
                  value={consulta}
                  label="Consulta"
                  onChange={(valuePick) => {
                    setConsulta(valuePick.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Escolher</em>
                  </MenuItem>
                  <MenuItem value="Buonny Consulta">Buonny Consulta</MenuItem>
                  <MenuItem value="Buonny Cadastro">Buonny Cadastro</MenuItem>
                  <MenuItem value="Raster Consulta">Raster Consulta</MenuItem>
                  <MenuItem value="Raster Pesquisa">Raster Pesquisa</MenuItem>
                  <MenuItem value="Apisul">Apisul</MenuItem>
                  <MenuItem value="Merc. < 10mil">{"Merc. < 10mil"}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="cooperado-label">Cooperado</InputLabel>
                <Select
                  labelId="cooperado-label"
                  id="select-helper"
                  value={cooperado}
                  label="Cooperado"
                  onChange={(valuePick) => {
                    setCooperado(valuePick.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Escolher</em>
                  </MenuItem>
                  <MenuItem value="Sim">Sim</MenuItem>
                  <MenuItem value="Não">Não</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <TextField
              label="Descrição"
              fullWidth
              multiline
              margin="normal"
              rows={7}
              defaultValue={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            <Divider sx={{ marginTop: 2 }}>
              <Typography>Rastreamento</Typography>
            </Divider>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={3}
              mb={1}
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
                    setRastreador(valuePick.target.value);
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
              <FormControlLabel
                sx={{ width: "100%", justifyContent: "center" }}
                control={
                  <Checkbox
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    checked={espelhado}
                    onChange={(e) => setEspelhado(e.target.checked)}
                  />
                }
                label="Espelhado"
                labelPlacement="start"
              />
              <FormControl fullWidth>
                <InputLabel id="checklist-label">Checklist</InputLabel>
                <Select
                  labelId="checklist-label"
                  id="select-helper"
                  value={checklist}
                  label="Checklist"
                  onChange={(valuePick) => {
                    setChecklist(valuePick.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>Escolher</em>
                  </MenuItem>
                  <MenuItem value="Novo Checklist">Novo Checklist</MenuItem>
                  <MenuItem value="Checklist ainda válido">
                    Checklist ainda válido
                  </MenuItem>
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
                label="SM"
                fullWidth
                defaultValue={sm}
                onChange={(e) => setSm(e.target.value)}
              />
              <DatePicker
                label="Previsão de chegada"
                value={previsaoChegada}
                onChange={(datePick) => {
                  const newDate = datePick.format("MM DD YYYY");
                  setPrevisaoChegada(newDate);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
              <DatePicker
                label="Fim de viagem"
                value={fimViagem}
                onChange={(datePick) => {
                  const newDate = datePick.format("MM DD YYYY");
                  setFimViagem(newDate);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Stack>
            <Stack mt={2} direction="row" justifyContent="space-between">
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
                onClick={handlePgrAddClose}
                variant="contained"
                color="error"
              >
                Fechar
              </Button>
            </Stack>
          </Box>
        </Modal>
      </LocalizationProvider>
    </div>
  );
}
