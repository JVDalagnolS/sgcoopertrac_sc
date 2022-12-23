import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NavButton from '../common/NavButton';
import NavMenu from '../common/NavMenu';
import { Tooltip } from '@mui/material';
import UserMenu from '../common/UserMenu';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '../firebase-config';
// import { collection, getDocs, query, where } from 'firebase/firestore';


export default function Navbar({nome}) {
  // const [user, loading] = useAuthState(auth);
  // const [admin, setAdmin] = useState("");

  // const fetchUserName = async () => {
  //   try {
  //     const q = query(collection(db, "usuarios"), where("uid", "==", user?.uid));
  //     const doc = await getDocs(q);
  //     const data = doc.docs[0].data();

  //     setAdmin(data.isAdmin);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   if (loading) return;

  //   fetchUserName();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, loading]);

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: "100%",
            }}
          >  
            <Stack
              direction="row"
              spacing={1}
            >
              <NavButton message="Programação Diária" route="/dashboard/programacaodiaria"/>
              <NavButton message="Cotação" route="/dashboard/cotacao"/>
              <NavMenu />
              {/* {admin
                ? <NavButton message="Usuários" route="/dashboard/usuarios"/>
                : <></>
              } */}
            </Stack>
            
            <Tooltip title="Abrir menu de configurações">
              <UserMenu nome={nome}/>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar/>
    </Box>
  )
}
