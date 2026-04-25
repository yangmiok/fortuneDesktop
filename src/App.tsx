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

    if (['bazi', 'ziwei', 'liuyao', 'qimen', 'fengshui'].includes(key)) {
      setActiveTab(key);
    }
  };

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
