// src/linting/bpmnlintConfig.js
import adHocSubProcess from 'bpmnlint/rules/ad-hoc-sub-process';
import conditionalEvent from 'bpmnlint/rules/conditional-event';
import conditionalFlows from 'bpmnlint/rules/conditional-flows';
import endEventRequired from 'bpmnlint/rules/end-event-required';
import eventBasedGateway from 'bpmnlint/rules/event-based-gateway';
import eventSubProcessTypedStartEvent from 'bpmnlint/rules/event-sub-process-typed-start-event';
import fakeJoin from 'bpmnlint/rules/fake-join';
import labelRequired from 'bpmnlint/rules/label-required';
import linkEvent from 'bpmnlint/rules/link-event';
import noBpmndi from 'bpmnlint/rules/no-bpmndi';
import noComplexGateway from 'bpmnlint/rules/no-complex-gateway';
import noDisconnected from 'bpmnlint/rules/no-disconnected';
import noDuplicateSequenceFlows from 'bpmnlint/rules/no-duplicate-sequence-flows';
import noGatewayJoinFork from 'bpmnlint/rules/no-gateway-join-fork';
import noImplicitEnd from 'bpmnlint/rules/no-implicit-end';
import noImplicitSplit from 'bpmnlint/rules/no-implicit-split';
import noImplicitStart from 'bpmnlint/rules/no-implicit-start';
import noInclusiveGateway from 'bpmnlint/rules/no-inclusive-gateway';
import noOverlappingElements from 'bpmnlint/rules/no-overlapping-elements';
import singleBlankStartEvent from 'bpmnlint/rules/single-blank-start-event';
import singleEventDefinition from 'bpmnlint/rules/single-event-definition';
import startEventRequired from 'bpmnlint/rules/start-event-required';
import subProcessBlankStartEvent from 'bpmnlint/rules/sub-process-blank-start-event';
import superfluousGateway from 'bpmnlint/rules/superfluous-gateway';
import superfluousTermination from 'bpmnlint/rules/superfluous-termination';

const ruleMap = {
  'ad-hoc-sub-process': adHocSubProcess,
  'conditional-event': conditionalEvent,
  'conditional-flows': conditionalFlows,
  'end-event-required': endEventRequired,
  'event-based-gateway': eventBasedGateway,
  'event-sub-process-typed-start-event': eventSubProcessTypedStartEvent,
  'fake-join': fakeJoin,
  'label-required': labelRequired,
  'link-event': linkEvent,
  'no-bpmndi': noBpmndi,
  'no-complex-gateway': noComplexGateway,
  'no-disconnected': noDisconnected,
  'no-duplicate-sequence-flows': noDuplicateSequenceFlows,
  'no-gateway-join-fork': noGatewayJoinFork,
  'no-implicit-end': noImplicitEnd,
  'no-implicit-split': noImplicitSplit,
  'no-implicit-start': noImplicitStart,
  'no-inclusive-gateway': noInclusiveGateway,
  'no-overlapping-elements': noOverlappingElements,
  'single-blank-start-event': singleBlankStartEvent,
  'single-event-definition': singleEventDefinition,
  'start-event-required': startEventRequired,
  'sub-process-blank-start-event': subProcessBlankStartEvent,
  'superfluous-gateway': superfluousGateway,
  'superfluous-termination': superfluousTermination
};

export const bpmnlintResolver = {
  resolveRule(_pkg, ruleName) {
    const rule = ruleMap[ruleName];
    if (!rule) throw new Error(`bpmnlint rule "${ruleName}" not mapped`);
    return rule;
  },
  resolveConfig(pkg) {
    throw new Error(`bpmnlint config resolution not supported for "${pkg}"`);
  }
};

export const bpmnlintOptions = {
  config: {
    rules: {
      'ad-hoc-sub-process': 'warn',
      'conditional-event': 'warn',
      'conditional-flows': 'error',
      'end-event-required': 'error',
      'event-based-gateway': 'warn',
      'event-sub-process-typed-start-event': 'warn',
      'fake-join': 'warn',
      'label-required': 'warn',
      'link-event': 'warn',
      'no-bpmndi': 'off',
      'no-complex-gateway': 'warn',
      'no-disconnected': 'error',
      'no-duplicate-sequence-flows': 'warn',
      'no-gateway-join-fork': 'warn',
      'no-implicit-end': 'warn',
      'no-implicit-split': 'error',
      'no-implicit-start': 'warn',
      'no-inclusive-gateway': 'off',
      'no-overlapping-elements': 'warn',
      'single-blank-start-event': 'warn',
      'single-event-definition': 'warn',
      'start-event-required': 'error',
      'sub-process-blank-start-event': 'warn',
      'superfluous-gateway': 'warn',
      'superfluous-termination': 'warn'
    }
  },
  resolver: bpmnlintResolver
};
