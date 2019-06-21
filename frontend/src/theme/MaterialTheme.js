import { createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';

const primary = teal[900];
const secondary = teal[50];
const textPrimary = teal[50];
const textSecondary = teal[900];

const theme = createMuiTheme({
  palette: {
    primary: { main: primary },
    secondary: { main: secondary },
    textPrimary: { main: textPrimary },
    textSecondary: textSecondary,
    background: primary,
  },
  typography: {
    fontSize: 16,
    useNextVariants: true,
  },
});

export default theme;
