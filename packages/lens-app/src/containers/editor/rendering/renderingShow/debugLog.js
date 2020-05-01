import getParentDebugLog from '../debugLog';

const segment = 'renderingShow';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
