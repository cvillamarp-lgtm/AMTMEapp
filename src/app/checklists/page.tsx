'use client';

import { Badge, Card } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';

export default function ChecklistsPage() {
  const { state, setState } = useStudio();

  const toggleItem = (checklistId: string, itemId: string) => {
    setState((current) => ({
      ...current,
      checklists: current.checklists.map((checklist) => {
        if (checklist.id !== checklistId) return checklist;
        return {
          ...checklist,
          items: checklist.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
          status: checklist.items.every((item) =>
            item.id === itemId ? !item.completed : item.completed
          )
            ? 'Listo'
            : 'En proceso',
        };
      }),
    }));
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.checklists.map((checklist) => {
          const completed = checklist.items.filter((item) => item.completed).length;
          return (
            <Card key={checklist.id}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-black/40">
                    {checklist.area}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-[#0C1F36]">{checklist.name}</h2>
                </div>
                <Badge
                  tone={
                    checklist.status === 'Listo'
                      ? 'good'
                      : checklist.status === 'En proceso'
                        ? 'accent'
                        : 'neutral'
                  }
                >
                  {checklist.status}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-black/55">Frecuencia: {checklist.frequency}</p>
              <p className="mt-2 text-sm text-black/55">
                Listos {completed}/{checklist.items.length}
              </p>
              <div className="mt-4 space-y-2">
                {checklist.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(checklist.id, item.id)}
                    className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${item.completed ? 'border-[#0C1F36] bg-[#0C1F36] text-white' : 'border-black/8 bg-[#F5F2EA] text-[#0C1F36] hover:bg-white'}`}
                  >
                    {item.item}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-black/8 bg-white p-3 text-sm text-black/55">
                <div className="font-medium text-[#0C1F36]">Lista para entregar</div>
                <p className="mt-2 leading-6">{checklist.readyCriteria}</p>
                <p className="mt-2 leading-6">Evitar: {checklist.errorsToAvoid}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
