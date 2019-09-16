import Debug from 'debug';
import { Queue } from './Queue';
import { HasAsyncOp, HasGroupId, Serializable } from './interfaces'

const debug = Debug('bind-concurrency:BindConcurrency.ts');

// TODO - Check Type Signature of resolve function
type Resolve = (data: HasGroupId) => void;
// TODO - Check Type Signature of reject function
type Reject = (err: Error) => void;

type synchronizeUpdateElement = {
  data: HasGroupId,
  resolve: Resolve,
  reject: Reject
}

export class BindConcurrency {

  private synchronizeUpdate: {
    [id: string]: Queue<synchronizeUpdateElement>;
  } = {}

  constructor(private store: HasAsyncOp) { }

  public async publish(data: HasGroupId): Promise<HasGroupId> {
    let groupId = data.getGroupId();
    let isUpdateForIdInProgress = this.isUpdateForIdInProgress(data);

    if (isUpdateForIdInProgress) {
      return new Promise<HasGroupId>(
        (resolve: Resolve, reject: Reject) => {
          this.enqueueToId(groupId, { resolve, reject, data })
        })
    }

    return new Promise<HasGroupId>(
      (resolve: Resolve, reject: Reject) => {
        this.enqueueToId(groupId, { resolve, reject, data })
        this.updateId(data);
      })
  }

  private isUpdateForIdInProgress(data: HasGroupId): boolean {
    let groupId = data.getGroupId();
    return this.synchronizeUpdate[groupId] && this.synchronizeUpdate[groupId].hasElement()
  }

  private async updateId(data: HasGroupId) {
    let groupId = data.getGroupId()

    while (this.hasElementToUpdate(groupId)) {
      let data;
      let peekElement = this.synchronizeUpdate[groupId].peek();

      if (peekElement) {
        ({ data } = peekElement);
      }

      if (data) {
        try {
          await this.store.asyncOp(data.serialize());
          let updatedElement = this.synchronizeUpdate[groupId].dequeue();
          if (updatedElement) {
            let { data, resolve } = updatedElement;
            resolve(data);
          }
        } catch (err) {
          let updatedElement = this.synchronizeUpdate[groupId].dequeue();
          if (updatedElement) {
            let { data, reject } = updatedElement;
            err.data = data;
            reject(err);
          }
        }
      }
    }
  }

  private hasElementToUpdate(groupId: string): boolean {
    return this.synchronizeUpdate[groupId].hasElement();
  }

  private enqueueToId(groupId: string, data: synchronizeUpdateElement) {
    if (!this.synchronizeUpdate[groupId]) {
      this.synchronizeUpdate[groupId] = new Queue();
    }
    this.synchronizeUpdate[groupId].enqueue(data)
  }
}