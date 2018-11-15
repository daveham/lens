import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Loading from '../loading';
import { default as getConfig } from 'src/config';

const styles = {
  card: {
    maxWidth: 225,
    minWidth: 225,
  },
  cardAction: {
    width: '100%',
  },
  cardButtons: {
    justifyContent: 'space-around',
  },
  media: {
    height: 150,
  },
};

interface IProps {
  classes?: any;
  children?: any;
  thumbnailUrl?: string;
  label: string;
  imageDataLink: string;
  catalogLink: string;
}

const linkWrapper = (link) => (props) => <RouterLink to={link} {...props} />;

export default withStyles(styles)(({
  classes,
  children,
  thumbnailUrl,
  label,
  imageDataLink,
  catalogLink,
}: IProps) => {
  if (thumbnailUrl) {
    const dataHost = getConfig().dataHost;
    const fullUrl = `${dataHost}${thumbnailUrl}`;

    return (
      <Card className={classes.card}>
        <CardActionArea
          classes={{ root: classes.cardAction }}
        >
          <CardMedia
            className={classes.media}
            image={fullUrl}
            title={label}
          />
          <CardContent>
            <Typography variant='h5' component='h2'>{label}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions classes={{ root: classes.cardButtons }}>
          <Button
            color='primary'
            component={linkWrapper(catalogLink)}
            size='small'
          >
            Definition
          </Button>
          <Button
            color='primary'
            component={linkWrapper(imageDataLink)}
            size='small'
          >
            Data
          </Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <div>
      <Loading pulse={true} />
    </div>
  );
});
