import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
)
