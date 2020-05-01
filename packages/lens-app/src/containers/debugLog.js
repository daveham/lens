import getParentDebugLog from '../debugLog';

const segment = 'containers';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
