export interface IMConnectOption<T = any> {
  appKey: string;
  username: string;
  accessToken: string;
  beforeConnect?: (client: T) => void;
}

export interface IMAdapter<T> {
  client: T;

  connect(options: IMConnectOption<T>): Promise<T>;

  disconnect(): void;
}
