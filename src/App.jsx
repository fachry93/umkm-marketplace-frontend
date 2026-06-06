import { RouterProvider } from 'react-router-dom';
import { AppRouter } from './presentation/router/AppRouter';

function App() {
  return <RouterProvider router={AppRouter} />;
}
export default App;
