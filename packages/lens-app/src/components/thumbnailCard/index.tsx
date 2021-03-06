import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Link, LinkProps } from 'react-router-dom';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { default as getConfig } from 'src/config';

const cardWidth = 225;
const cardHeight = 260;
const mediaHeight = 150;

const useStyles: any = makeStyles({
  card: {
    maxWidth: cardWidth,
    minWidth: cardWidth,
  },
  cardAction: {
    width: '100%',
  },
  cardButtons: {
    justifyContent: 'space-around',
  },
  media: {
    height: mediaHeight,
  },
});

interface IProps {
  thumbnailUrl?: string;
  label: string;
  imageDataLink: string;
  catalogLink: string;
}

type ButtonLinkProps = ButtonProps<typeof Link, LinkProps>;
const ButtonLink = (props: ButtonLinkProps) => <Button {...props} component={Link} />;

const ThumbnailCard = (props: IProps) => {
  const classes = useStyles();
  const { thumbnailUrl, label, imageDataLink, catalogLink } = props;

  if (thumbnailUrl) {
    const dataHost = getConfig().dataHost;
    const fullUrl = `${dataHost}${thumbnailUrl}`;

    return (
      <Card className={classes.card}>
        <CardActionArea classes={{ root: classes.cardAction }}>
          <CardMedia className={classes.media} image={fullUrl} title={label} />
          <CardContent>
            <Typography variant='h5' component='h2'>
              {label}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions classes={{ root: classes.cardButtons }}>
          <ButtonLink color='primary' to={catalogLink} size='small'>
            Definition
          </ButtonLink>
          <ButtonLink color='primary' to={imageDataLink} size='small'>
            Data
          </ButtonLink>
        </CardActions>
      </Card>
    );
  }

  return <Skeleton variant='rect' width={cardWidth} height={cardHeight} />;
};

export default ThumbnailCard;
