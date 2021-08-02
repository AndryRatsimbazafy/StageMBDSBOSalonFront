export interface MediaChatState {
  room?: string;
  name?: string;
  socketId?: string;
  peerId?: string;
  hasMyVideoStream?: boolean;
  audio?: boolean;
  video?: boolean;
  isCalling?: boolean;
  screenSharing?: boolean,
  isRinging?: boolean;
  remoteSocketId?: string;
  remoteUserName?: string;
}
