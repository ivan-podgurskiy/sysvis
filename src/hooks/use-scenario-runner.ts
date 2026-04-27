"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Scenario, ScenarioStep } from "@/lib/architectures";

interface ScenarioState {
  activeScenario: Scenario | null;
  currentStepIndex: number;
  activeStep: ScenarioStep | null;
  activeNodes: Set<string>;
  pulsingNodes: Set<string>;
  isPlaying: boolean;
}

interface ScenarioRunner {
  state: ScenarioState;
  runScenario: (scenario: Scenario) => void;
  stopScenario: () => void;
}

const STEP_LINGER_MS = 900; // how long a node stays "active" after particle arrives

export function useScenarioRunner(): ScenarioRunner {
  const [state, setState] = useState<ScenarioState>({
    activeScenario: null,
    currentStepIndex: -1,
    activeStep: null,
    activeNodes: new Set(),
    pulsingNodes: new Set(),
    isPlaying: false,
  });

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const stopScenario = useCallback(() => {
    clearAll();
    setState({
      activeScenario: null,
      currentStepIndex: -1,
      activeStep: null,
      activeNodes: new Set(),
      pulsingNodes: new Set(),
      isPlaying: false,
    });
  }, [clearAll]);

  const runScenario = useCallback(
    (scenario: Scenario) => {
      clearAll();

      setState({
        activeScenario: scenario,
        currentStepIndex: -1,
        activeStep: null,
        activeNodes: new Set(),
        pulsingNodes: new Set(),
        isPlaying: true,
      });

      const steps = scenario.steps;

      // Schedule each step
      steps.forEach((step, i) => {
        // Fire particle at step.delayMs
        const t1 = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            currentStepIndex: i,
            activeStep: step,
          }));
        }, step.delayMs);

        // Activate target node a bit after particle fires (simulate travel time)
        const arrivalDelay = step.delayMs + 550;
        const t2 = setTimeout(() => {
          setState((prev) => {
            const nextActive = new Set(prev.activeNodes);
            const nextPulsing = new Set<string>();
            nextActive.add(step.from);
            nextActive.add(step.to);
            nextPulsing.add(step.to);
            return { ...prev, activeNodes: nextActive, pulsingNodes: nextPulsing };
          });
        }, arrivalDelay);

        // Remove pulse after linger
        const t3 = setTimeout(() => {
          setState((prev) => {
            const nextPulsing = new Set(prev.pulsingNodes);
            nextPulsing.delete(step.to);
            return { ...prev, pulsingNodes: nextPulsing };
          });
        }, arrivalDelay + STEP_LINGER_MS);

        timeoutsRef.current.push(t1, t2, t3);
      });

      // Finish
      const lastStep = steps[steps.length - 1];
      const finishDelay = (lastStep?.delayMs ?? 0) + 1800;
      const t4 = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          activeStep: null,
          activeNodes: new Set(),
          pulsingNodes: new Set(),
        }));
      }, finishDelay);
      timeoutsRef.current.push(t4);
    },
    [clearAll]
  );

  useEffect(() => () => clearAll(), [clearAll]);

  return { state, runScenario, stopScenario };
}
