import getParentDebugLog from '../debugLog';

const segment = 'factories';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
