import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './view';
import {
  sourcesArray,
  thumbnailUrlsSelector as thumbnailImageUrls
} from '../../selectors';

const mapDispatchToProps = {};

const mapStateToProps = createStructuredSelector({
  sources: sourcesArray,
  thumbnailImageUrls
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
