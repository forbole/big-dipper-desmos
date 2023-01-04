import { makeStyles } from '@mui/material/styles';

const styles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

export const useStyles = () => styles();
