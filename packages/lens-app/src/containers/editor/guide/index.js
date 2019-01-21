import rdxWrapper from 'editor/common/editorRdxWrapper';
import gqlWrapper from './gqlWrapper';
import View from './view';

export default rdxWrapper(gqlWrapper(View));
