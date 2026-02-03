import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useAuthStore } from "@/store/useAuthStore";

const WS_URL =
  "http://Sportshop-backend-env.eba-rmvficqm.ap-southeast-1.elasticbeanstalk.com/ws/chat";

class WebSocketClient {
  stomp: any = null;
  connected = false;
  subscriptions: Record<string, any> = {};
  connecting = false;

  connect(onConnected?: () => void, onError?: (err: any) => void) {
    if (this.connected || this.connecting) {
      if (onConnected) onConnected();
      return;
    }

    this.connecting = true;

    const token = useAuthStore.getState().accessToken;

    const socket = new SockJS(WS_URL);
    this.stomp = Stomp.over(socket);
    // this.stomp.debug = () => {}; // Uncomment to disable debug logs

    this.stomp.connect(
      {
        Authorization: token ? `Bearer ${token}` : "",
      },
      () => {
        this.connected = true;
        this.connecting = false;
        console.log("[WS] Connected");
        if (onConnected) onConnected();
      },
      (err: any) => {
        console.log("[WS] Error:", err);
        this.connected = false;
        this.connecting = false;
        if (onError) onError(err);

        setTimeout(() => this.connect(onConnected, onError), 3000);
      }
    );
  }

  unsubscribeAll() {
    Object.values(this.subscriptions).forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch (_) {}
    });
    this.subscriptions = {};
  }

  subscribeRoom(roomId: number, callback: (msg: any) => void) {
    if (!this.connected) return;
    const path = `/topic/room/${roomId}`;

    if (this.subscriptions[path]) {
      return this.subscriptions[path];
    }

    const sub = this.stomp.subscribe(path, (msg: any) => {
      callback(JSON.parse(msg.body));
    });

    this.subscriptions[path] = sub;
    return sub;
  }

  subscribeNewRoom(callback: (room: any) => void) {
    const path = `/topic/admin/new-room`;

    if (!this.connected) {
      const interval = setInterval(() => {
        if (this.connected && this.stomp) {
          clearInterval(interval);
          this.subscribeNewRoom(callback);
        }
      }, 100);
      return;
    }

    if (this.subscriptions[path]) {
      return this.subscriptions[path];
    }

    const sub = this.stomp.subscribe(path, (msg: any) => {
      callback(JSON.parse(msg.body));
    });

    this.subscriptions[path] = sub;
    return sub;
  }

  sendMessage(roomId: number, payload: any) {
    if (!this.connected) return;
    this.stomp.send(`/app/chat/${roomId}`, {}, JSON.stringify(payload));
  }
}

export const ws = new WebSocketClient();
export default ws;
