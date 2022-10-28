import { Box, Button, Header, Text } from "grommet";
import { Link, Checkmark } from "grommet-icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import Background from "../components/Background";
import Logo from "../components/Logo";
import VideoChat from "../components/VideoChat";
import VideoControls from "../components/VideoControls";
import { Routes } from "../constants/routes";
import { getPeerGroup, getPeerGroupError } from "../selectors/peerSelectors";
import { SignalContext } from "../services/SignalService";
import theme from "../theme";
import ErrorPage from "./ErrorPage";
import { LoadingPage } from "./LoadingPage";

interface CallPageParams {
  groupCode: string;
}

const branchColor = theme.global?.colors?.brand as string;
const CheckIcon = styled(Checkmark)`
  background: ${branchColor};
  border-radius: 50%;
  padding: 3px;
`;

export const CallPage = () => {
  const history = useHistory();
  const { groupCode } = useParams<CallPageParams>();
  const group = useSelector(getPeerGroup);
  const groupError = useSelector(getPeerGroupError);
  const signalService = useContext(SignalContext);
  const [copiedLink, setCopiedLink] = useState(false);

  const navigateHome = () => history.push(Routes.Home);

  useEffect(() => {
    signalService.sendAddToGroup(groupCode);
  }, []);

  const onLinkClick = useCallback(() => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
  }, []);

  if (!group && !groupError) {
    return <LoadingPage />;
  }
  if (groupError) {
    return <ErrorPage errorMessage={groupError} />;
  }
  return (
    <Background pad="large">
      <Header pad="small">
        <Logo size="h1" />
        <Box direction="row" align="flex-end">
          <Box
            margin={{
              right: "small",
            }}
          >
            <Text weight="bold">Call</Text>
            <Button
              active
              label={group?.groupName}
              badge={
                copiedLink && <CheckIcon color="background" size="small" />
              }
              secondary
              reverse
              icon={<Link color="text" />}
              onClick={onLinkClick}
            />
          </Box>
          <Button label="new call" primary onClick={navigateHome} />
        </Box>
      </Header>
      <VideoChat />
      <VideoControls />
    </Background>
  );
};
