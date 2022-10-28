import { useState } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useLoadingPeriod } from "./hooks";
import { CallPage } from "./pages/CallPage";
import { LandingPage } from "./pages/LandingPage";
import { LoadingPage } from "./pages/LoadingPage";
import { isServiceLoading } from "./selectors/peerSelectors";

const Router = () => {
  const history = useHistory();
  const [shouldShowLoading, setShouldShowLoading] = useState(true);

  // Trigger loading sequence based on changes in route
  useLoadingPeriod(() => setShouldShowLoading(false), [shouldShowLoading]);
  history.listen(() => setShouldShowLoading(true));

  const serviceLoading = useSelector(isServiceLoading);

  return (
    <>
      {serviceLoading || shouldShowLoading ? (
        <LoadingPage />
      ) : (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/call/:groupCode">
            <CallPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      )}
    </>
  );
};

export default Router;
