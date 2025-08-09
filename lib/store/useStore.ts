import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateSessionId } from "@/lib/utils";

export interface Activity {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon_url?: string;
}

export interface Rating {
  activityId: string;
  score: number; // 1-5 for ratings
}

export interface ActivityStatus {
  activityId: string;
  status: "not_tried" | "want_to_try" | null;
}

export interface AnalysisResult {
  id: string;
  categories: Array<{
    name: string;
    score: number;
  }>;
  keywords: string[];
  strengths: string[];
  recommendations: Activity[];
  chartData: any;
}

interface AppState {
  // Session
  sessionId: string;

  // User
  userId: string | null;

  // Ratings
  ratings: Map<string, number>;
  ratedCount: number;

  // Activity Status (안 할거에요, 해보고 싶어요)
  activityStatuses: Map<string, "not_tried" | "want_to_try">;

  // Analysis
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;

  // Actions
  initSession: () => void;
  setUserId: (userId: string | null) => void;
  setRating: (activityId: string, score: number) => void;
  removeRating: (activityId: string) => void;
  setActivityStatus: (
    activityId: string,
    status: "not_tried" | "want_to_try" | null
  ) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  reset: () => void;
  canAnalyze: () => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: "",
      userId: null,
      ratings: new Map(),
      ratedCount: 0,
      activityStatuses: new Map(),
      analysisResult: null,
      isAnalyzing: false,

      // Actions
      initSession: () => {
        const sessionId = generateSessionId();
        set({ sessionId });
      },

      setUserId: (userId) => set({ userId }),

      setRating: (activityId, score) => {
        const { ratings, activityStatuses } = get();
        const newRatings = new Map(ratings);
        const newStatuses = new Map(activityStatuses);

        // If rating exists and new score is different, update
        if (!ratings.has(activityId)) {
          newRatings.set(activityId, score);
          // Clear status when rating is set
          newStatuses.delete(activityId);
          set({
            ratings: newRatings,
            activityStatuses: newStatuses,
            ratedCount: newRatings.size + newStatuses.size,
          });
        } else if (ratings.get(activityId) !== score) {
          newRatings.set(activityId, score);
          set({ ratings: newRatings });
        }
      },

      removeRating: (activityId) => {
        const { ratings, activityStatuses } = get();
        const newRatings = new Map(ratings);
        newRatings.delete(activityId);
        set({
          ratings: newRatings,
          ratedCount: newRatings.size + activityStatuses.size,
        });
      },

      setActivityStatus: (activityId, status) => {
        const { activityStatuses, ratings } = get();
        const newStatuses = new Map(activityStatuses);
        const newRatings = new Map(ratings);

        if (status === null) {
          newStatuses.delete(activityId);
        } else {
          newStatuses.set(activityId, status);
          // Clear rating when status is set
          newRatings.delete(activityId);
        }

        set({
          activityStatuses: newStatuses,
          ratings: newRatings,
          ratedCount: newRatings.size + newStatuses.size,
        });
      },

      setAnalysisResult: (result) => set({ analysisResult: result }),

      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

      reset: () =>
        set({
          ratings: new Map(),
          activityStatuses: new Map(),
          ratedCount: 0,
          analysisResult: null,
          isAnalyzing: false,
        }),

      canAnalyze: () => {
        const { ratedCount } = get();
        return ratedCount >= 20;
      },
    }),
    {
      name: "been-storage",
      partialize: (state) => ({
        sessionId: state.sessionId,
        userId: state.userId,
        ratings: Array.from(state.ratings.entries()),
        activityStatuses: Array.from(state.activityStatuses.entries()),
        ratedCount: state.ratedCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert arrays back to Maps after rehydration
          if (state.ratings) {
            const ratingsArray = state.ratings as unknown as [string, number][];
            state.ratings = new Map(ratingsArray);
          }
          if (state.activityStatuses) {
            const statusesArray = state.activityStatuses as unknown as [
              string,
              "not_tried" | "want_to_try"
            ][];
            state.activityStatuses = new Map(statusesArray);
          }
        }
      },
    }
  )
);
