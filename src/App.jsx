import { useState } from 'react'
import './App.css'

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`

const initialTabs = [
  {
    id: createId(),
    name: 'Gym Workout',
    attributes: [
      { id: createId(), label: 'Focus', value: 'Upper body' },
      { id: createId(), label: 'Duration', value: '45 min' },
    ],
  },
  {
    id: createId(),
    name: 'Study Sprint',
    attributes: [
      { id: createId(), label: 'Subject', value: 'Calculus' },
      { id: createId(), label: 'Goal', value: '3 practice sets' },
    ],
  },
]

function App() {
  const [tabs, setTabs] = useState(initialTabs)
  const [activeTabId, setActiveTabId] = useState(initialTabs[0].id)
  const [newTabName, setNewTabName] = useState('')
  const [attributeDraft, setAttributeDraft] = useState({ label: '', value: '' })

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  const handleAddTab = (event) => {
    event.preventDefault()
    const trimmedName = newTabName.trim()
    if (!trimmedName) return

    const newTab = {
      id: createId(),
      name: trimmedName,
      attributes: [],
    }
    setTabs((prevTabs) => [...prevTabs, newTab])
    setActiveTabId(newTab.id)
    setNewTabName('')
  }

  const handleRemoveTab = (tabId) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId))
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter((tab) => tab.id !== tabId)
      setActiveTabId(remainingTabs[0]?.id ?? '')
    }
  }

  const handleTabNameChange = (event) => {
    const newName = event.target.value
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, name: newName } : tab
      )
    )
  }

  const handleAttributeChange = (attributeId, field, value) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id !== activeTabId) return tab
        return {
          ...tab,
          attributes: tab.attributes.map((attribute) =>
            attribute.id === attributeId
              ? { ...attribute, [field]: value }
              : attribute
          ),
        }
      })
    )
  }

  const handleAddAttribute = (event) => {
    event.preventDefault()
    if (!activeTab) return
    const trimmedLabel = attributeDraft.label.trim()
    if (!trimmedLabel) return

    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              attributes: [
                ...tab.attributes,
                {
                  id: createId(),
                  label: trimmedLabel,
                  value: attributeDraft.value.trim(),
                },
              ],
            }
          : tab
      )
    )
    setAttributeDraft({ label: '', value: '' })
  }

  const handleRemoveAttribute = (attributeId) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              attributes: tab.attributes.filter(
                (attribute) => attribute.id !== attributeId
              ),
            }
          : tab
      )
    )
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Dynamic Tracker</p>
          <h1>Flexible tracking for workouts, study, appointments, and more.</h1>
        </div>
        <form className="tab-form" onSubmit={handleAddTab}>
          <label htmlFor="tabName">New tab</label>
          <div className="tab-form__controls">
            <input
              id="tabName"
              name="tabName"
              type="text"
              placeholder="e.g. Meal Plan"
              value={newTabName}
              onChange={(event) => setNewTabName(event.target.value)}
            />
            <button type="submit">Add tab</button>
          </div>
        </form>
      </header>

      <section className="tabs">
        <div className="tabs__list" role="tablist" aria-label="Tracking tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tabs__button${
                tab.id === activeTabId ? ' tabs__button--active' : ''
              }`}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              role="tab"
              aria-selected={tab.id === activeTabId}
            >
              <span>{tab.name}</span>
              <span className="tabs__count">{tab.attributes.length}</span>
            </button>
          ))}
        </div>
        {activeTab ? (
          <div className="tab-panel" role="tabpanel">
            <div className="tab-panel__header">
              <div>
                <p className="tab-panel__label">Active tab</p>
                <input
                  className="tab-panel__title"
                  value={activeTab.name}
                  onChange={handleTabNameChange}
                />
              </div>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => handleRemoveTab(activeTab.id)}
              >
                Remove tab
              </button>
            </div>

            <div className="tab-panel__grid">
              <div className="attributes">
                <div className="attributes__header">
                  <h2>Attributes</h2>
                  <p>Track details, metrics, or reminders for this tab.</p>
                </div>

                {activeTab.attributes.length === 0 ? (
                  <div className="empty-state">
                    <p>No attributes yet. Add your first field below.</p>
                  </div>
                ) : (
                  <div className="attributes__list">
                    {activeTab.attributes.map((attribute) => (
                      <div key={attribute.id} className="attribute-card">
                        <label>
                          Label
                          <input
                            type="text"
                            value={attribute.label}
                            onChange={(event) =>
                              handleAttributeChange(
                                attribute.id,
                                'label',
                                event.target.value
                              )
                            }
                          />
                        </label>
                        <label>
                          Value
                          <input
                            type="text"
                            value={attribute.value}
                            onChange={(event) =>
                              handleAttributeChange(
                                attribute.id,
                                'value',
                                event.target.value
                              )
                            }
                          />
                        </label>
                        <button
                          type="button"
                          className="button button--ghost"
                          onClick={() => handleRemoveAttribute(attribute.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="attribute-form">
                <h2>Add attribute</h2>
                <p>
                  Use attributes to capture what matters: duration, focus, notes,
                  or any custom detail.
                </p>
                <form onSubmit={handleAddAttribute}>
                  <label htmlFor="attributeLabel">Label</label>
                  <input
                    id="attributeLabel"
                    type="text"
                    placeholder="e.g. Duration"
                    value={attributeDraft.label}
                    onChange={(event) =>
                      setAttributeDraft((prev) => ({
                        ...prev,
                        label: event.target.value,
                      }))
                    }
                  />
                  <label htmlFor="attributeValue">Value</label>
                  <input
                    id="attributeValue"
                    type="text"
                    placeholder="e.g. 30 min"
                    value={attributeDraft.value}
                    onChange={(event) =>
                      setAttributeDraft((prev) => ({
                        ...prev,
                        value: event.target.value,
                      }))
                    }
                  />
                  <button type="submit">Add attribute</button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state empty-state--panel">
            <h2>Create your first tab</h2>
            <p>Add a tab to start tracking anything you want.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
