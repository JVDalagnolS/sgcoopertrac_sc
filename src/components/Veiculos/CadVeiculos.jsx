import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import * as React from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config"
import DeleteIcon from "@mui/icons-material/Delete";
import AddVeiculo from "./AddVeiculo";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from 'notistack'

function CadVeiculo() {
  const [veiculos, setVeiculos] = useState([]);
  const [veiculoId, setVeiculoId] = useState("");
  const veiculosCollectionRef = collection(db, 'veiculos');
  const [deleteId, setDeleteId] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const { enqueueSnackbar } = useSnackbar()

  function getFullMarca(params) {
    return `${params.row.marca || ''} ${params.row.modelo || ''}`;
  }

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeleteId("");
  };

  const deleteHandler = async () => {
    const veiculoDoc = doc(db, "veiculos", deleteId);
    await deleteDoc(veiculoDoc);
    enqueueSnackbar('Veiculo deletado com sucesso!', {variant: 'success', autoHideDuration: 3000});
    handleDeleteDialogClose();
  };

  const columns = [
    { field: "placa", headerName: "Placa", width: 150 },
    { field: "tipo", headerName: "Tipo", width: 150 },
    { field: "marca", headerName: "Marca", width: 1 },
    { field: "modelo", headerName: "Modelo", width: 1 },
    { field: "marcaModelo", headerName: "Marca / Modelo", width: 200, valueGetter: getFullMarca, },
    { field: "rastreador", headerName: "Rastreador", width: 200 },
    { field: "idRastreador", headerName: "ID / MCT", width: 200 },
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
            onClick={(e) => [
              setVeiculoId(cellValues.id),
              console.log(veiculoId),
            ]}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    const unsub = onSnapshot(veiculosCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      console.log(items);
      setVeiculos(items);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, []);
  
  function CustomToolbar() {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={6}
        pt={2}
      >
        <GridToolbarQuickFilter style={{ width: 600 }} />
        <Button type="button" variant="contained" onClick={handleAddOpen}>
          Adicionar
        </Button>
      </Stack>
    );
  }


  return (
    <>
      <AddVeiculo
        open={addOpen}
        setOpen={setAddOpen}
        id={veiculoId}
        setVeiculoId={setVeiculoId}
      />
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
            {"Tem certeza que deseja excluir esse cadastro?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteHandler}>Confirmar exclusão</Button>
          <Button onClick={handleDeleteDialogClose} autoFocus>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <Typography
        textAlign="center"
        my={3}
        variant="h4"
      >
        Veículos e complementos
      </Typography>
      <div style={{ height: 700, width: "96%" , marginLeft: "auto", marginRight: "auto"}}>
        <DataGrid
          disableColumnMenu={true}
          disableSelectionOnClick
          rows={veiculos}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              densitySelectorProps: { ariaLabel: "Densidade" },
            },
          }}
          columnVisibilityModel={{
            marca: false,
            modelo: false,
          }}
        />
      </div>
    </>
  );
}

export default CadVeiculo;
