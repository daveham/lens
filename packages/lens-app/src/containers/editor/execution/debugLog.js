import getParentDebugLog from '../debugLog';

const segment = 'execution';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
