import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import styles from './CatalogView.scss';

const sourcePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

export class CatalogView extends Component {
  static propTypes = {
    children: PropTypes.node,
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
          <Link to={`/catalog/source/${source.id}`}>
            <img className={styles.catalogImage} src={url}/>
          </Link>
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

  renderChildren() {
    return (
      <main className={styles.catalogContent}>
        {this.props.children}
      </main>
    );
  }

  renderCatalog() {
    const { catalog } = this.props;
    const catalogName = catalog.loading ? 'Loading...' : catalog.name;

    return (
      <main className={styles.catalogContent}>
        <header className={styles.catalogName}>
          {catalogName}
        </header>
        {this.renderDynamicImages()}
      </main>
    );
  }

  render() {
    if (this.props.children) return this.renderChildren();
    return this.renderCatalog();
  }
}

export default CatalogView;
