import React from 'react';
import { Box } from '@chakra-ui/react';

function Main({children}) {

  return (
    <Box maxWidth="1200px" width="100%" margin="0 auto" p={5}>
      {children}
    </Box>
  );
}

export default Main;