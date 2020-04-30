import getParentDebugLog from '../debugLog';

const segment = 'jobs';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
