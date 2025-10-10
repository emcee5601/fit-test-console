/**
 * These are driven by both ProtocolExecutor and by the device (via data collector).
 */
export const ProtocolExecutionStates = ["Executing", "Paused", "Idle"] as const
export type ProtocolExecutionState = typeof ProtocolExecutionStates[number];
