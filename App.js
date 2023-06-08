import { Provider } from "react-redux";

import { store } from "./store";
import StackNavigator from "./StackNavigator";

// TODO: Press on logo clears all inputs: ref to inputs
// TODO: MapScreen Inputs

export default function App() {
  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
}
