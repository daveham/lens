import getParentDebugLog from '../debugLog';

const segment = 'core';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
