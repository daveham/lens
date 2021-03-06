import getParentDebugLog from '../debugLog';

const segment = 'store';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
