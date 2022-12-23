import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import * as React from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import AddUsuarios from "./AddUsuarios";


function CadUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const usuariosCollectionRef = collection(db, "usuarios");
  const [deleteId, setDeleteId] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const { enqueueSnackbar } = useSnackbar()

  //check if user is admin:
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "usuarios"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      if (data.isAdmin === false) return navigate("/dashboard/programacaodiaria");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserName();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);
  //end of user admin check.


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
    enqueueSnackbar("Cliente deletado com sucesso!", {variant: "success", autoHideDuration: 3000,});
    handleDeleteDialogClose();
  };

  useEffect(() => {
    const unsub = onSnapshot(usuariosCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      console.log(items);
      setUsuarios(items);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, []);

  const adminMessage = (adminValue) => {
    if (adminValue === true) {
      return "Sim";
    } else if (adminValue === false) {
      return "Não";
    }
  }

  const columns = [
    { field: "nomeCompleto", headerName: "Nome", width: 300 },
    { field: "email", headerName: "Email", width: 300 },
    { 
      field: "isAdmin", 
      headerName: "Administrador", 
      width: 150,
      renderCell: (cellValues) => (
        <>{adminMessage(cellValues.row.isAdmin)}</>
      )
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
        <Button color="success" type="button" variant="contained" onClick={handleAddOpen}>
          Adicionar
        </Button>
      </Stack>
    );
  }

  return (
    <div className="App">
      <AddUsuarios 
        open={addOpen}
        setOpen={setAddOpen}
        // id={usuarioId}
        // setUsuarioId={setUsuarioId}
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
          <Button color="error" onClick={deleteHandler}>Confirmar exclusão</Button>
          <Button onClick={handleDeleteDialogClose} autoFocus>Cancelar</Button>
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
          rows={usuarios}
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

export default CadUsuarios;
