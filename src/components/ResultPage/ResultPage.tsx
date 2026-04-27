import React from 'react';
import { Button, Empty, Skeleton, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { TAB_ITEMS } from '../../constants';
import { useAppStore } from '../../store';
import './ResultPage.css';

const ResultPage: React.FC = () => {
  const {
    ui: { activeTab },
    results: { current, loading, error },
    setCurrentView
  } = useAppStore();

  const activeLabel = TAB_ITEMS.find((item) => item.key === activeTab)?.label ?? '测算结果';

  if (loading) {
    return (
      <div className="result-page">
        <section className="result-hero">
          <div className="result-hero-topline">
            <Tag className="result-pill">正在生成结果</Tag>
            <span className="result-topline-copy">请稍候，页面结构已就位，正在等待结果写入。</span>
          </div>
          <Skeleton active paragraph={{ rows: 3 }} title={{ width: '42%' }} />
        </section>

        <section className="result-band">
          <Skeleton active paragraph={{ rows: 8 }} title={{ width: '28%' }} />
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-page">
        <section className="result-band result-band-centered">
          <Empty
            description={error}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            className="result-primary-button"
            onClick={() => setCurrentView('form')}
          >
            返回修改
          </Button>
        </section>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="result-page">
        <section className="result-band result-band-centered">
          <Empty
            description="还没有可展示的测算结果"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            className="result-primary-button"
            onClick={() => setCurrentView('form')}
          >
            返回填写
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="result-page">
      <section className="result-hero">
        <div className="result-hero-topline">
          <Tag className="result-pill">结果预览页</Tag>
          <span className="result-topline-copy">{activeLabel}</span>
        </div>

        <div className="result-hero-header">
          <div>
            <h1>{current.title}</h1>
            <p>{current.summary}</p>
          </div>

          <div className="result-hero-actions">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setCurrentView('form')}
            >
              返回修改
            </Button>
            <Button
              type="primary"
              className="result-primary-button"
              icon={<ReloadOutlined />}
              onClick={() => setCurrentView('form')}
            >
              重新测算
            </Button>
          </div>
        </div>

        <div className="result-hero-meta">
          <span>
            <ClockCircleOutlined />
            {current.generatedAt}
          </span>
          <span>
            <SafetyCertificateOutlined />
            当前为前端承接页，后续可直接对接 API 返回内容
          </span>
        </div>
      </section>

      <section className="result-metrics-grid">
        {current.metrics.map((metric) => (
          <article key={metric.label} className="result-metric-tile">
            <span className="result-metric-label">{metric.label}</span>
            <strong className="result-metric-value">{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="result-layout">
        <div className="result-main">
          <section className="result-band">
            <div className="result-band-head">
              <h2>{current.subtitle}</h2>
              <div className="result-highlight-row">
                {current.highlights.map((highlight) => (
                  <span key={highlight} className="result-highlight-chip">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <div className="result-section-stack">
              {current.sections.map((section) => (
                <article key={section.title} className="result-copy-block">
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="result-band">
            <div className="result-band-head">
              <h2>下一步建议</h2>
              <span>更像顾问给你的落地动作</span>
            </div>

            <ol className="result-suggestion-list">
              {current.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="result-side">
          <section className="result-band">
            <div className="result-band-head">
              <h2>本次输入</h2>
              <span>用于确认测算上下文</span>
            </div>

            <dl className="result-input-list">
              {current.inputSummary.map((item) => (
                <div key={item.label} className="result-input-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="result-band">
            <div className="result-band-head">
              <h2>页面说明</h2>
              <span>这部分先替 API 占住位</span>
            </div>

            <ul className="result-note-list">
              {current.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
};

export default ResultPage;
