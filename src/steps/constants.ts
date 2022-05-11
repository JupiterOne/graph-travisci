import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export const Steps = {
  ACCOUNT: 'fetch-account',
  CODEREPOS: 'fetch-coderepos',
  BUILD_USER_AND_CODEREPOS_RELATIONSHIPS:
    'build-user-and-code-repos-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'CODEREPO',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'travisci_account',
    _class: ['Account'],
  },
  USER: {
    resourceName: 'User',
    _type: 'travisci_user',
    _class: ['User'],
  },
  CODEREPO: {
    resourceName: 'CodeRepo',
    _type: 'travisci_coderepo',
    _class: ['CodeRepo'],
  },
};

export const Relationships: Record<
  'ACCOUNT_IS_USER' | 'USER_CREATED_CODEREPO' | 'USER_USES_CODEREPO',
  StepRelationshipMetadata
> = {
  ACCOUNT_IS_USER: {
    _type: 'travisci_account_is_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.IS,
    targetType: Entities.USER._type,
  },
  USER_CREATED_CODEREPO: {
    _type: 'travisci_user_created_coderepo',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.CREATED,
    targetType: Entities.CODEREPO._type,
  },
  USER_USES_CODEREPO: {
    _type: 'travisci_user_uses_coderepo',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.USES,
    targetType: Entities.CODEREPO._type,
  },
};
