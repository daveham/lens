import { createStyles } from '@material-ui/core/styles';

export const styles = (theme) => createStyles({
  root: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    width: '100%',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  contents: {
    width: '100%',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
});
