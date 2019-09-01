import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { requestCatalog } from 'catalog/modules/actions';
import {
  catalogIsLoading as catalogIsLoadingSelector,
  catalogIsLoaded as catalogIsLoadedSelector,
} from 'catalog/selectors';

import { Loading } from 'components/loading';
import { editorRoute } from 'src/routes';
import { SourcesView } from './sourcesView';
import { SourceView } from './sourceView';

// import _debug from 'debug';
// const debug = _debug('lens:catalog:view');

const useStyles: any = makeStyles((theme) => ({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: '1 0 auto',
    flexFlow: 'column',
  },
  content: {
    display: 'flex',
    flex: '1 0 auto',
  },
  loading: {
    display: 'flex',
    flex: '1 0 auto',
    fontSize: '72pt',
    color: theme.palette.primary.light,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));

interface IProps {
  match: any;
}

const CatalogView = (props: IProps) => {
  const classes = useStyles();

  const catalogIsLoaded = useSelector(catalogIsLoadedSelector);
  const catalogIsLoading = useSelector(catalogIsLoadingSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!(catalogIsLoaded || catalogIsLoading)) {
      dispatch(requestCatalog());
    }
  }, [catalogIsLoaded, catalogIsLoading, dispatch]);

  const { match: { path } } = props;

  return (
    <div className={classes.root}>
      {catalogIsLoading && (
        <div className={classes.loading}>
          <Loading pulse={true}/>
        </div>
      )}
      {catalogIsLoaded && (
        <div className={classes.content}>
          <Switch>
            <Route path={`${path}/Source/:id/:res`} component={SourceView}/>
            <Route path={`${path}/:sourceId/Simulation`} component={editorRoute}/>
            <Route component={SourcesView}/>
          </Switch>
        </div>
        )}
    </div>
  );
};

export default CatalogView;
