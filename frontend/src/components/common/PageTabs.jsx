import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * Underlined tab strip that scrolls horizontally on narrow screens.
 * Radix Tabs provides arrow-key navigation and the tab/tabpanel roles.
 */
export function PageTabs({ tabs, value, onValueChange, label, children }) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="flex flex-col gap-5">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <TabsList aria-label={label} className="h-auto w-max min-w-full justify-start gap-1 rounded-none border-b bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-muted-foreground hover:text-heading data-[state=active]:text-link data-[state=active]:border-link -mb-px h-11 flex-none rounded-none border-0 border-b-2 border-transparent px-3 font-semibold shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {tab.icon && <tab.icon className="size-4" strokeWidth={1.75} aria-hidden />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="outline-none">
          {value === tab.value && children(tab.value)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
