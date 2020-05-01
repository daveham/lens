import getParentDebugLog from '../debugLog';

const segment = 'rendering';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
