import getParentDebugLog from '../debugLog';

const segment = 'sourceView';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
