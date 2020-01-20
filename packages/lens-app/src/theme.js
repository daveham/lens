import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// import _debug from 'debug';
// const debug = _debug('theme');

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#a7c0cd',
      main: '#78909c',
      dark: '#4b636e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffbb93',
      main: '#ff8a65',
      dark: '#c75b39',
      contrastText: '#000',
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700],
    },
    warning: {
      light: orange[300],
      main: orange[500],
      dark: orange[700],
    },
    info: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    success: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    app: {
      background: '#d0d0d0',
    },
  },
  editor: {
    fontSize: '10pt',
    annotation: {
      fontSize: '8pt',
    },
    analysis: {
      height: 188,
      width: 150,
      fontSize: '8pt',
      menu: {
        height: 20,
        item: {
          color: '#eee',
          highlighted: '#ccc',
          selected: '#777',
        },
      },
      histogram: {
        height: 126,
      },
      bars: {
        height: 118,
      },
      details: {
        height: 30,
      },
      bar: {
        height: 10,
        gap: 2,
        barRed: {
          strokeColor: '#fcc',
          fillColor: '#ffd8d8',
        },
        barGreen: {
          strokeColor: '#ada',
          fillColor: '#c8eec8',
        },
        barBlue: {
          strokeColor: '#cce',
          fillColor: '#d8d8ff',
        },
        barHue: {
          strokeColor: '#9dd',
          fillColor: '#aee',
        },
        barSaturation: {
          strokeColor: '#fcf',
          fillColor: '#ffd8ff',
        },
        barLuminance: {
          strokeColor: '#f0e68c',
          fillColor: '#fdff62',
        },
      },
    },
    guide: {
      background: '#f0f0f0',
    },
  },
});

export default theme;
