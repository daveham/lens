import React, { Component, PropTypes } from 'react';

//import debugLib from 'debug';
//const debug = debugLib('app:CatalogView');

import styles from './CatalogView.scss';

const sourcePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

export class CatalogView extends Component {
  static propTypes = {
    catalog: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      sources: PropTypes.arrayOf(sourcePropType).isRequired
    }).isRequired,
    thumbnailImageDescriptors: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.shape({
          id: PropTypes.string.isRequired,
          file: PropTypes.string.isRequired
        })
      })
    ).isRequired,
    thumbnailImageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,

    fetchCatalog: PropTypes.func.isRequired,
    ensureImage: PropTypes.func.isRequired
  };

  componentDidMount() {
    setTimeout(() => { this.props.fetchCatalog(); }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.catalog.loading && !nextProps.catalog.loading) {
      // detected end of catalog loading, ensure thumbnails
      const { ensureImage, thumbnailImageDescriptors } = nextProps;
      thumbnailImageDescriptors.forEach(id => ensureImage(id));
    }
  }

  renderDynamicImages() {
    const { sources } = this.props.catalog;
    const thumbnailElements = this.props.thumbnailImageUrls.map((url, index) => {
      const source = sources[index];
      return (
        <figure className={styles.catalogItem} key={source.id}>
          <img className={styles.catalogImage} src={url}/>
          <figcaption className={styles.catalogImageLabel}>{source.name}</figcaption>
        </figure>
      );
    });
    return (
      <section className={styles.catalogItems}>
        {thumbnailElements}
      </section>
    );
  }

  render() {
    const { catalog } = this.props;
    const catalogName = catalog.loading ? 'Loading...' : catalog.name;

    return (
      <main className={styles.catalogContent}>
        <header className={styles.catalogName}>{catalogName}</header>
        {this.renderDynamicImages()}
      </main>
    );
  }
}

export default CatalogView;
