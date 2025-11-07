// src/services/signalr-service.ts
import * as signalR from '@microsoft/signalr';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 2000; // 2 seconds

  async startConnection(token: string): Promise<void> {
    // If already connecting or connected, don't start again
    if (this.connection && 
        (this.connection.state === signalR.HubConnectionState.Connected || 
         this.connection.state === signalR.HubConnectionState.Connecting)) {
      return;
    }
  
    // If a connection exists but is disconnected, stop and recreate it
    if (this.connection) {
      await this.connection.stop().catch(() => {});
      this.connection = null;
    }
  
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}/notificationHub`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  
    try {
      await this.connection.start();
      this.isConnected = true;
      console.log("SignalR Connected successfully");
    } catch (err) {
      console.error("SignalR Connection Error:", err);
      this.isConnected = false;
      throw err;
    }
  }
  

  stopConnection(): void {
    if (this.connection) {
      this.connection.off('ReceiveNotification');
      this.connection.stop();
      this.connection = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
    }
  }

  onReceiveNotification(callback: (notification: any) => void): void {
    if (this.connection) {
      this.connection.on('ReceiveNotification', callback);
    }
  }

  offReceiveNotification(callback: (notification: any) => void): void {
    if (this.connection) {
      this.connection.off('ReceiveNotification', callback);
    }
  }

  async joinUserGroup(userId: string): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('JoinUserGroup', userId);
        console.log(`Joined user group: user-${userId}`);
      } catch (error) {
        console.error('Failed to join user group:', error);
      }
    }
  }

  async leaveUserGroup(userId: string): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('LeaveUserGroup', userId);
        console.log(`Left user group: user-${userId}`);
      } catch (error) {
        console.error('Failed to leave user group:', error);
      }
    }
  }

  getConnectionState(): string {
    if (!this.connection) return 'Disconnected';
    return this.connection.state;
  }
}

export const signalRService = new SignalRService();