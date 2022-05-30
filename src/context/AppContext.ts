import React from 'react';

import { Channel as ChannelType} from 'stream-chat';

type AppContextType = {
  channel: any | undefined;
  setChannel: (channel: ChannelType) => void;
};

export const AppContext = React.createContext({} as AppContextType);
