export interface Serializable {
  serialize(): string
}

export interface HasGroupId extends Serializable {
  getGroupId(): string,
}

export interface HasAsyncOp {
  asyncOp(data: string): Promise<string>
}