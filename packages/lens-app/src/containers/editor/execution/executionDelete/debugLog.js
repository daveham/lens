import getParentDebugLog from '../debugLog';

const segment = 'executionDelete';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
