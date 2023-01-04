import { makeStyles } from '@mui/styles';

const styles = makeStyles((theme) => ({
  root: {
    '&&': {
      overflow: 'auto',
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      background: theme.palette.background.paper,
    },
  },
}));

export const useStyles = () => styles();
