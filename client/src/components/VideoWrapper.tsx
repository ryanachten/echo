import { Box, Text } from "grommet";
import { ReactNode } from "react";
import styled from "styled-components";

interface IVideoWrapperProps {
  children: ReactNode;
  subtitle: string;
}

const Wrapper = styled(Box)`
  position: relative;
`;

const MetaWrapper = styled(Box)`
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 2;
`;

const VideoWrapper = ({ children, subtitle }: IVideoWrapperProps) => {
  return (
    <Wrapper background="light-4">
      <MetaWrapper background="background" pad="small" margin="medium">
        <Text>{subtitle}</Text>
      </MetaWrapper>
      {children}
    </Wrapper>
  );
};

export default VideoWrapper;
