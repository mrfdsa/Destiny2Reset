import Header from './comp/header.js';
import Raid from './comp/raid.js';
import Vanguard from './comp/vanguard.js';
import Lost from './comp/lost.js';
import Main from './comp/main.js';

import {QueryClientProvider,QueryClient} from '@tanstack/react-query';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
function App() {
  const queryClient = new QueryClient();
  const route = createBrowserRouter([
  {
    path:'/',
    element: <Header />,
    children: [
      {
        path:'/vanguard',
        element: <Vanguard />
      },
      {
        path: '/raid',
        element: <Raid />
      },
      {
        path:'/lost',
        element: <Lost />,
      },
      {
        path:'/',
        element: <Main />
      }
    ]
  },
  
  ])
  return(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={route} />
    </QueryClientProvider>
  )
  
}

export default App;
