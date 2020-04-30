import getParentDebugLog from '../debugLog';

const segment = 'server';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
