import getParentDebugLog from '../debugLog';

const segment = 'renderingDelete';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
