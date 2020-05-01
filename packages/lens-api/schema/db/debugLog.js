import getParentDebugLog from '../debugLog';

const segment = 'db';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
