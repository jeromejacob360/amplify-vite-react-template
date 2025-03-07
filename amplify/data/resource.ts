import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { sayHello } from '../functions/say-hello/resource';

export const schema = a.schema({
  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(sayHello))
    .authorization((allow) => [allow.authenticated()]),

  JobApplication: a
    .model({
      jobTitle: a.string(),
      jobDescription: a.string(),
      numberOfApplicants: a.string(),
      status: a.enum([
        'interviewScheduled',
        'interviewed',
        'accepted',
        'rejected',
        'noResponse',
      ]),
      interviewType: a.enum([
        'phone',
        'hr',
        'technical',
        'liveCoding',
        'panel',
        'culture',
        'final',
        'other',
      ]),
      interviewDate: a.date(),
      appliedDate: a.date(),
      resumeFilename: a.string(),
      resumeUrl: a.string(),
      coverLetterFilename: a.string(),
      coverLetterUrl: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
