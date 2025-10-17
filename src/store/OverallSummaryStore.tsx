import type { OverallSummary } from "@/types/api-models"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface OverallSummaryStore {
  summaries: Record<number, OverallSummary>
  setSummary: (caseId: number, summary: OverallSummary) => void
  getSummary: (caseId: number) => OverallSummary | null
  clearSummaries: () => void
}

export const useOverallSummaryStore = create<OverallSummaryStore>()(
  persist(
    (set, get) => ({
      summaries: {},

      setSummary: (caseId, summary) =>
        set((state) => ({
          summaries: { ...state.summaries, [caseId]: summary },
        })),

      getSummary: (caseId) => get().summaries[caseId] || null,

      clearSummaries: () => set({ summaries: {} }),
    }),
    {
      name: "case-summary-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
