import getParentDebugLog from '../debugLog';

const segment = 'image';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
