import { StyleSheet } from 'react-native';
import StackNavigator from './navigation/StackNavigator';
import { Provider } from 'react-redux';
import store from './store';
import { ModalPortal } from 'react-native-modals';
import { UserContext } from './UserContext';
import { decode, encode } from 'base-64'
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

export default function App() {
  if (!global.btoa) { global.btoa = encode }

  if (!global.atob) { global.atob = decode }

  return (
    <>
      <Provider store={store}>
        <UserContext>
          <StackNavigator />
          <ModalPortal />
        </UserContext>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
