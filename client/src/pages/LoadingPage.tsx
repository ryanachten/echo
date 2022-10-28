import { Box } from "grommet";
import styled from "styled-components";
import Background from "../components/Background";
import Logo from "../components/Logo";
import {
  sonarEffectAnimation,
  sonarEffectContent,
} from "../helpers/sonarEffect";

const ClippedBackground = styled(Background)`
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  position: relative;
`;

const Animation = styled.div`
  &:before {
    ${sonarEffectContent(40)}
  }
  &:after {
    ${sonarEffectContent(20)}
  }

  ${sonarEffectAnimation()}
`;

export const LoadingPage = () => {
  return (
    <ClippedBackground justify="center" align="center">
      <Animation>
        <Box direction="column" align="center">
          <Logo />
        </Box>
      </Animation>
    </ClippedBackground>
  );
};
