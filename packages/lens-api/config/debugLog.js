import getParentDebugLog from '../debugLog';

const segment = 'config';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
