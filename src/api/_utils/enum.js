export const RolesEnum = {
  USER: 'user',
  ADMIN: 'admin',
};

export const AlarmTriggerRequirmentEnum = {
  ABOVE: 'above',
  BELOW: 'below',
  BOTH: 'both'
};

export const alarmTriggerRequirment = Object.values(AlarmTriggerRequirmentEnum);

export const AlarmStatusEnum = {
  TRIGGER: 'trigger',
  RESOLVE: 'resolve'
};

export const alarmStatus = Object.values(AlarmStatusEnum);
