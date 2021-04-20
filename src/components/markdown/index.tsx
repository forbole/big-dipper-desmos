import React from 'react';
import ReactMarkdown, { compiler } from 'markdown-to-jsx';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  // Link,
} from '@material-ui/core';

const styles = (theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
});

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        variant: 'h1',
      },
    },
    h2: {
      component: Typography,
      props: {
        variant: 'h2',
      },
    },
    h3: {
      component: Typography,
      props: {
        variant: 'h3',
      },
    },
    h4: {
      component: Typography,
      props: {
        variant: 'h4',
      },
    },
    h5: {
      component: Typography,
      props: {
        variant: 'h5',
      },
    },
    h6: {
      component: Typography,
      props: {
        variant: 'h6',
      },
    },
    default: {
      component: Typography,
      props: {
        variant: 'h6',
        // variant: 'body1',
      },
    },
    p: {
      component: Typography,
      props: {
        variant: 'body1',
      },
    },
    span: {
      component: Typography,
      props: {
        variant: 'body1',
      },
    },
    li: {
      component: withStyles(styles)(({
        classes, ...props
      }: any) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      )),
    },
  },
};

export default function Markdown(props) {
  return (
    <ReactMarkdown
      options={options}
      {...props}
    />
  );
}
