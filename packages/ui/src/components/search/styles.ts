import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    '& .MuiInputBase-root': {
      width: '100%',
      background: theme.palette.background.paper,
      padding: theme.spacing(1, 2),
      borderRadius: 48,
      height: '100%',
    },
    '& .MuiInputBase-input': {
      textOverflow: 'ellipsis',
      '&::placeholder': {
        color: theme.palette.custom.fonts.fontFour,
      },
    },
    '& .Search-icon': {
      background: theme.palette.primary.main,
      borderRadius: '100%',
      padding: 5,
      width: 30,
      height: 30,
      color: 'white',
    },
  },
}));

export default useStyles;
