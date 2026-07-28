/**
 * Supported 5 Indian States for v1 / MVP
 * Standardized exact government spellings verified on data.gov.in
 */
const SUPPORTED_STATES = [
  'Maharashtra',
  'Uttar Pradesh',
  'Punjab',
  'Madhya Pradesh',
  'Karnataka'
];

/**
 * Validates state against supported list (case-insensitive search, returns exact canonical name)
 */
function normalizeState(stateInput) {
  if (!stateInput) return null;
  const match = SUPPORTED_STATES.find(
    s => s.toLowerCase() === stateInput.trim().toLowerCase()
  );
  return match || null;
}

module.exports = {
  SUPPORTED_STATES,
  normalizeState
};
