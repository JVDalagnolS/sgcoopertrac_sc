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
import EditIcon from "@mui/icons-material/Edit";
import * as React from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import AddMotorista from "./AddMotorista";
import { useSnackbar } from "notistack";

function CadMotorista() {
  const [motoristas, setMotoristas] = useState([]);
  const [motoristaId, setMotoristaId] = useState("");
  const motoristaCollectionRef = collection(db, "motoristas");
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
    const motoristaDoc = doc(db, "motoristas", deleteId);
    await deleteDoc(motoristaDoc);
    enqueueSnackbar("Motorista deletado com sucesso!", {
      variant: "success",
      autoHideDuration: 3000,
    });
    handleDeleteDialogClose();
  };

  const columns = [
    {
      field: "nomeCompleto",
      headerName: "Nome",
      width: 450,
    },
    {
      field: "apelido",
      headerName: "Apelido",
      width: 250,
    },
    {
      field: "celular",
      headerName: "Celular",
      width: 150,
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
            onClick={(e) => [
              setMotoristaId(cellValues.id),
              //console.log(motoristaId),
            ]}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    const unsub = onSnapshot(motoristaCollectionRef, (querySnapshot) => {
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
      <AddMotorista
        open={addOpen}
        setOpen={setAddOpen}
        id={motoristaId}
        setMotoristaId={setMotoristaId}
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
        Motoristas
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
          rows={motoristas}
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
    </>
  );
}

export default CadMotorista;
