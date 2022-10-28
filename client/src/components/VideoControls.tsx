import { Box, Button, Select } from "grommet";
import {
  Microphone as MicrophoneIcon,
  Video as VideoIcon,
} from "grommet-icons";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { VideoBackgroundMode } from "../constants/interfaces";
import { updateBackgroundMode } from "../reducers/backgroundSlice";
import { updateVideoMuted } from "../reducers/callSlice";
import { getBackgroundMode } from "../selectors/backgroundSelector";
import { getVideoMuted } from "../selectors/callSelector";
import { SignalContext } from "../services/SignalService";
import BlurControls from "./EffectControls/BlurControls";
import MaskControls from "./EffectControls/MaskControls";

const VideoControls = () => {
  const dispatch = useDispatch();
  const signalService = useContext(SignalContext);
  const [mutedAudio, setMuteAudio] = useState(false);
  const mutedVideo = useSelector(getVideoMuted);
  const backgroundMode = useSelector(getBackgroundMode);

  const muteAudio = (muted: boolean) => {
    signalService.enableAudioStream(!muted);
    setMuteAudio(muted);
  };
  const muteVideo = (muted: boolean) => {
    dispatch(updateVideoMuted(muted));
  };

  return (
    <Box
      margin={{ top: "medium" }}
      pad={{ bottom: "medium" }}
      direction="row"
      justify="end"
      align="flex-start"
    >
      {backgroundMode === VideoBackgroundMode.Blur && <BlurControls />}
      {backgroundMode === VideoBackgroundMode.Mask && <MaskControls />}
      <Box direction="row" align="center">
        <Select
          options={Object.values(VideoBackgroundMode)}
          value={backgroundMode}
          onChange={({ option }) => dispatch(updateBackgroundMode(option))}
        />
        <Button
          active
          margin={{ horizontal: "small" }}
          icon={<MicrophoneIcon color={mutedAudio ? "status-error" : "text"} />}
          onClick={() => muteAudio(!mutedAudio)}
        />
        <Button
          active
          icon={<VideoIcon color={mutedVideo ? "status-error" : "text"} />}
          onClick={() => muteVideo(!mutedVideo)}
        />
      </Box>
    </Box>
  );
};

export default VideoControls;
