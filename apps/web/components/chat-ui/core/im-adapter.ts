export interface IMConnectOption {
  secretUrl: string;
}

export interface IMAdapter<T> {
  client: T;

  connect(options: IMConnectOption): Promise<T>;

  disconnect(): void;
}
