import { MainLayout, TabPanel } from './components';
import { useAppStore } from './store';
import './App.css';

function App() {
  const { 
    ui: { sidebarCollapsed, activeTab },
    toggleSidebar,
    setActiveTab
  } = useAppStore();

  const handleMenuSelect = (key: string) => {
    setActiveTab(key);
    console.log('选择菜单项:', key);
  };

  return (
    <div className="fortune-app">
      <MainLayout
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        activeMenuItem={activeTab}
        onMenuSelect={handleMenuSelect}
      >
        <TabPanel />
      </MainLayout>
    </div>
  );
}

export default App;