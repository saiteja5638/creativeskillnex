import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { categories, months } from '../data/frameworksData'
import Reveal from './Reveal'
import './TrendingFrameworks.css'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="trend-tooltip">
      <p className="trend-tooltip__month">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="trend-tooltip__row">
          <span className="trend-tooltip__dot" style={{ background: p.color }} />
          {p.dataKey}
          <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function TrendingFrameworks() {
  const [activeId, setActiveId] = useState(categories[0].id)
  const [hidden, setHidden] = useState(() => new Set())

  const active = categories.find((c) => c.id === activeId)

  const chartData = useMemo(() => {
    return months.map((month, i) => {
      const row = { month }
      active.items.forEach((item) => {
        row[item.name] = item.data[i].value
      })
      return row
    })
  }, [active])

  const toggleItem = (name) => {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const switchCategory = (id) => {
    setHidden(new Set())
    setActiveId(id)
  }

  return (
    <section className="trending" id="trending">
      <div className="container">
        <Reveal className="trending__head">
          <span className="eyebrow">Section 01 &middot; Market Pulse</span>
          <h2 className="trending__title">Trending frameworks &amp; roles</h2>
          <p className="trending__subtitle">
            A relative interest index across the tracks people are learning
            right now. Pick a lane to see how it&rsquo;s moving.
          </p>
        </Reveal>

        <Reveal delay="0.1s" className="trending__tabs" as="div">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`trending__tab ${cat.id === activeId ? 'is-active' : ''}`}
              onClick={() => switchCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </Reveal>

        <Reveal delay="0.18s" className="trending__panel glass-card">
          <div className="trending__panel-head">
            <div>
              <h3>{active.label}</h3>
              <p>{active.description}</p>
            </div>
          </div>

          <div className="trending__chart">
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#7c8299"
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                />
                <YAxis
                  stroke="#7c8299"
                  tickLine={false}
                  axisLine={false}
                  width={34}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                {active.items.map((item) => (
                  <Line
                    key={item.name}
                    type="monotone"
                    dataKey={item.name}
                    stroke={item.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                    hide={hidden.has(item.name)}
                    isAnimationActive
                    animationDuration={1100}
                    animationEasing="ease-out"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="trending__legend">
            {active.items.map((item) => (
              <button
                key={item.name}
                className={`trending__chip ${hidden.has(item.name) ? 'is-hidden' : ''}`}
                onClick={() => toggleItem(item.name)}
                style={{ '--chip-color': item.color }}
              >
                <span className="trending__chip-dot" />
                {item.name}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default TrendingFrameworks
