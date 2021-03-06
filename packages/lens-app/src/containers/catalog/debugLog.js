import getParentDebugLog from '../debugLog';

const segment = 'catalog';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
