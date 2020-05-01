import getParentDebugLog from '../debugLog';

const segment = 'stats';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
