import getParentDebugLog from '../debugLog';

const segment = 'renderingEmptyState';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
