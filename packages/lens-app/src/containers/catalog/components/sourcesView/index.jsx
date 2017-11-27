import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './view';
import { thumbnailUrlsSelector as thumbnailImageUrls } from '../../../../modules/images/selectors';
import { sourcesArray, name } from '../../selectors';

const mapDispatchToProps = {};

const mapStateToProps = createStructuredSelector({
  name,
  sources: sourcesArray,
  thumbnailImageUrls
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
