import getParentDebugLog from '../debugLog';

const segment = 'modules';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
