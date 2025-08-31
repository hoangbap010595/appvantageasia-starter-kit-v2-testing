import type { AbilityOptionsOf } from '@casl/ability';

const detectSubjectType: AbilityOptionsOf<any>['detectSubjectType'] = subject => subject._caslType;

export default detectSubjectType;
