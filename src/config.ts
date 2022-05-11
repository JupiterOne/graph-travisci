import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  token: {
    type: 'string',
    mask: true,
  },
  hostname: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  token: string;
  hostname: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.token || !config.hostname) {
    throw new IntegrationValidationError(
      'Config requires all of { token, hostname }',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
