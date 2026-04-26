import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { MainLayout, TabPanel } from './components';
import { useAppStore } from './store';
import './App.css';

function App() {
  const { 
    ui: { sidebarCollapsed, activeMenu },
    toggleSidebar,
    setActiveMenu,
    setActiveTab
  } = useAppStore();

  const handleMenuSelect = (key: string) => {
    setActiveMenu(key);

    if (['bazi', 'ziwei', 'liuyao', 'qimen', 'fengshui', 'physiognomy'].includes(key)) {
      setActiveTab(key);
    }
  };

  useEffect(() => {
    const applyWindowIcon = async () => {
      try {
        await getCurrentWindow().setIcon('/app-icon.png');
      } catch (error) {
        console.warn('无法设置窗口图标:', error);
      }
    };

    applyWindowIcon();
  }, []);

  return (
    <div className="fortune-app">
      <MainLayout
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        activeMenuItem={activeMenu}
        onMenuSelect={handleMenuSelect}
      >
        <TabPanel />
      </MainLayout>
    </div>
  );
}

export default App;
