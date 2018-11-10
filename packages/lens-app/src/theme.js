import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
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
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    app: {
      background: '#f0f0f0',
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
  },
});

export default theme;
