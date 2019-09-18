import { BindConcurrency } from '../src/BindConcurrency';
import { HasGroupId, HasAsyncOp } from '../src/interfaces';

class TestStore implements HasAsyncOp {
  private store: {
    [id: string]: any[]
  } = {};

  async asyncOp(data: string): Promise<string> {
    await this.delay(100);
    let obj = JSON.parse(data);
    if (!this.store[obj.itemId]) {
      this.store[obj.itemId] = [];
    }
    this.store[obj.itemId].push(obj);
    return data
  }

  private delay(ms: number): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(ms)
      }, ms)
    })
  }

  getStore() {
    return this.store;
  }
}

class BidItem implements HasGroupId {
  private timestamp: number = 0;

  constructor(
    private name: string,
    private itemId: string,
    private bidOrderNum: number,
  ) { }

  getGroupId(): string {
    return this.itemId;
  }

  serialize(): string {
    this.timestamp = Date.now();

    return JSON.stringify({
      name: this.name,
      itemId: this.itemId,
      bidOrderNum: this.bidOrderNum,
      timestamp: this.timestamp
    })
  }
}

describe('Test BindConcurrency', () => {
  test('Preseves order across a given groupId', async () => {
    let testStore = new TestStore();
    let bindConcurrency = new BindConcurrency(testStore);
    let array = initBidItems(bindConcurrency);

    await Promise.all(array);

    let storeData = testStore.getStore();
    for (let key in storeData) {
      let bidOrderData = storeData[key];
      bidOrderData.forEach((bid, index) => {
        if (index !== 0) {
          expect(bid.timestamp > bidOrderData[index - 1].timestamp).toBe(true);
        }
      })
    }
  })

  test.todo('Executes updates across a single groupId serially')
  test.todo('Executes updates across different groupIds in parallel')
})

function initBidItems(bindConcurrency: BindConcurrency): Promise<HasGroupId>[] {
  let bidItemA1 = new BidItem('A1', '1', 1);
  let bidItemA2 = new BidItem('A2', '1', 2);
  let bidItemA3 = new BidItem('A3', '1', 3);
  let bidItemA4 = new BidItem('A4', '1', 4);
  let bidItemA5 = new BidItem('A5', '1', 5);
  let bidItemA6 = new BidItem('A6', '1', 6);

  let bidItemB1 = new BidItem('B1', '2', 1);
  let bidItemB2 = new BidItem('B2', '2', 2);
  let bidItemB3 = new BidItem('B3', '2', 3);
  let bidItemB4 = new BidItem('B4', '2', 4);
  let bidItemB5 = new BidItem('B5', '2', 5);
  let bidItemB6 = new BidItem('B6', '2', 6);

  let array = [bindConcurrency.publish(bidItemA1),
  bindConcurrency.publish(bidItemB1),
  bindConcurrency.publish(bidItemA2),
  bindConcurrency.publish(bidItemB2),
  bindConcurrency.publish(bidItemA3),
  bindConcurrency.publish(bidItemB3),
  bindConcurrency.publish(bidItemA4),
  bindConcurrency.publish(bidItemB4),
  bindConcurrency.publish(bidItemA5),
  bindConcurrency.publish(bidItemB5),
  bindConcurrency.publish(bidItemA6),
  bindConcurrency.publish(bidItemB6)]

  return array;
}
