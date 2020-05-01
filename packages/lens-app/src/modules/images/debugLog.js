import getParentDebugLog from '../debugLog';

const segment = 'images';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
