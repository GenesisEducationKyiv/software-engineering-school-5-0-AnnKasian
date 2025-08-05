const LOKI_ERROR_MESSAGES = {
  HOST_REQUIRED: "Loki host is required when Loki logging is enabled",
  TRANSPORT_REQUIRED:
    "At least one transport (Console or Loki) must be enabled",
} as const;

export { LOKI_ERROR_MESSAGES };
