import { connect } from 'react-redux';
import { default as getConfig } from '../../../../config';
import { thumbnailUrlsSelector } from '../../../../modules/images/selectors';
import { sourcesArray } from '../../selectors';
import View from './view';

const mapDispatchToProps = {};

const mapStateToProps = (state, ownProps) => {
  const sources = sourcesArray(state);
  const thumbnailImageUrls = thumbnailUrlsSelector(state);
  const { id } = ownProps.match.params;
  const index = sources.findIndex((source) => source.id === id);
  const dataHost = getConfig().dataHost;
  const sourceThumbnailUrl = `${dataHost}${thumbnailImageUrls[index]}`;

  return { sourceThumbnailUrl  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
