import getParentDebugLog from '../debugLog';

const segment = 'sagas';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
