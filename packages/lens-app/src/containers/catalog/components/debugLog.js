import getParentDebugLog from '../debugLog';

const segment = 'components';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
