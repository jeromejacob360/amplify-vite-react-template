import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHello } from './functions/say-hello/resource';
import { storage } from './storage/resource';

defineBackend({
  auth,
  data,
  sayHello,
  storage
});
