import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://<portal>.travis-ci.com/user
     * PATTERN: Singleton
     */
    id: 'fetch-account',
    name: 'Fetch Account Details',
    entities: [
      {
        resourceName: 'Account',
        _type: 'travisci_account',
        _class: ['Account'],
      },
      {
        resourceName: 'User',
        _type: 'travisci_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'travisci_account_is_user',
        sourceType: 'travisci_account',
        _class: RelationshipClass.IS,
        targetType: 'travisci_user',
      },
    ],
    dependsOn: [],
    implemented: true,
  },
];
