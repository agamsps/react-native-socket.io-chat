import RtmEngine from 'agora-react-native-rtm';
import { EventEmitter } from 'events';
import { Logger } from './utils';

const config = require('../agora.config.json');

export default class RtmAdapter extends EventEmitter {

  private readonly client: RtmEngine;
  public uid: string | any;

  constructor() {
    super();
    this.uid = null;
    this.client = new RtmEngine();

    this.client.createInstance(config.appId)

    const newEvents = [
    "JoinChannelSuccess",
    "ConnectionStateChanged",
    "MessageReceived",
    "TokenExpired",
    "PeersOnlineStatusChanged",
    "MemberCountUpdated",
    "ChannelAttributesUpdated",
    "ChannelMessageReceived",
    "ChannelMemberJoined",
    "ChannelMemberLeft",
    "LocalInvitationReceivedByPeer",
    "LocalInvitationAccepted",
    "LocalInvitationRefused",
    "LocalInvitationCanceled",
    "LocalInvitationFailure",
    "RemoteInvitationReceived",
    "RemoteInvitationAccepted",
    "RemoteInvitationRefused",
    "RemoteInvitationCanceled",
    "RemoteInvitationFailure",
      
    ]
    const events = [
      'tokenExpired',
      'remoteInvitationRefused',
      'remoteInvitationFailure',
      'remoteInvitationCanceled',
      'remoteInvitationAccepted',
      'messageReceived',
      'localInvitationRefused',
      'localInvitationReceivedByPeer',
      'localInvitationFailure',
      'localInvitationCanceled',
      'localInvitationAccepted',
      'error',
      'connectionStateChanged',
      'channelMessageReceived',
      'channelMemberLeft',
      'channelMemberJoined',
      'remoteInvitationReceived',
    ];

    events.forEach((event: string) => {
      // @ts-ignore
      this.client.addListener(event, (evt: any) => {
        this.emit(event, evt);
      });
    });
  }

  async login(uid: string): Promise<any> {
  
    this.uid = uid;

    console.log("login user ===", this.uid)
    return this.client.loginV2(
      this.uid
    );
  }

  async logout(): Promise<any> {
    await this.client.logout();
    Logger.log('logout success');
  }

  async join(cid: string): Promise<any> {
    return this.client.joinChannel(cid);
  }

  async leave(cid: string): Promise<any> {
    return this.client.leaveChannel(cid);
  }

  async sendChannelMessage(param: {
    channel: string;
    message: string;
  }): Promise<any> {

    console.log("send msg ===", param.channel)
    return this.client.sendMessage(param.channel, {text : param.message}, {enableHistoricalMessaging : true});
  }

  async destroy(): Promise<any> {
    await this.client.release();
    Logger.log('destroy');
  }
}