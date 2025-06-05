export interface IMConnectOption<T> {
  secretUrl: string;
  beforeConnect: (client: T) => void;
}

export interface IMAdapter<T> {
  client: T;

  connect(options: IMConnectOption<T>): Promise<T>;

  disconnect(): void;
}
