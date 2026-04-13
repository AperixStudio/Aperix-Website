type TypeWriterOptions = {
  loop?: boolean;
  typingSpeed?: number;
  deletingSpeed?: number;
};

type Step = () => Promise<void>;

export default class TypeWriter {
  element: HTMLElement;
  loop: boolean;
  typingSpeed: number;
  deletingSpeed: number;
  private steps: Step[] = [];
  private running = false;
  private stopped = false;
  private timeoutIds = new Set<number>();

  constructor(
    element: HTMLElement,
    { loop = false, typingSpeed = 100, deletingSpeed = 50 }: TypeWriterOptions = {},
  ) {
    this.element = element;
    this.loop = loop;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
  }

  private sleep(ms: number) {
    return new Promise<void>((resolve) => {
      const id = window.setTimeout(() => {
        this.timeoutIds.delete(id);
        resolve();
      }, ms);
      this.timeoutIds.add(id);
    });
  }

  private async run() {
    if (this.running) return;
    this.running = true;

    do {
      for (const step of this.steps) {
        if (this.stopped) {
          this.running = false;
          return;
        }
        await step();
      }
    } while (this.loop && !this.stopped);

    this.running = false;
  }

  private enqueue(step: Step) {
    this.steps.push(step);
    void this.run();
  }

  typeString(string: string) {
    this.enqueue(async () => {
      for (const char of string) {
        if (this.stopped) return;
        this.element.textContent = (this.element.textContent ?? "") + char;
        await this.sleep(this.typingSpeed);
      }
    });
    return this;
  }

  deleteChars(number: number) {
    this.enqueue(async () => {
      for (let i = 0; i < number; i += 1) {
        if (this.stopped) return;
        const current = this.element.textContent ?? "";
        this.element.textContent = current.slice(0, -1);
        await this.sleep(this.deletingSpeed);
      }
    });
    return this;
  }

  deleteAll(deleteSpeed = this.deletingSpeed) {
    this.enqueue(async () => {
      while ((this.element.textContent ?? "").length > 0) {
        if (this.stopped) return;
        const current = this.element.textContent ?? "";
        this.element.textContent = current.slice(0, -1);
        await this.sleep(deleteSpeed);
      }
    });
    return this;
  }

  pauseFor(duration: number) {
    this.enqueue(async () => {
      await this.sleep(duration);
    });
    return this;
  }

  stop() {
    this.stopped = true;
    for (const id of this.timeoutIds) {
      clearTimeout(id);
    }
    this.timeoutIds.clear();
  }
}
