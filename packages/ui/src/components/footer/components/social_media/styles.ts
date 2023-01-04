import { makeStyles } from '@mui/styles';
import Color from 'color';

const styles = makeStyles((theme) => {
  const iconFill =
    theme.palette.mode === 'light'
      ? theme.palette.custom.fonts.fontTwo
      : theme.palette.custom.general.icon;
  return {
    root: {
      '& .media': {
        margin: '0 0.5rem',
        '&:first-child': {
          marginLeft: 0,
        },
        '&:last-child': {
          marginRight: 0,
        },
        '& path': {
          transition: 'all 0.3s ease',
          fill: iconFill,
        },
        '&:hover': {
          '& path': {
            fill: Color(iconFill).alpha(0.6).string(),
          },
        },
      },
    },
  };
});

export const useStyles = () => styles();
