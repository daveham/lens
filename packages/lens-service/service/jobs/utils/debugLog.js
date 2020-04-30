import getParentDebugLog from '../debugLog';

const segment = 'utils';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
