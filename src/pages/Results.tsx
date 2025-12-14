import { BarChart3, Trophy, Users, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSurveyStore } from '@/store/surveyStore';

export default function Results() {
  const { questions, participants, votes } = useSurveyStore();

  const totalVotes = votes.length;
  const participationRate = participants.length > 0 
    ? Math.round((totalVotes / participants.length) * 100) 
    : 0;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground tracking-wide mb-2">
          Resultados de la Encuesta
        </h1>
        <p className="text-muted-foreground">
          Visualiza los resultados de las votaciones en tiempo real
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="gaming-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Participantes</p>
              <p className="text-2xl font-display font-bold text-foreground">{participants.length}</p>
            </div>
          </div>
        </div>
        <div className="gaming-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Votos Recibidos</p>
              <p className="text-2xl font-display font-bold text-foreground">{totalVotes}</p>
            </div>
          </div>
        </div>
        <div className="gaming-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/10">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasa de Participación</p>
              <p className="text-2xl font-display font-bold text-foreground">{participationRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results by Question */}
      {questions.length === 0 ? (
        <div className="gaming-card p-12 text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay preguntas para mostrar resultados</p>
          <p className="text-sm mt-1">Crea preguntas primero para ver los resultados</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, qIndex) => {
            const totalQuestionVotes = question.options.reduce((sum, opt) => sum + opt.votes, 0);
            const sortedOptions = [...question.options].sort((a, b) => b.votes - a.votes);
            const winner = sortedOptions[0];

            return (
              <div 
                key={question.id} 
                className="gaming-card p-6 animate-fade-in"
                style={{ animationDelay: `${qIndex * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {question.title}
                    </h3>
                    {question.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {question.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      Total de votos: {totalQuestionVotes}
                    </p>
                  </div>
                  {totalQuestionVotes > 0 && winner.votes > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20">
                      <Trophy className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium text-warning">
                        {winner.text}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {sortedOptions.map((option, index) => {
                    const percentage = totalQuestionVotes > 0 
                      ? Math.round((option.votes / totalQuestionVotes) * 100) 
                      : 0;
                    const isWinner = index === 0 && option.votes > 0;

                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className={`font-medium ${isWinner ? 'text-warning' : 'text-foreground'}`}>
                            {isWinner && <Trophy className="inline h-3 w-3 mr-1" />}
                            {option.text}
                          </span>
                          <span className="text-muted-foreground">
                            {option.votes} votos ({percentage}%)
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-secondary overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isWinner 
                                ? 'bg-gradient-to-r from-primary to-warning' 
                                : 'bg-primary/60'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
