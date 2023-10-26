import { AculabBaseClass } from '@aculab-com/react-native-aculab-client';
import React, {
  createContext,
  useState,
  useMemo,
  useCallback,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { EventEmitter } from 'eventemitter3';
import { MediaStream } from 'react-native-webrtc';
import { ReactNode } from 'react';

// Events
export type AcuMobEventsMap = {
  disconnected: [];
  ringing: [];
  gotMedia: [];
  connected: [obj: any];
  incomingCall: [obj: any];
  localVideoMute: [];
  localVideoUnmute: [];
  remoteVideoMute: [];
  remoteVideoUnmute: [];
};

const AcuMobEvents = new EventEmitter<AcuMobEventsMap>();

export const registerAcuMobEvent = <K extends keyof AcuMobEventsMap>(
  eventName: K,
  listener: (...args: AcuMobEventsMap[K]) => void,
) => AcuMobEvents.on(eventName, listener);

// Context
const AcuMobContext = createContext(
  {} as {
    client: null;
    outboundCall: boolean;
    inboundCall: boolean;
    webRTCState: string;
    callType: CallType;
    activeCall: null;
    localMicMuted: boolean;
    localVideoMuted: boolean;
    remoteVideoMuted: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    registerClientId: string;
    callClientId: string;
    callServiceId: string;

    makeCall: (type: Exclude<CallType, 'none'>, name: string) => void;
    registerClient: () => Promise<void>;
    setLocalMicMuted: Dispatch<SetStateAction<boolean>>;
    setLocalVideoMuted: Dispatch<SetStateAction<boolean>>;
  },
);

type AcuMobProviderProps = {
  webRTCToken: string;
  webRTCAccessKey: string;
  cloudRegionId: string;
  registerClientId: string;
  logLevel: string;
  children: ReactNode;
};
type CallType = 'none' | 'client' | 'service';

function AcuMobProvider({
  webRTCToken,
  webRTCAccessKey,
  cloudRegionId,
  registerClientId,
  logLevel,
  children,
}: AcuMobProviderProps) {
  const [client, setClient] = useState(null);
  const [outboundCall, setOutboundCall] = useState(false);
  const [inboundCall, setInboundCall] = useState(false);
  const [webRTCState, setWebRTCState] = useState('idle');
  const [callType, setCallType] = useState<CallType>('none');
  const [activeCall, setActiveCall] = useState(null);
  const [remoteVideoMuted, setRemoteVideoMuted] = useState(false);
  const [localVideoMuted, setLocalVideoMuted] = useState(false);
  const [localMicMuted, setLocalMicMuted] = useState(false);
  const [callClientId, setCallClientId] = useState('');
  const [callServiceId, setCallServiceId] = useState('');

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  try {
    AculabBaseClass.onDisconnected = () => {
      setLocalStream(null);
      setRemoteStream(null);
      setOutboundCall(false);
      setInboundCall(false);
      setWebRTCState('idle');
      setCallType('none');
      setActiveCall(null);

      AcuMobEvents.emit('disconnected');
    };
    AculabBaseClass.onRinging = () => {
      setWebRTCState('ringing');

      AcuMobEvents.emit('ringing');
    };
    AculabBaseClass.onGotMedia = () => {
      setWebRTCState('gotMedia');

      AcuMobEvents.emit('gotMedia');
    };
    AculabBaseClass.onConnected = obj => {
      setWebRTCState('connected');
      setLocalStream(AculabBaseClass.getLocalStream(activeCall));
      setRemoteStream(obj.call._remote_stream);

      AcuMobEvents.emit('connected', obj);
    };
    AculabBaseClass.onIncomingCall = obj => {
      setCallType('client');
      setWebRTCState('incomingCall');
      setInboundCall(true);
      setActiveCall(obj.call);

      AcuMobEvents.emit('incomingCall', obj);
    };
    AculabBaseClass.onLocalVideoMute = () => {
      setLocalVideoMuted(true);

      AcuMobEvents.emit('localVideoMute');
    };
    AculabBaseClass.onLocalVideoUnmute = () => {
      setLocalVideoMuted(false);

      AcuMobEvents.emit('localVideoUnmute');
    };
    AculabBaseClass.onRemoteVideoMute = () => {
      setRemoteVideoMuted(true);

      AcuMobEvents.emit('remoteVideoMute');
    };
    AculabBaseClass.onRemoteVideoUnmute = () => {
      setRemoteVideoMuted(false);

      AcuMobEvents.emit('remoteVideoUnmute');
    };
  } catch (err: any) {
    console.error('[ AculabBaseClass ]', err);
  }

  const makeCall = useCallback(
    (type: Exclude<CallType, 'none'>, name: string) => {
      setCallType(type);
      setOutboundCall(true);

      switch (type) {
        case 'service':
          setCallServiceId(name);
          setActiveCall(AculabBaseClass.callService(name));
          break;

        case 'client':
          setCallClientId(name);
          setActiveCall(AculabBaseClass.callClient(name));
          break;
      }
    },
    [],
  );

  const registerClient = useCallback(async () => {
    let newClient = await AculabBaseClass.register(
      cloudRegionId,
      webRTCAccessKey,
      registerClientId,
      logLevel,
      webRTCToken,
    );

    if (newClient) {
      AculabBaseClass._client = newClient;
      setClient(newClient);
    }
  }, [webRTCToken, webRTCAccessKey, cloudRegionId, registerClientId, logLevel]);

  const values = useMemo(
    () => ({
      client,
      outboundCall,
      inboundCall,
      webRTCState,
      callType,
      activeCall,
      localMicMuted,
      localVideoMuted,
      remoteVideoMuted,
      localStream,
      remoteStream,
      registerClientId,
      callClientId,
      callServiceId,
      makeCall,
      registerClient,
      setLocalMicMuted,
      setLocalVideoMuted,
    }),
    [
      client,
      outboundCall,
      inboundCall,
      webRTCState,
      callType,
      activeCall,
      localMicMuted,
      localVideoMuted,
      remoteVideoMuted,
      localStream,
      remoteStream,
      registerClientId,
      callClientId,
      callServiceId,
      makeCall,
      registerClient,
      setLocalMicMuted,
      setLocalVideoMuted,
    ],
  );

  return (
    <AcuMobContext.Provider value={values}>{children}</AcuMobContext.Provider>
  );
}

export default AcuMobProvider;
export const useAcuMob = () => {
  const context = useContext(AcuMobContext);

  if (!context) {
    throw new Error(
      'useAcuMob should be used within a AcuMobProvider component',
    );
  }

  return context;
};
