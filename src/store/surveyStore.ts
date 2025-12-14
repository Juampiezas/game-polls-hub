import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Participant, SurveyQuestion, Vote, SurveyOption } from '@/types/survey';

interface SurveyStore {
  participants: Participant[];
  questions: SurveyQuestion[];
  votes: Vote[];
  
  // Participant actions
  addParticipant: (participant: Omit<Participant, 'id' | 'createdAt' | 'hasVoted'>) => void;
  removeParticipant: (id: string) => void;
  
  // Question actions
  addQuestion: (question: Omit<SurveyQuestion, 'id' | 'createdAt' | 'options'> & { options: string[] }) => void;
  removeQuestion: (id: string) => void;
  addOptionToQuestion: (questionId: string, optionText: string) => void;
  removeOptionFromQuestion: (questionId: string, optionId: string) => void;
  
  // Vote actions
  submitVote: (email: string, questionId: string, optionId: string) => boolean;
  hasVoted: (email: string) => boolean;
  isRegistered: (email: string) => boolean;
  getVotesByQuestion: (questionId: string) => Record<string, number>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set, get) => ({
      participants: [],
      questions: [],
      votes: [],

      addParticipant: (participant) => {
        const exists = get().participants.some(p => p.email.toLowerCase() === participant.email.toLowerCase());
        if (exists) return;
        
        set((state) => ({
          participants: [...state.participants, {
            ...participant,
            id: generateId(),
            createdAt: new Date(),
            hasVoted: false,
          }],
        }));
      },

      removeParticipant: (id) => {
        set((state) => ({
          participants: state.participants.filter(p => p.id !== id),
        }));
      },

      addQuestion: (question) => {
        const options: SurveyOption[] = [
          ...question.options.map(text => ({ id: generateId(), text, votes: 0 })),
          { id: generateId(), text: 'No sé', votes: 0 },
          { id: generateId(), text: 'Ninguno', votes: 0 },
        ];

        set((state) => ({
          questions: [...state.questions, {
            id: generateId(),
            title: question.title,
            description: question.description,
            options,
            createdAt: new Date(),
          }],
        }));
      },

      removeQuestion: (id) => {
        set((state) => ({
          questions: state.questions.filter(q => q.id !== id),
          votes: state.votes.filter(v => v.questionId !== id),
        }));
      },

      addOptionToQuestion: (questionId, optionText) => {
        set((state) => ({
          questions: state.questions.map(q => {
            if (q.id !== questionId) return q;
            const newOptions = [...q.options];
            // Insert before "No sé" and "Ninguno"
            const insertIndex = newOptions.length - 2;
            newOptions.splice(insertIndex, 0, { id: generateId(), text: optionText, votes: 0 });
            return { ...q, options: newOptions };
          }),
        }));
      },

      removeOptionFromQuestion: (questionId, optionId) => {
        set((state) => ({
          questions: state.questions.map(q => {
            if (q.id !== questionId) return q;
            return { ...q, options: q.options.filter(o => o.id !== optionId) };
          }),
        }));
      },

      submitVote: (email, questionId, optionId) => {
        const state = get();
        const normalizedEmail = email.toLowerCase();
        
        // Check if registered
        const participant = state.participants.find(p => p.email.toLowerCase() === normalizedEmail);
        if (!participant) return false;
        
        // Check if already voted
        const hasVotedAlready = state.votes.some(v => v.participantEmail.toLowerCase() === normalizedEmail);
        if (hasVotedAlready) return false;

        set((state) => ({
          votes: [...state.votes, {
            id: generateId(),
            participantEmail: normalizedEmail,
            questionId,
            optionId,
            votedAt: new Date(),
          }],
          participants: state.participants.map(p => 
            p.email.toLowerCase() === normalizedEmail ? { ...p, hasVoted: true } : p
          ),
          questions: state.questions.map(q => {
            if (q.id !== questionId) return q;
            return {
              ...q,
              options: q.options.map(o => 
                o.id === optionId ? { ...o, votes: o.votes + 1 } : o
              ),
            };
          }),
        }));

        return true;
      },

      hasVoted: (email) => {
        return get().votes.some(v => v.participantEmail.toLowerCase() === email.toLowerCase());
      },

      isRegistered: (email) => {
        return get().participants.some(p => p.email.toLowerCase() === email.toLowerCase());
      },

      getVotesByQuestion: (questionId) => {
        const question = get().questions.find(q => q.id === questionId);
        if (!question) return {};
        
        return question.options.reduce((acc, option) => {
          acc[option.id] = option.votes;
          return acc;
        }, {} as Record<string, number>);
      },
    }),
    {
      name: 'gaming-survey-storage',
    }
  )
);
