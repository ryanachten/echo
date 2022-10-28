import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Form, FormField, Heading, TextInput } from "grommet";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Routes } from "../constants/routes";
import { updateUserName } from "../reducers/userSlice";
import { SignalContext } from "../services/SignalService";
import { useSelector } from "react-redux";
import { getPeerGroup } from "../selectors/peerSelectors";
import Background from "../components/Background";
import styled, { CSSProperties } from "styled-components";
import Logo from "../components/Logo";
import theme from "../theme";

const disabledContainerStyles: CSSProperties = {
  opacity: 0.3,
};

const brandColor = theme.global?.colors?.brand;
const LogoWrapper = styled(Box)`
  border-radius: 50%;
  box-shadow: 0 0 40px 20px ${brandColor};
  height: 140px;
  width: 140px;
`;

export const LandingPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const signalService = useContext(SignalContext);
  const group = useSelector(getPeerGroup);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");

  // Automatically navigate after group has been created and responded by API
  useEffect(() => {
    if (group && shouldNavigate) {
      history.push(`${Routes.CallPage}/${group.groupCode}`);
      setShouldNavigate(false);
    }
  }, [group?.groupCode]);

  const onSubmitNewGroup = () => {
    if (groupName) {
      signalService.sendNewGroup(groupName);
      dispatch(updateUserName(userName));
      setShouldNavigate(true);
    }
  };

  const onSubmitExistingGroup = () => {
    if (groupCode) {
      dispatch(updateUserName(userName));
      history.push(`${Routes.CallPage}/${groupCode}`);
    }
  };

  const JoinCallFields = (
    <Box style={groupName ? disabledContainerStyles : {}}>
      <Heading size="small">Join call</Heading>
      <FormField name="call-code" htmlFor="call-code-input" label="Call code">
        <TextInput
          id="call-code"
          name="Call code"
          placeholder="Enter an existing call code"
          disabled={Boolean(groupName)}
          value={groupCode}
          onChange={(e) => setGroupCode(e.currentTarget.value)}
        />
      </FormField>
    </Box>
  );

  const CreateCallFields = (
    <Box style={groupCode ? disabledContainerStyles : {}}>
      <Heading size="small">Create call</Heading>
      <FormField
        name="call name"
        htmlFor="call-name-input"
        label="Call name"
        margin={{
          right: "xlarge",
        }}
      >
        <TextInput
          id="call-name-input"
          name="Call name"
          placeholder="Enter a call name"
          disabled={Boolean(groupCode)}
          value={groupName}
          onChange={(e) => setGroupName(e.currentTarget.value)}
        />
      </FormField>
    </Box>
  );

  const showSubmitButton = userName && (groupName || groupCode);

  return (
    <Background
      align="center"
      pad={{
        bottom: "xlarge",
      }}
    >
      <Form>
        <LogoWrapper
          align="center"
          justify="center"
          margin={{
            horizontal: "auto",
            top: "xlarge",
            bottom: "xlarge",
          }}
        >
          <Logo size="h1" />
        </LogoWrapper>
        <Box
          direction="row"
          border="bottom"
          pad={{
            horizontal: "large",
            bottom: "large",
          }}
        >
          <FormField name="name" htmlFor="name-input" label="Display name">
            <TextInput
              id="name-input"
              name="name"
              placeholder="Enter a username"
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
            />
          </FormField>
        </Box>
        <Box
          direction="row"
          border={showSubmitButton ? "bottom" : false}
          pad={{
            horizontal: "large",
            vertical: "large",
          }}
          margin={{
            bottom: "large",
          }}
        >
          {CreateCallFields}
          {JoinCallFields}
        </Box>
        {showSubmitButton && (
          <Box direction="row" justify="center">
            {groupCode && (
              <Button
                type="submit"
                primary
                label="Join call"
                onClick={onSubmitExistingGroup}
              />
            )}
            {groupName && (
              <Button
                type="submit"
                primary
                label="Create a call"
                onClick={onSubmitNewGroup}
              />
            )}
          </Box>
        )}
      </Form>
    </Background>
  );
};
