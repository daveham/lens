import getParentDebugLog from '../debugLog';

const segment = 'simulationDelete';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
