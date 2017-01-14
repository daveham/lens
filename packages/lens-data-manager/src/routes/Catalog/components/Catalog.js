import React, { PropTypes } from 'react';
import styles from './Catalog.scss';
import SourceList from './SourceList';

const Catalog = (props) => {
  const { name, sources, sourcesMetadataById, sourcesThumbs, select, generate, clear } = props;

  if (name && name.length > 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>{name}</h3>
        <SourceList
          sources={sources}
          sourcesMetadataById={sourcesMetadataById}
          sourcesThumbs={sourcesThumbs}
          select={select}
          generate={generate}
          clear={clear} />
      </div>
    );
  }

  return null;
};

Catalog.propTypes = {
  name: PropTypes.string,
  sources: PropTypes.array,
  sourcesMetadataById: PropTypes.object,
  sourcesThumbs: PropTypes.object,
  select: PropTypes.func,
  generate: PropTypes.func,
  clear: PropTypes.func
};

Catalog.defaultProps = {
  name: '',
  sources: [],
  sourcesMetadataById: {},
  sourcesThumbs: {},
  select: () => {},
  generate: () => {},
  clear: () => {}
};

export default Catalog;
