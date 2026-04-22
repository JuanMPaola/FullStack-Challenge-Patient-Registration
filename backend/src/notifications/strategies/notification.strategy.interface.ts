export interface NotificationStrategy {
  send(to: string, message: string): Promise<void>;
}