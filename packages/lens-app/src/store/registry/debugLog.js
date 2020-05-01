import getParentDebugLog from '../debugLog';

const segment = 'registry';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
