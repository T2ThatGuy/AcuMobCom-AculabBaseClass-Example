import React, { useEffect, useState } from 'react';
import { useAcuMob } from './AcuMobProvider';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COLOURS, styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import {
  AculabBaseClass,
  deleteSpaces,
  turnOnSpeaker,
} from '@aculab-com/react-native-aculab-client';
import { RoundButton } from './components/RoundButton';
import { RTCView } from 'react-native-webrtc';
import { KeypadButton } from './components/KeypadButton';
import { MenuButton } from './components/MenuButton';
import { CallButton } from './components/CallButton';

function RegisterButton(aculabBaseClass: typeof AculabBaseClass) {
  const navigation = useNavigation();
  return (
    <View style={styles.registrationButton}>
      <RoundButton
        iconName={'cog-outline'}
        onPress={() => {
          navigation.goBack();
          aculabBaseClass.unregister();
        }}
      />
    </View>
  );
}

function CallHeadComponent() {
  const { client, registerClientId, webRTCState, outboundCall, inboundCall } =
    useAcuMob();

  return (
    <View style={styles.row}>
      <View style={styles.callHead}>
        <Text style={styles.basicText}>
          Aculab - AcuMobFunctionComponent Example
        </Text>
        {client ? (
          <View>
            <Text style={styles.basicText}>
              Registered as {registerClientId}
            </Text>
            <Text style={styles.basicText}>WebRTC State: {webRTCState}</Text>
            <Text style={styles.basicText}>
              Outbound Call: {String(outboundCall)}
            </Text>
            <Text style={styles.basicText}>
              Inbound Call: {String(inboundCall)}
            </Text>
          </View>
        ) : (
          <Text style={styles.warningText}>
            Please Use Correct Registration Credentials
          </Text>
        )}
      </View>
      {webRTCState === 'idle' ? (
        <RegisterButton {...AculabBaseClass} />
      ) : (
        <View />
      )}
    </View>
  );
}

function DisplayClientCall() {
  const {
    outboundCall,
    webRTCState,
    callClientId,
    inboundCall,
    localStream,
    remoteStream,
    localVideoMuted,
    remoteVideoMuted,
  } = useAcuMob();

  if (outboundCall && webRTCState !== 'connected') {
    return (
      <View style={styles.center}>
        <Text style={styles.callingText}>Calling {callClientId}</Text>
      </View>
    );
  } else if (inboundCall && webRTCState !== 'connected') {
    return (
      <View style={styles.center}>
        <Text style={styles.callingText}>
          Calling {AculabBaseClass._incomingCallClientId}
        </Text>
      </View>
    );
  } else {
    if (remoteStream && localStream) {
      switch (true) {
        case localVideoMuted && !remoteVideoMuted:
          return (
            <View style={styles.vidview}>
              <RTCView
                // @ts-ignore
                streamURL={remoteStream.toURL()}
                style={styles.rtcview}
              />
            </View>
          );
        case !localVideoMuted && remoteVideoMuted:
          return (
            <View style={styles.vidview}>
              <Image
                source={require('./media/video_placeholder.png')}
                style={styles.videoPlaceholder}
              />
              <View style={styles.videoPlaceholder}>
                <Text style={styles.basicText}>NO VIDEO</Text>
              </View>
              <View style={styles.rtc}>
                <RTCView
                  // @ts-ignore
                  streamURL={localStream.toURL()}
                  style={styles.rtcselfview}
                />
              </View>
            </View>
          );
        case localVideoMuted && remoteVideoMuted:
          return (
            <View>
              <Image
                source={require('./media/video_placeholder.png')}
                style={styles.videoPlaceholder}
              />
              <View style={styles.videoPlaceholder}>
                <Text style={styles.basicText}>NO VIDEO</Text>
              </View>
            </View>
          );
        default:
          return (
            <View style={styles.vidview}>
              <RTCView
                // @ts-ignore
                streamURL={remoteStream.toURL()}
                style={styles.rtcview}
              />
              <View style={styles.rtc}>
                <RTCView
                  // @ts-ignore
                  streamURL={localStream.toURL()}
                  style={styles.rtcselfview}
                />
              </View>
            </View>
          );
      }
    } else {
      return <View />;
    }
  }
}

function DialKeypad() {
  const { webRTCState, callServiceId, activeCall } = useAcuMob();

  return (
    <View style={styles.dialKeypad}>
      {webRTCState === 'calling' || webRTCState === 'ringing' ? (
        <View>
          <Text style={styles.callingText}>Calling {callServiceId}</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.callingText}>Service {callServiceId}</Text>
        </View>
      )}
      <View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'1'}
            onPress={() => AculabBaseClass.sendDtmf('1', activeCall)}
          />
          <KeypadButton
            title={'2'}
            onPress={() => AculabBaseClass.sendDtmf('2', activeCall)}
          />
          <KeypadButton
            title={'3'}
            onPress={() => AculabBaseClass.sendDtmf('3', activeCall)}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'4'}
            onPress={() => AculabBaseClass.sendDtmf('4', activeCall)}
          />
          <KeypadButton
            title={'5'}
            onPress={() => AculabBaseClass.sendDtmf('5', activeCall)}
          />
          <KeypadButton
            title={'6'}
            onPress={() => AculabBaseClass.sendDtmf('6', activeCall)}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'7'}
            onPress={() => AculabBaseClass.sendDtmf('7', activeCall)}
          />
          <KeypadButton
            title={'8'}
            onPress={() => AculabBaseClass.sendDtmf('8', activeCall)}
          />
          <KeypadButton
            title={'9'}
            onPress={() => AculabBaseClass.sendDtmf('9', activeCall)}
          />
        </View>
        <View style={styles.callButtonsContainer}>
          <KeypadButton
            title={'*'}
            onPress={() => AculabBaseClass.sendDtmf('*', activeCall)}
          />
          <KeypadButton
            title={'0'}
            onPress={() => AculabBaseClass.sendDtmf('0', activeCall)}
          />
          <KeypadButton
            title={'#'}
            onPress={() => AculabBaseClass.sendDtmf('#', activeCall)}
          />
        </View>
      </View>
    </View>
  );
}

function CallOutComponent() {
  const { callServiceId, callClientId, makeCall } = useAcuMob();

  const [serviceName, setServiceName] = useState(callServiceId);
  const [clientName, setClientName] = useState(callClientId);
  return (
    <View style={styles.inputContainer}>
      <View>
        <Text style={styles.basicText}>Service Name</Text>
        <TextInput
          style={styles.input}
          placeholder={'example: --15993377'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text => setServiceName(deleteSpaces(text))}
          value={serviceName}
          keyboardType={'ascii-capable'}
        />
        <MenuButton
          title={'Call Service'}
          onPress={() => {
            if (serviceName.length > 0) {
              makeCall('service', serviceName);
            }
          }}
        />
      </View>
      <View>
        <Text style={styles.basicText}>Client ID</Text>
        <TextInput
          style={styles.input}
          placeholder={'example: anna123'}
          placeholderTextColor={COLOURS.INPUT_PLACEHOLDER}
          onChangeText={text => setClientName(deleteSpaces(text))}
          value={clientName}
        />
        <MenuButton
          title={'Call Client'}
          onPress={() => {
            if (clientName.length > 0) {
              makeCall('client', clientName);
            }
          }}
        />
      </View>
    </View>
  );
}

function CallDisplayHandler() {
  const { callType, inboundCall } = useAcuMob();

  switch (callType) {
    case 'client':
      return <DisplayClientCall />;
    case 'service':
      return <DialKeypad />;
    default:
      if (inboundCall) {
        // incoming call display
        return (
          <View style={styles.center}>
            <Text style={styles.callingText}>Incoming Call</Text>
            <Text style={styles.callingText}>
              {AculabBaseClass._incomingCallClientId}
            </Text>
          </View>
        );
      } else {
        // idle display
        return (
          <ScrollView>
            <CallOutComponent />
          </ScrollView>
        );
      }
  }
}

function ButtonsIncoming() {
  const { activeCall } = useAcuMob();

  return (
    <View style={styles.callButtonsContainer}>
      <CallButton
        title={'Reject'}
        colour={COLOURS.RED}
        onPress={() => AculabBaseClass.reject(activeCall)}
      />
      <CallButton
        title={'Accept'}
        colour={COLOURS.GREEN}
        onPress={() => AculabBaseClass.answer(activeCall)}
      />
    </View>
  );
}

function ClientCallButtons() {
  const {
    localVideoMuted,
    localMicMuted,
    activeCall,
    setLocalMicMuted,
    setLocalVideoMuted,
  } = useAcuMob();

  var videoIcon: string = '';
  var audioIcon: string = '';
  if (!AculabBaseClass._camera) {
    videoIcon = 'eye-off-outline';
  } else {
    videoIcon = 'eye-outline';
  }
  if (!AculabBaseClass._mic) {
    audioIcon = 'mic-off-outline';
  } else {
    audioIcon = 'mic-outline';
  }
  return (
    <View style={styles.callButtonsContainer}>
      <RoundButton
        iconName={'camera-reverse-outline'}
        onPress={() => AculabBaseClass.swapCam(localVideoMuted, activeCall)}
      />
      <RoundButton
        iconName={videoIcon}
        onPress={() => {
          AculabBaseClass._camera = !AculabBaseClass._camera;
          setLocalVideoMuted(!localVideoMuted);
          AculabBaseClass.mute(activeCall);
        }}
      />
      <RoundButton
        iconName={audioIcon}
        onPress={() => {
          AculabBaseClass._mic = !AculabBaseClass._mic;
          setLocalMicMuted(!localMicMuted);
          AculabBaseClass.mute(activeCall);
        }}
      />
    </View>
  );
}

function MainCallButtons() {
  const { activeCall } = useAcuMob();
  const [speakerOn, setSpeakerOn] = useState(false);

  useEffect(() => {
    turnOnSpeaker(speakerOn);
  }, [speakerOn]);

  return (
    <View style={styles.callButtonsContainer}>
      <CallButton
        title={'Hang up'}
        colour={COLOURS.RED}
        onPress={() => AculabBaseClass.stopCall(activeCall)}
      />
      <CallButton
        title={'Speaker'}
        colour={COLOURS.SPEAKER_BUTTON}
        onPress={() => {
          setSpeakerOn(!speakerOn);
        }}
      />
    </View>
  );
}

function CallButtonsHandler() {
  const { inboundCall, webRTCState, outboundCall, callType } = useAcuMob();
  if (inboundCall && webRTCState === 'incomingCall') {
    //incoming call
    return <ButtonsIncoming />;
  } else if (inboundCall || outboundCall) {
    if (callType === 'client' && webRTCState === 'connected') {
      // client call connected
      return (
        <View>
          <ClientCallButtons />
          <MainCallButtons />
        </View>
      );
    } else {
      // client call not connected or service call
      return <MainCallButtons />;
    }
  } else {
    // idle state
    return <View />;
  }
}

function MainScreen() {
  const { client, registerClient } = useAcuMob();

  if (!client) {
    registerClient();
  }

  return (
    <SafeAreaView style={styles.height100}>
      <CallHeadComponent />
      <View>
        <CallDisplayHandler />
      </View>
      <View style={styles.bottom}>
        <CallButtonsHandler />
      </View>
    </SafeAreaView>
  );
}

export default MainScreen;
