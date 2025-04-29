/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-misused-promises */
import { domReady } from "./domReady";

type ListenerConfig = {
  name: string;
  setup: () => Promise<unknown> | unknown;
  cleanup?: Promise<() => unknown> | (() => unknown);
  afterSwap?: boolean;
  once?: boolean;
};

const setupListeners: Record<string, ListenerConfig & { ran: number }> = {};

/**
 * Use this function to setup client-side iteractions with Astro.
 */
export async function setupScript(listener: ListenerConfig) {
  const { name, setup: providedSetup, cleanup, once = false } = listener;

  const alreadySetup = name in setupListeners;

  const setup = async (): Promise<unknown> =>
    new Promise(async (resolve, reject) => {
      const thisListenerCfg = setupListeners[name];

      if (thisListenerCfg.ran > 0 && thisListenerCfg.once) {
        return;
      }

      console.log(`Running listener:`, thisListenerCfg);
      try {
        await domReady();
        const result = providedSetup();
        resolve(result instanceof Promise ? await result : result);
      } catch (e) {
        reject(e);
      } finally {
        thisListenerCfg.ran++;
      }
    });

  if (!alreadySetup) {
    document.addEventListener("astro:after-swap", setup);
    setupListeners[name] = { ...listener, setup, ran: 0 };
  }

  if (alreadySetup && once) {
    return;
  }

  await setup();

  if (cleanup) {
    const cleanUpWrapped = async () => {
      console.log(`Running cleanup fn for ${name}`);
      if (cleanup instanceof Promise) {
        const fn = await cleanup;
        fn();
      } else {
        cleanup();
      }

      document.removeEventListener("astro:before-swap", cleanUpWrapped);
    };
    document.addEventListener("astro:before-swap", cleanUpWrapped);
  }
}
