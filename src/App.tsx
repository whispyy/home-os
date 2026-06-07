import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { OSProvider } from './context/OSContext';
import { WindowProvider } from './context/WindowContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { useIsMobile } from './hooks/useMediaQuery';
import Desktop from './components/desktop/Desktop';
import Springboard from './components/mobile/Springboard';

function Shell() {
  const isMobile = useIsMobile();
  return isMobile ? <Springboard /> : <Desktop />;
}

export default function App() {
  return (
    <OSProvider>
      <WindowProvider>
        <DndProvider backend={HTML5Backend}>
          <GlobalStyles />
          <Shell />
        </DndProvider>
      </WindowProvider>
    </OSProvider>
  );
}
