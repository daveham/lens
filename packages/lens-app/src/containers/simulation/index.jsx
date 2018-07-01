import { compose } from 'redux';
import View from './components/view';

import rdxWrapper from './rdxWrapper';
import gqlWrapper from './gqlWrapper';

export default compose(rdxWrapper, gqlWrapper)(View);
