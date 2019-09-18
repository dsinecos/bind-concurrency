import { Queue } from './Queue';

describe('Test Queue', () => {
  test('Create a Queue', () => {
    let queue = new Queue<string>();
    expect(queue instanceof Queue).toEqual(true);
  });

  test('Add element to queue', () => {
    let queue = new Queue<string>();
    queue.enqueue('A');
    queue.enqueue('B');
    let queueData = queue.print();
    expect(queueData).toEqual(['B', 'A']);
  });

  test('Extract element from queue', () => {
    let queue = new Queue<string>();
    queue.enqueue('A');
    let queueData = queue.dequeue();
    expect(queueData).toEqual('A');
    expect(queue.print()).toEqual([]);
  });

  test('Peek into queue', () => {
    let queue = new Queue<string>();
    queue.enqueue('A');
    let queueData = queue.peek();
    expect(queueData).toEqual('A');
    expect(queue.print()).toEqual(['A']);
  });

  test('Returns if queue is empty', () => {
    let queue = new Queue<string>();
    queue.enqueue('A');
    expect(queue.hasElement()).toEqual(true);
    queue.dequeue();
    expect(queue.hasElement()).toEqual(false);
  })
})