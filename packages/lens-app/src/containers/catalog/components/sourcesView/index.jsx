import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './view';
import { thumbnailUrlsSelector } from '../../../../modules/images/selectors';
import { sourcesArray, name } from '../../selectors';

const mapDispatchToProps = {};

const mapStateToProps = createStructuredSelector({
  name,
  sources: sourcesArray,
  thumbnailImageUrls: thumbnailUrlsSelector
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
