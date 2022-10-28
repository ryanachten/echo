import { Box, Button, Text } from "grommet";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Background from "../components/Background";
import Logo from "../components/Logo";
import { Routes } from "../constants/routes";
import {
  sonarEffectContent,
  sonarEffectAnimation,
} from "../helpers/sonarEffect";

interface IErrorPageProps {
  errorMessage: string;
}

const AnimatedBackground = styled(Background)`
  &:before {
    z-index: 0;

    ${sonarEffectContent(30)}
  }

  ${sonarEffectAnimation()}
`;

const ErrorContent = styled(Box)`
  z-index: 1;
`;

const ErrorPage = ({ errorMessage }: IErrorPageProps) => {
  const history = useHistory();
  const navigateHome = () => history.push(Routes.Home);

  return (
    <AnimatedBackground align="center" justify="center">
      <ErrorContent align="center" justify="center">
        <Logo />
        <Text
          margin={{
            bottom: "large",
          }}
        >
          Sorry! We couldn't find your call
        </Text>
        <Button label="new call" primary onClick={navigateHome} />
      </ErrorContent>
    </AnimatedBackground>
  );
};

export default ErrorPage;
