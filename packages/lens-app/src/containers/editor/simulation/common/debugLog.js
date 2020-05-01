import getParentDebugLog from '../debugLog';

const segment = 'common';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
