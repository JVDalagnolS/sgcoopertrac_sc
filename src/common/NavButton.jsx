import * as React from 'react';
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/system';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';


export default function NavButton({message, route}) {
  const primary = {
    500: '#EDF2ED',
    600: '#00F46F',
    700: '#00C55A',
  };
  
  const CustomButton = styled(ButtonUnstyled)`
    background-color: ${primary[500]};
    font-family: IBM Plex Sans, sans-serif;
    font-size: 1.2rem;
    width: 10rem;
    border-radius: 6px;
    color: black;
    transition: all 150ms ease;
    cursor: pointer;
    border: none;
    text-decoration: none;
    text-align: center;
    &:hover {
      background-color: ${primary[600]};
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    &.${buttonUnstyledClasses.active} {
      background-color: ${primary[700]};
    }
  
    &.${buttonUnstyledClasses.focusVisible} {
      box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
      outline: none;
    }
  
    &.${buttonUnstyledClasses.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  const LinkBehavior = React.forwardRef((props, ref) => (
    <RouterLink ref={ref} to={route} {...props} role={undefined} />
  ));

  return (
    <Stack spacing={2} direction="row">
      <CustomButton component={LinkBehavior}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            height: "3rem",
          }}
        >
          {message}
        </Stack>
      </CustomButton>
    </Stack>
  )
}
