import getParentDebugLog from '../debugLog';

const segment = 'operations';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
