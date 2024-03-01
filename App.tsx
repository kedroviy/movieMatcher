import { Provider } from 'react-redux';
import AppContainer from './src/app';
import { store } from './src/redux/configure-store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>);
}

export default App;
