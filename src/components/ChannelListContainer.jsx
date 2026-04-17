import React from 'react'
import Cookies from "universal-cookie";
import ChannelSearch from './ChannelSearch.jsx';

const CompanyHeader = () => (
  <div className="channel-list__header">
    <p className="channel-list__header__text">Chats</p>
  </div>
)

const ChannelListContainer = () => {
  return (
    <>
      <div className="channel-list__list__wrapper">
        <CompanyHeader />
        <ChannelSearch />
        {/* <ChannelList
          filters={{}}
          channelRenderFilterFn={() => {}}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              type='team'
              />
              
          )}
           Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              type='team'
            />
          )}
          /> */}
        {/* <ChannelList
          filters={{}}
          channelRenderFilterFn={() => {}}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              type='messaging'
              />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              type='messaging'
            />

          )}
          /> */}
      </div>
    </>
  );
};

export default ChannelListContainer
