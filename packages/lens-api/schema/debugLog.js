import getParentDebugLog from '../debugLog';

const segment = 'schema';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
