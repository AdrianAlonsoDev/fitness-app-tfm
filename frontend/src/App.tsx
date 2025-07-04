import './styles/global.css';

import { ThemeProvider } from './theme/theme-provider';

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
