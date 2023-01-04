import { makeStyles } from '@mui/styles';

const styles = makeStyles((theme) => ({
  root: {
    ...theme.mixins.layout,
    '& a': {
      color: theme.palette.custom.fonts.highlight,
    },
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      gap: theme.spacing(2),
      gridTemplateColumns: 'repeat(2, 1fr) 500px',
    },
  },
  profile: {
    [theme.breakpoints.up('lg')]: {
      gridColumn: '1/4',
    },
  },
  overview: {
    [theme.breakpoints.up('lg')]: {
      gridColumn: '1/4',
    },
  },
  stats: {
    [theme.breakpoints.up('lg')]: {
      gridColumn: '1/3',
    },
  },
  consensus: {
    [theme.breakpoints.up('lg')]: {
      gridColumn: '3/4',
    },
  },
  blocks: {
    [theme.breakpoints.up('lg')]: {
      gridColumn: '1/4',
    },
  },
}));

export const useStyles = () => styles();
