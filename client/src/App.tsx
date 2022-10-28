import { Grommet } from "grommet";
import { BrowserRouter } from "react-router-dom";

import { serviceSignalInstance, SignalContext } from "./services/SignalService";
import theme from "./theme";
import Router from "./Router";

import "./App.css";

function App() {
  return (
    <Grommet theme={theme}>
      <BrowserRouter>
        <SignalContext.Provider value={serviceSignalInstance}>
          <Router />
        </SignalContext.Provider>
      </BrowserRouter>
    </Grommet>
  );
}

export default App;
