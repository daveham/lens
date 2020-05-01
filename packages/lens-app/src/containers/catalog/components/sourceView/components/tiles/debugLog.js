import getParentDebugLog from '../debugLog';

const segment = 'tiles';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
