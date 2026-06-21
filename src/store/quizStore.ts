"use client";

import { create } from "zustand";

type QuizState = {
  mood: string;
  setMood: (mood: string) => void;
};

export const useQuizStore = create<QuizState>((set) => ({
  mood: "Tailored",
  setMood: (mood) => set({ mood })
}));
