import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { ensureImages } from 'modules/images/actions';
import { ensureCatalogTitle } from 'catalog/modules/actions';

import {
  sources as sourcesSelector,
  thumbnailImageDescriptors as thumbnailImageDescriptorsSelector,
  thumbnailImageKeys as thumbnailImageKeysSelector,
} from 'catalog/selectors';
import { thumbnailImagesSelector } from 'modules/images/selectors';

import ThumbnailCard from 'components/thumbnailCard';

const useStyles: any = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  thumbnailContainer: {
    padding: theme.spacing(4),
  }
}));

const SourcesView = () => {
  const classes = useStyles();

  // const [resolution, setResolution] = useState(32);
  const resolution = 32;

  const dispatch = useDispatch();

  const sources = useSelector(sourcesSelector);
  const thumbnailImageDescriptors = useSelector(thumbnailImageDescriptorsSelector);
  const thumbnailImageKeys = useSelector(thumbnailImageKeysSelector);
  const thumbnailImages = useSelector(thumbnailImagesSelector);

  useEffect(() => { dispatch(ensureCatalogTitle()); }, [dispatch]);
  useEffect(() => {
    const idCount = thumbnailImageDescriptors.length;
    if (idCount && Object.keys(thumbnailImages).length < idCount) {
      dispatch(ensureImages({ imageDescriptors: thumbnailImageDescriptors }));
    }
  }, [thumbnailImageDescriptors, thumbnailImages, dispatch]);
  useEffect(() => {
    if (thumbnailImageDescriptors.length) {
      dispatch(ensureImages({ imageDescriptors: thumbnailImageDescriptors }));
    }
  }, [thumbnailImageDescriptors, dispatch]);

  return (
    <div className={classes.root}>
      {thumbnailImageKeys.map((key, index) => {
        const source = sources[index];
        const thumbnail = thumbnailImages[key];
        return (
          <div className={classes.thumbnailContainer} key={key}>
            <ThumbnailCard
              thumbnailUrl={thumbnail ? thumbnail.url : null}
              label={source.name}
              imageDataLink={`/Catalog/Source/${source.id}/${resolution}`}
              catalogLink={`/Catalog/${source.id}/Simulation`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SourcesView;
