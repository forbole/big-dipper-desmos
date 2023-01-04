import { Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

export const useGetStyles = () => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        overflow: 'auto',
        padding: '1rem',
        margin: '0',
        background: theme.palette.background.default,
        flex: 1,
        '& code': {
          whiteSpace: 'pre-wrap',
        },
      },
    })
  );

  return {
    classes: useStyles(),
  };
};
