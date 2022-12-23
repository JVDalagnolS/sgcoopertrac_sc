import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import * as React from "react";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import PgrAddModal from "./PgrAddModal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import PopupState from "material-ui-popup-state";
import { bindPopover, bindTrigger } from "material-ui-popup-state/core";

export default function PgrDiaria() {
  const [pgrs, setPgrs] = useState([]);
  const [pgrId, setPgrId] = useState("");
  const pgrCollectionRef = collection(db, "pgrDiaria");
  const { enqueueSnackbar } = useSnackbar();
  const [sm, setSm] = useState("");
  const [smId, setSmId] = useState("");
  const [deleteId, setDeleteId] = useState("");

  let now = dayjs().format("MM DD YYYY");
  const [dateFilter, setDateFilter] = useState(now);

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[3],
      fontSize: 14,
    },
  }));

  useEffect(() => {
    const q = query(
      pgrCollectionRef,
      where("date", "==", dateFilter) // does not need index
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      //const unsub = onSnapshot(testeCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setPgrs(items);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, [dateFilter]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeleteId("");
  };

  const deleteHandler = async () => {
    const pgrDoc = doc(pgrCollectionRef, deleteId);
    await deleteDoc(pgrDoc);
    enqueueSnackbar("Programação excluída com sucesso!", {
      variant: "success",
      autoHideDuration: 3000,
    });
    handleDeleteDialogClose();
  };

  const handleStatusSave = async (status, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        status: status,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handlePedagioSave = async (pedagio, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        pedagio: pedagio,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handleConsultaSave = async (consulta, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        consulta: consulta,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handleCooperadoSave = async (cooperado, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        cooperado: cooperado,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handleADTSave = async (adtFeito, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        adiantamentoFeito: adtFeito,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handleRastreadorSave = async (ras, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        rastreador: ras,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handleEspelhamentoSave = async (esp, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        espelhado: esp,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handleChecklistSave = async (check, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        checklist: check,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handlePrevisaoChegadaSave = async (preche, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        previsaoChegada: preche,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handleFimViagemSave = async (fimvi, rowId) => {
    const pgrDoc = doc(pgrCollectionRef, rowId);
    try {
      await updateDoc(pgrDoc, {
        fimViagem: fimvi,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
  };

  const handleSmSave = async () => {
    const pgrDoc = doc(pgrCollectionRef, smId);
    try {
      await updateDoc(pgrDoc, {
        sm: sm,
      });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error", autoHideDuration: 5000 });
    }
    setSm("");
    setSmId("");
  };

  const columns = [
    {
      field: "status",
      headerName: "Status",
      width: 80,
      renderCell: (cellValues) => (
        <LightTooltip title={cellValues.value}>
          <FormControl fullWidth sx={{ minWidth: 60 }} size="small">
            <Select
              id="select-helper"
              value={cellValues.value}
              onChange={(statusPick) => {
                handleStatusSave(statusPick.target.value, cellValues.id);
              }}
            >
              <MenuItem value="">
                <em>Escolher</em>
              </MenuItem>
              <MenuItem value="Agendado">
                <FeedRoundedIcon />
                Agendado
              </MenuItem>
              <MenuItem value="Feito">
                <CheckRoundedIcon />
                Feito
              </MenuItem>
              <MenuItem value="Prorrogado">
                <AccessTimeRoundedIcon />
                Prorrogado
              </MenuItem>
              <MenuItem value="Cancelado">
                <CloseRoundedIcon />
                Cancelado
              </MenuItem>
            </Select>
          </FormControl>
        </LightTooltip>
      ),
    },
    {
      field: "clientePagador",
      headerName: "Cliente",
      width: 110,
      renderCell: (cellValues) => (
        <LightTooltip title={cellValues.row.clientePagador}>
          <Box
            sx={{ width: "100%", py: "10%", px: "1px", alignItens: "center" }}
          >
            {cellValues.row.clientePagador}
          </Box>
        </LightTooltip>
      ),
    },
    {
      field: "cidadeOrigem",
      headerName: "Origem",
      width: 120,
      renderCell: (cellValues) => (
        <LightTooltip
          title={
            cellValues.row.cidadeOrigem + " / " + cellValues.row.estadoOrigem
          }
        >
          <Box
            sx={{ width: "100%", py: "10%", px: "1px", alignItens: "center" }}
          >
            {cellValues.row.cidadeOrigem + " / " + cellValues.row.estadoOrigem}
          </Box>
        </LightTooltip>
      ),
    },
    {
      field: "cidadeDestino",
      headerName: "Destino",
      width: 120,
      renderCell: (cellValues) => (
        <LightTooltip
          title={
            cellValues.row.cidadeDestino + " / " + cellValues.row.estadoDestino
          }
        >
          <Box
            sx={{ width: "100%", py: "10%", px: "1px", alignItens: "center" }}
          >
            {cellValues.row.cidadeDestino +
              " / " +
              cellValues.row.estadoDestino}
          </Box>
        </LightTooltip>
      ),
    },
    {
      field: "motoristaeplacas",
      headerName: "Motorista & Placa(s)",
      width: 180,
      renderCell: (cellValues) => (
        <LightTooltip
          title={
            <>
              {"Motorista: " + cellValues.row.motorista}
              <br />
              {"Cavalo: " + cellValues.row.veiculo}
              <br />
              {"Carreta 1: " + cellValues.row.complemento1}
              <br />
              {"Carreta 2: " + cellValues.row.complemento2}
              <br />
              {"Carreta 3: " + cellValues.row.complemento3}
              <br />
            </>
          }
        >
          <Box
            sx={{ width: "100%", py: "10%", px: "1px", alignItens: "center" }}
          >
            {cellValues.row.motorista}
          </Box>
        </LightTooltip>
      ),
    },
    {
      field: "combinado",
      headerName: "Combinado / ADT.",
      width: 140,
      renderCell: (cellValues) => (
        <>
          <PopupState variant="popover" popupId="adt-popover">
            {(popupState) => (
              <Box sx={{ width: 130 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <div sx={{ width: "100%" }}>{cellValues.row.combinado}</div>
                  <Button
                    variant="contained"
                    {...bindTrigger(popupState)}
                    sx={{ minWidth: 32, px: 1 }}
                  >
                    ADT.
                  </Button>
                </Stack>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    Adiantamento:{" "}
                    {cellValues.row.adiantamento
                      ? cellValues.row.adiantamento
                      : "Sem adiantamento"}
                  </Typography>
                  <FormControlLabel
                    sx={{ width: "100%", justifyContent: "center", mx: 1 }}
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        checked={cellValues.row.adiantamentoFeito}
                        onChange={(statusPick) => {
                          handleADTSave(
                            statusPick.target.checked,
                            cellValues.id
                          );
                        }}
                      />
                    }
                    label="Adiantamento feito: "
                    labelPlacement="start"
                  />
                </Popover>
              </Box>
            )}
          </PopupState>
        </>
      ),
    },
    {
      field: "descricao",
      headerName: "Descrição",
      width: 100,
      renderCell: (cellValues) => (
        <>
          <PopupState variant="popover" popupId="desc-popover">
            {(popupState) => (
              <Box sx={{ width: 100 }}>
                <Button
                  variant="contained"
                  {...bindTrigger(popupState)}
                  sx={{ minWidth: 42, px: 1, m: "auto" }}
                >
                  Descrição
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <TextField
                    sx={{
                      width: 260,
                      m: 2,
                    }}
                    label="Descrição"
                    multiline
                    rows={7}
                    defaultValue={cellValues.row.descricao}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Popover>
              </Box>
            )}
          </PopupState>
        </>
      ),
    },
    {
      field: "pedagio",
      headerName: "Pedágio",
      width: 110,
      renderCell: (cellValues) => (
        <LightTooltip title={cellValues.value}>
          <FormControl fullWidth size="small">
            <Select
              id="select-helper"
              value={cellValues.value}
              onChange={(valuePick) => {
                handlePedagioSave(valuePick.target.value, cellValues.id);
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
        </LightTooltip>
      ),
    },
    {
      field: "consulta",
      headerName: "Consulta",
      width: 110,
      renderCell: (cellValues) => (
        <LightTooltip title={cellValues.value}>
          <FormControl fullWidth size="small">
            <Select
              id="select-helper"
              value={cellValues.value}
              onChange={(valuePick) => {
                handleConsultaSave(valuePick.target.value, cellValues.id);
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
        </LightTooltip>
      ),
    },
    {
      field: "cooperado",
      headerName: "Cooperado",
      width: 80,
      renderCell: (cellValues) => (
        <LightTooltip title={cellValues.value}>
          <FormControl fullWidth size="small">
            <Select
              id="select-helper"
              value={cellValues.value}
              onChange={(valuePick) => {
                handleCooperadoSave(valuePick.target.value, cellValues.id);
              }}
            >
              <MenuItem value="">
                <em>Escolher</em>
              </MenuItem>
              <MenuItem value="Sim">Sim</MenuItem>
              <MenuItem value="Não">Não</MenuItem>
            </Select>
          </FormControl>
        </LightTooltip>
      ),
    },
    {
      field: "rastreamento",
      headerName: "Rastreamento",
      width: 130,
      renderCell: (cellValues) => (
        <>
          <PopupState variant="popover" popupId="ras-popover">
            {(popupState) => (
              <div>
                <Button
                  variant="contained"
                  {...bindTrigger(popupState)}
                  sx={{ minWidth: 32, px: 1 }}
                >
                  Rastreamento
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Stack direction="column">
                    <FormControl
                      size="small"
                      sx={{
                        width: 220,
                        mx: 2,
                        mt: 2,
                        mb: 1,
                      }}
                    >
                      <InputLabel id="rastreador-label">Rastreador</InputLabel>
                      <Select
                        labelId="rastreador-label"
                        label="Rastreador"
                        value={cellValues.row.rastreador}
                        onChange={(valuePick) => {
                          handleRastreadorSave(
                            valuePick.target.value,
                            cellValues.id
                          );
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
                      sx={{
                        width: 220,
                        justifyContent: "space-between",
                        mx: 2,
                      }}
                      control={
                        <Checkbox
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 28 }, pr: 0 }}
                          checked={cellValues.row.espelhado}
                          onChange={(statusPick) => {
                            handleEspelhamentoSave(
                              statusPick.target.checked,
                              cellValues.id
                            );
                          }}
                        />
                      }
                      label="Espelhado: "
                      labelPlacement="start"
                    />
                    <FormControl
                      size="small"
                      sx={{
                        width: 220,
                        mx: 2,
                        mt: 1,
                      }}
                    >
                      <InputLabel id="checklist-label">Checklist</InputLabel>
                      <Select
                        labelId="checklist-label"
                        id="select-helper"
                        value={cellValues.row.checklist}
                        label="Checklist"
                        onChange={(valuePick) => {
                          handleChecklistSave(
                            valuePick.target.value,
                            cellValues.id
                          );
                        }}
                      >
                        <MenuItem value="">
                          <em>Escolher</em>
                        </MenuItem>
                        <MenuItem value="Novo Checklist">
                          Novo Checklist
                        </MenuItem>
                        <MenuItem value="Checklist ainda válido">
                          Checklist ainda válido
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="SM"
                      size="small"
                      sx={{
                        width: 220,
                        mx: 2,
                        mt: 1,
                      }}
                      defaultValue={cellValues.row.sm}
                      onChange={(e) => {
                        setSm(e.target.value);
                        setSmId(cellValues.id);
                      }}
                      onBlur={handleSmSave}
                    />
                    <DatePicker
                      label="Previsão de chegada"
                      value={cellValues.row.previsaoChegada}
                      onChange={(datePick) => {
                        const newDate = datePick.format("MM DD YYYY");
                        handlePrevisaoChegadaSave(newDate, cellValues.id);
                        console.log(cellValues.row.previsaoChegada);
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          sx={{
                            width: 220,
                            mx: 2,
                            mt: 1,
                          }}
                          {...params}
                        />
                      )}
                    />
                    <DatePicker
                      label="Fim de viagem"
                      value={cellValues.row.fimViagem}
                      onChange={(datePick) => {
                        const newDate = datePick.format("MM DD YYYY");
                        handleFimViagemSave(newDate, cellValues.id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          sx={{
                            width: 220,
                            mx: 2,
                            mt: 1,
                            mb: 2,
                          }}
                          {...params}
                        />
                      )}
                    />
                  </Stack>
                </Popover>
              </div>
            )}
          </PopupState>
        </>
      ),
    },
    {
      field: "action",
      headerName: "",
      renderCell: (cellValues) => (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <IconButton
            aria-label="Excluir"
            color="error"
            onClick={() => {
              setDeleteId(cellValues.id);
              handleDeleteDialogOpen();
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            aria-label="Editar"
            color="primary"
            onClick={(e) => [setPgrId(cellValues.id)]}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  function CustomToolbar() {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={6}
        pt={2}
      >
        <Stack direction="column" spacing={0}>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
        </Stack>
        <DatePicker
          label="Filtro data"
          value={dateFilter}
          onChange={(newDateFilter) => {
            setDateFilter(newDateFilter.format("MM DD YYYY"));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <GridToolbarQuickFilter style={{ width: 450 }} />
        <PgrAddModal id={pgrId} setPgrId={setPgrId} filterDate={dateFilter} />
      </Stack>
    );
  }

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"pt-br"}>
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            A ação de excluir é irreversível!
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {"Tem certeza que deseja excluir essa programação?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={deleteHandler}>Confirmar exclusão</Button>
            <Button onClick={handleDeleteDialogClose} autoFocus>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          sx={{
            height: 700,
            width: "96%",
            marginTop: 4,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Typography textAlign="center" my={3} variant="h4">
            Programação Diária
          </Typography>
          <DataGrid
            disableColumnMenu={false}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeader": {
                padding: "0px 5px",
              },
              "& .MuiDataGrid-cell": {
                padding: "0px 1px",
              },
            }}
            rows={pgrs}
            columns={columns}
            localeText={{
              toolbarColumns: "Colunas",
              toolbarFilters: "Filtros",
              toolbarDensity: "Densidade",
              toolbarExport: "Exportar",
            }}
            components={{ Toolbar: CustomToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                densitySelectorProps: { ariaLabel: "Densidade" },
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </div>
  );
}
