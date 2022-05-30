
import { EventEmitter } from 'events';
import { Logger } from './utils';
import PubNub from 'pubnub';
import { usePubNub } from 'pubnub-react';

export default class RtmAdapter2 extends EventEmitter {

  private readonly client: PubNub;
  public uid: string | any;

  constructor() {
    super();
    this.uid = null;

    this.client = usePubNub()

    const newEvents = [
    "Message",
    "Presence"
    ]

    newEvents.forEach((event: string) => {
      // @ts-ignore
      this.client.addListener(event, (evt: any) => {
        this.emit(event, evt);
      });
    });
  }


  async logout(): Promise<any> {
    return null
  }

  async addChannel(cid : string) : Promise<any> {
    return this.client.channelGroups.addChannels(
        {
            channels: [cid],
            channelGroup: "myChannelGroup",
        }
    )

  }
  async join(cid: string): Promise<any> {

    return this.client.subscribe({
        channels : [cid]
    })
  }

  async sendChannelMessage(param: {
    channel: string;
    message: string;
  }): Promise<any> {


    return this.client.publish({
        channel : param.channel,
        message : {text : param.message }
    })

  }

  async destroy(): Promise<any> {
    
  }
}