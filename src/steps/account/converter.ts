import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { TravisCIUser } from '../../types';
import { Entities } from '../constants';

export function getAccountKey(id: number): string {
  return `travisci_account:${id.toString()}`;
}

export function createAccountEntity(account: {
  id: number;
  email: string;
  hostname: string;
  name: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: getAccountKey(account.id),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id: account.id.toString(),
        email: account.email,
        hostname: account.hostname,
        name: account.name,
      },
    },
  });
}

/*
   User & Account are the same entity. We can't iterate users.
   Therefore we've added the user-related converter functions in here.
   Alternative would be to have steps/users with only converter file.
   Or we could have steps/users with its own step function but we'd
   essentially be doing the same procedure just in two places which doesn't seems ideal.
*/
export function getUserKey(id: number): string {
  return `travisci_user:${id.toString()}`;
}

export function createUserEntity(user: TravisCIUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: getUserKey(user.id),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        id: user.id.toString(),
        username: user.login,
        email: user.email,
        active: true,
        name: user.name,
      },
    },
  });
}
