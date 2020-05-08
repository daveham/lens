import getParentDebugLog from '../debugLog';

const segment = 'hikers';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
