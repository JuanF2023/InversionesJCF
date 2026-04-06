import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/primitives/Tabs.jsx";

import {
  Utensils,
  Layers,
  List,
  Scale,
  ChefHat,
} from "lucide-react";

import PortionForm from "./forms/PortionForm";
import ComboForm from "./forms/ComboForm";
import CategoryForm from "./forms/CategoryForm";
import UnidadForm from "./forms/UnidadForm";
import PreparacionForm from "./forms/PreparacionForm";

const options = [
  {
    value: "porciones",
    title: "Porciones",
    icon: <Utensils size={20} />,
  },
  {
    value: "combos",
    title: "Combos",
    icon: <Layers size={20} />,
  },
  {
    value: "categorias",
    title: "Categorías",
    icon: <List size={20} />,
  },
  {
    value: "unidades",
    title: "Unidades",
    icon: <Scale size={20} />,
  },
  {
    value: "preparaciones",
    title: "Preparaciones",
    icon: <ChefHat size={20} />,
  },
];

export default function MenuManagement() {
  return (
    <div className="pt-2 px-6 pb-6">
      <div className="flex items-center mb-4 text-white text-2xl font-bold gap-2">
        <span className="text-yellow-400">
          <ChefHat size={28} />
        </span>
        Gestión del Menú
      </div>

      <Tabs defaultValue="porciones" className="w-full">
        <TabsList className="flex gap-2 overflow-x-auto mb-6 px-1 scrollbar-thin scrollbar-thumb-yellow-400">
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className="relative px-4 py-2 font-semibold transition-all duration-200 border-r border-yellow-300 rounded-tl-[10px] rounded-tr-[0]
                data-[state=active]:bg-yellow-400
                data-[state=active]:text-black
                data-[state=inactive]:bg-slate-700
                data-[state=inactive]:text-white
                data-[state=inactive]:hover:bg-slate-600"
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span className="hidden sm:inline">{option.title}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="porciones">
          <PortionForm />
        </TabsContent>
        <TabsContent value="combos">
          <ComboForm />
        </TabsContent>
        <TabsContent value="categorias">
          <CategoryForm />
        </TabsContent>
        <TabsContent value="unidades">
          <UnidadForm />
        </TabsContent>
        <TabsContent value="preparaciones">
          <PreparacionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
