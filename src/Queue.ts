export class Queue<T> {
  private queue: T[]
  constructor() { 
    this.queue = [];
  }

  enqueue(data: T): T {
    this.queue.unshift(data);
    return data;
  }

  dequeue(): T | null {
    return this.queue.pop() || null;
  }

  peek(): T | null {
    let queueLength = this.queue.length;
    let indexLastElement = queueLength - 1;

    return this.queue[indexLastElement];
  }

  hasElement(): boolean {
    return (this.queue.length !== 0)
  }
}