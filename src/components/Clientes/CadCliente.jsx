import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCliente from "./AddCliente";
import EditIcon from "@mui/icons-material/Edit";
import * as React from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { useSnackbar } from "notistack";

function CadCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const clienteCollectionRef = collection(db, "clientes");
  const [deleteId, setDeleteId] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const { enqueueSnackbar } = useSnackbar();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeleteId("");
  };

  const deleteHandler = async () => {
    const clienteDoc = doc(db, "clientes", deleteId);
    await deleteDoc(clienteDoc);
    enqueueSnackbar("Cliente deletado com sucesso!", {
      variant: "success",
      autoHideDuration: 3000,
    });
    handleDeleteDialogClose();
  };

  const columns = [
    { field: "nomeCliente", headerName: "Nome", width: 350 },
    { field: "endereco", headerName: "Endereço", width: 250 },
    { field: "cidade", headerName: "Cidade", width: 150 },
    { field: "estado", headerName: "UF", width: 50 },
    { field: "email", headerName: "Email", width: 250 },
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
            onClick={(e) => [
              setDeleteId(cellValues.id),
              handleDeleteDialogOpen(),
            ]}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            aria-label="Editar"
            color="primary"
            onClick={(e) => [
              setClienteId(cellValues.id),
              console.log(clienteId),
            ]}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    const unsub = onSnapshot(clienteCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      console.log(items);
      setClientes(items);
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
        <Button
          color="success"
          type="button"
          variant="contained"
          onClick={handleAddOpen}
        >
          Adicionar
        </Button>
      </Stack>
    );
  }

  return (
    <div className="App">
      <AddCliente
        open={addOpen}
        setOpen={setAddOpen}
        id={clienteId}
        setClienteId={setClienteId}
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
          <Button onClick={handleDeleteDialogClose} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Typography textAlign="center" my={3} variant="h4">
        Clientes
      </Typography>
      <div
        style={{
          height: 700,
          width: "96%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <DataGrid
          disableColumnMenu={true}
          disableSelectionOnClick
          rows={clientes}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              densitySelectorProps: { ariaLabel: "Densidade" },
            },
          }}
        />
      </div>
    </div>
  );
}

export default CadCliente;
