import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


import Authenticate from './Authenticate'


// Create a dark theme
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});


function App() {

  

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Authenticate />
      </ThemeProvider>
  )

}

export default App;
