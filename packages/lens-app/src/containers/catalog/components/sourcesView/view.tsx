import * as React from 'react';
import SourceThumbnail from '../sourceThumbnail';
import { ISourceDescriptor } from '../../../../interfaces';
import styles from './styles.scss';

interface IProps {
  name: string;
  sources: ReadonlyArray<ISourceDescriptor>;
  thumbnailImageUrls: ReadonlyArray<string>;
}

class View extends React.Component<IProps, any> {
  public render() {
    const { thumbnailImageUrls, sources, name } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.catalogName}>{name}</div>
        <div className={styles.thumbnailsContainer}>
          {thumbnailImageUrls.map((url, index) => {
            const source = sources[index];
            return (
              <SourceThumbnail
                key={source.id}
                thumbnailUrl={url}
                label={source.name}
                link={`/Catalog/Source/${source.id}`}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default View;
