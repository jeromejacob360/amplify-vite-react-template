import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: 'jobApplicationFiles',
  access: (allow) => (
    {
      'resumes/{entity_id}/*': [allow.guest.to(['read']), allow.entity("identity").to(['read', 'write', 'delete'])],
      'resumes/jerome-test/*': [allow.guest.to(['read']), allow.entity("identity").to(['read', 'write', 'delete'])],
    }
  )
});