import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { IThumbnailDescriptor } from 'src/interfaces';
import { default as getConfig } from 'src/config';
import Loading from 'src/components/loading';

import { withStyles } from '@material-ui/core/styles';

import _debug from 'debug';
const debug = _debug('lens:editor:guide');

const styles: any = (theme) => {
  const { unit } = theme.spacing;
  return {
    root: {
      padding: unit * 2,
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
      // border: '1px solid #f00',
    },
    contents: {
      width: '100%',
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
    },
    card: {
      maxWidth: unit * 50,
      // maxWidth: 225,
      // minWidth: 225,
    },
    cardAction: {
      width: '100%',
    },
    media: {
      // objectFit: 'cover',
      height: 0,
      paddingTop: '66.66%',
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
    },
  };
};

interface IProps {
  classes?: any;
  match: any;
  label: string;
  photo?: string;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
  ensureEditorTitle: (sourceId?: string) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): void {
    const {
      thumbnailUrl,
      thumbnailImageDescriptor,
      ensureImage,
      ensureEditorTitle,
      match: { params: { sourceId } },
    } = this.props;

    ensureEditorTitle(sourceId);

    if (!thumbnailUrl) {
      ensureImage({ imageDescriptor: thumbnailImageDescriptor });
    }
  }

  public render(): any {
    const {
      classes,
      thumbnailUrl,
      photo,
      label,
    } = this.props;
    debug('render', { thumbnailUrl, photo, label});

    if (thumbnailUrl) {
      const dataHost = getConfig().dataHost;
      const fullUrl = `${dataHost}${thumbnailUrl}`;

      return (
        <div className={classes.root}>
          <Card className={classes.card}>
            <CardHeader
              avatar={(
                <Avatar className={classes.avatar}>
                  P
                </Avatar>
              )}
              title={photo}
            />
            <CardMedia
              // component='img'
              className={classes.media}
              image={fullUrl}
              title={label}
            />
            <CardContent>
              <Typography variant='h5' component='h2'>{label}</Typography>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div>
        <Loading pulse={true} />
      </div>
    );
  }
}

export default withStyles(styles)(View);
