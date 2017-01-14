import React, { PropTypes } from 'react';
import SourceItem from './SourceItem';

import styles from './SourceList.scss';

const SourceList = (props) => {
  const { sources, sourcesMetadataById, sourcesThumbs, select, generate, clear } = props;
  return (
    <div className={styles.container}>
      {
        sources.map(source => {
          let { id } = source;
          return (
            <SourceItem
              id={id}
              key={id}
              name={source.name}
              metadata={sourcesMetadataById[id]}
              thumb={sourcesThumbs[id]}
              thumbsLoading={sourcesThumbs.loading}
              select={select}
              generate={generate}
              clear={clear} />
          );
        })
      }
    </div>
  );
};

SourceList.propTypes = {
  sources: PropTypes.array,
  sourcesMetadataById: PropTypes.object,
  sourcesThumbs: PropTypes.object,
  select: PropTypes.func,
  generate: PropTypes.func,
  clear: PropTypes.func
};

SourceList.defaultProps = {
  sources: [],
  sourcesMetadataById: {},
  sourcesThumbs: {},
  select: () => {},
  generate: () => {},
  clear: () => {}
};

export default SourceList;
