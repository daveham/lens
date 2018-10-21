import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    '& div:first-child': {
      marginRight: 'auto'
    },
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
};

interface IProps {
  classes: any;
  loading: boolean;
  title: string;
  breadcrumb?: object;
  children?: any;
}

const Header = (props: IProps): any => {
  const {
    classes,
    loading,
    title,
    breadcrumb,
    children,
  } = props;
  const titleOrLoading = loading ? `${title} (loading...)` : title;
  const bcElement = breadcrumb ? breadcrumb : null;
  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        {bcElement}
        <Typography variant='h4'>{titleOrLoading}</Typography>
      </div>
      {children}
    </div>
  );
};

export default withStyles(styles)(Header);
