import Pusher from 'pusher';

let _pusherServer: Pusher | null = null;

export function getPusherServer(): Pusher {
  if (!_pusherServer) {
    if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET || !process.env.PUSHER_CLUSTER) {
      throw new Error('Pusher environment variables are not set.');
    }
    _pusherServer = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });
  }
  return _pusherServer;
}

// Keep named export for backwards compatibility — evaluates lazily via Proxy
export const pusherServer = new Proxy({} as Pusher, {
  get(_target, prop) {
    return getPusherServer()[prop as keyof Pusher];
  },
});
