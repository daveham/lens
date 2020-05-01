import getParentDebugLog from '../debugLog';

const segment = 'executionEmptyState';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
