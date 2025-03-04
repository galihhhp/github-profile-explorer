import React, {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  useEffect,
} from "react";
import styles from "./Tabs.module.css";

// Type definitions for strong typing and developer experience
type TabId = string | number;

interface TabsContextType {
  activeTabId: TabId;
  setActiveTabId: (id: TabId) => void;
  registerTab: (id: TabId, label: React.ReactNode) => void;
}

interface TabsProps {
  defaultTabId?: TabId;
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  onChange?: (tabId: TabId) => void;
  children: React.ReactNode;
}

interface TabProps {
  id: TabId;
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

// Create context for tabs state management
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Main Tabs component
export const Tabs: React.FC<TabsProps> & {
  Tab: React.FC<TabProps>;
} = ({
  defaultTabId,
  children,
  className,
  tabListClassName,
  tabPanelClassName,
  ...props
}) => {
  const tabIds = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child))
    .map((child) => (child as React.ReactElement<TabProps>).props.id);

  const [activeTabId, setActiveTabId] = useState(() => {
    if (defaultTabId && tabIds.includes(defaultTabId)) {
      return defaultTabId;
    }

    return tabIds[0] || "";
  });

  useEffect(() => {
    if (!activeTabId && tabIds.length > 0) {
      setActiveTabId(tabIds[0]);
    }
  }, [tabIds, activeTabId]);

  const handleTabChange = useCallback(
    (id: TabId) => {
      setActiveTabId(id);
      props.onChange?.(id);
    },
    [props.onChange]
  );

  const contextValue = useMemo(
    () => ({
      activeTabId,
      setActiveTabId: handleTabChange,
      registerTab: () => {},
    }),
    [activeTabId, handleTabChange]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`${styles.tabsContainer} ${className}`} role="tablist">
        <div className={`${styles.tabList} ${tabListClassName}`}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child) || child.type !== Tab) return null;
            const { id, label, disabled } = child.props as TabProps;
            const isActive = id === activeTabId;

            return (
              <button
                key={id}
                role="tab"
                id={`tab-${id}`}
                aria-selected={isActive}
                aria-controls={`panel-${id}`}
                className={`${styles.tabButton} ${
                  isActive ? styles.activeTab : ""
                }`}
                disabled={disabled}
                onClick={() => !disabled && handleTabChange(id)}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab content area */}
        <div className={`${styles.tabPanels} ${tabPanelClassName}`}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child) || child.type !== Tab) return null;
            return React.cloneElement(child);
          })}
        </div>
      </div>
    </TabsContext.Provider>
  );
};
// Individual Tab component
const Tab: React.FC<TabProps> = ({
  id,
  label,
  children,
  className = "",
}) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tab must be used within a Tabs component");
  }

  const { activeTabId, registerTab } = context;

  React.useEffect(() => {
    registerTab(id, label);
  }, [id, label, registerTab]);

  if (id !== activeTabId) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={`${styles.tabPanel} ${className}`}>
      {children}
    </div>
  );
};

// Attach Tab as property of Tabs
Tabs.Tab = Tab;
