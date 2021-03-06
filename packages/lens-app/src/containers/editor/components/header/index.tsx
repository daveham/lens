import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ListToolbar from '../listToolbar';
import { default as getConfig } from 'src/config';

const styles: any = (theme) => ({
  root: {
    alignItems: 'flex-end',
    display: 'flex',
    width: '100%',
    '& div:last-child': {
      marginLeft: 'auto'
    },
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing(1),
  },
  thumbnail: {
    boxShadow: theme.shadows[4],
    margin: theme.spacing(1, .5),
    borderRadius: theme.spacing(.5),
  },
});

interface IProps {
  classes?: any;
  loading?: boolean;
  title: string;
  breadcrumb?: object;
  thumbnailUrl?: string;
  toolbarLinks?: any;
}

const Header = (props: IProps): any => {
  const {
    classes,
    loading,
    title,
    breadcrumb,
    thumbnailUrl,
    toolbarLinks,
  } = props;
  const titleOrLoading = loading ? `${title} (loading...)` : title;
  const bcElement = breadcrumb ? breadcrumb : null;
  const fullUrl = thumbnailUrl
    ? `${getConfig().dataHost}${thumbnailUrl}`
    : '';
  const toolbar = toolbarLinks
    ? <ListToolbar links={toolbarLinks} />
    : <div />;

  return (
    <div className={classes.root}>
      {thumbnailUrl && <img alt='thumbnail' className={classes.thumbnail} src={fullUrl} />}
      <div className={classes.titleContainer}>
        <Typography variant='h4'>{titleOrLoading}</Typography>
        {bcElement}
      </div>
      {toolbar}
    </div>
  );
};

export default withStyles(styles)(Header);
