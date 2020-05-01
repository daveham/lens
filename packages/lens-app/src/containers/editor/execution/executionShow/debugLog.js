import getParentDebugLog from '../debugLog';

const segment = 'executionShow';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
