import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import App from "./App";

// 配置 Ant Design 主题
const theme = {
  token: {
    colorPrimary: '#667eea',
    borderRadius: 6,
    fontFamily: 'PingFang SC, Microsoft YaHei, SimHei, sans-serif',
  },
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
