import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  JobApplication: a
    .model({
      company: a.string(),
      position: a.string(),
      status: a.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "HIRED"]),
      appliedDate: a.date(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

