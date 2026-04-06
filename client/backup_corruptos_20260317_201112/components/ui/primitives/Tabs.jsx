// src/components/ui/Primitives/Tabs.jsx import * as TabsPrimitive from " @radix ui/React tabs" ;
// Exports con nombre (como ya ten?as)
export const Tabs = TabsPrimitive.Root;
export const TabsList = TabsPrimitive.List;
export const TabsTrigger = TabsPrimitive.Trigger ;
export const TabsContent = TabsPrimitive.Content ;
// ??Export por defecto (para permitir `import Tabs from . . . ` )
export default Tabs;