import getParentDebugLog from '../debugLog';

const segment = 'trails';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
