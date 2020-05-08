import getParentDebugLog from '../debugLog';

const segment = 'hikes';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
