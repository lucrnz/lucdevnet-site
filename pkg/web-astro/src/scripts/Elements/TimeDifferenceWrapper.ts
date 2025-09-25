/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { dateTimeDifferenceToString } from "../../helpers/DateDifference";

class TimeDifferenceWrapper extends HTMLElement {
  private start: Date;
  private end: Date;
  private setupDone = false;

  constructor() {
    super();
    const startStr: string = this.getAttribute("data-start")!;
    const endStr: string = this.getAttribute("data-end")!;

    this.start = new Date(startStr);
    this.end = endStr === "now" ? new Date() : new Date(endStr);
  }

  connectedCallback() {
    if (!this.isConnected) {
      return;
    }

    if (this.setupDone) {
      return;
    }

    this.setup();
  }

  adoptedCallback() {
    if (!this.isConnected) {
      return;
    }

    if (this.setupDone) {
      return;
    }

    this.setup();
  }

  private setup() {
    this.textContent = dateTimeDifferenceToString(this.start, this.end);
  }
}

export function setupTimeDifferenceWrapper() {
  const tag = "time-difference-wrapper";
  if (customElements.get(tag) === undefined) {
    customElements.define(tag, TimeDifferenceWrapper);
  }
}
