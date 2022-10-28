import { Video } from "grommet";
import React, { Ref } from "react";
import styled from "styled-components";

interface IVideoPlayerProps {
  videoRef: Ref<HTMLVideoElement>;
  muteByDefault?: boolean;
}

const FlippedVideo = styled(Video)`
  transform: scaleX(-1);
`;

export const VideoPlayer = ({ muteByDefault, videoRef }: IVideoPlayerProps) => {
  return (
    <FlippedVideo
      fit="cover"
      ref={videoRef}
      muted={muteByDefault}
      controls={false}
    />
  );
};
