import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@packages/shared/src/store/store';
import './bootstrap.css';
import Grades from './Grades';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <Grades />
  </Provider>
);