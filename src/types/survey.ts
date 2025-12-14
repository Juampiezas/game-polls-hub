export interface Participant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  hasVoted: boolean;
}

export interface SurveyOption {
  id: string;
  text: string;
  votes: number;
}

export interface SurveyQuestion {
  id: string;
  title: string;
  description?: string;
  options: SurveyOption[];
  createdAt: Date;
}

export interface Vote {
  id: string;
  participantEmail: string;
  questionId: string;
  optionId: string;
  votedAt: Date;
}
