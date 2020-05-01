import getParentDebugLog from '../debugLog';

const segment = 'guide';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
