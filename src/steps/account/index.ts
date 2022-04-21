import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { TravisCIUser } from '../../types';
import {
  ACCOUNT_ENTITY_KEY,
  Steps,
  Entities,
  Relationships,
} from '../constants';
import { createAccountEntity, createUserEntity } from './converter';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const user: TravisCIUser = await apiClient.fetchUser();

  const accountEntity = createAccountEntity({
    email: user.email,
    id: user.id,
    hostname: instance.config.hostname,
    name: user.name,
  });
  await jobState.addEntity(accountEntity);
  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);

  const userEntity = createUserEntity(user);
  await jobState.addEntity(userEntity);

  await jobState.addRelationship(
    createDirectRelationship({
      _class: RelationshipClass.IS,
      from: accountEntity,
      to: userEntity,
    }),
  );
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT, Entities.USER],
    relationships: [Relationships.ACCOUNT_IS_USER],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];
