import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Gamepad2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSurveyStore } from '@/store/surveyStore';
import { useToast } from '@/hooks/use-toast';

export default function Vote() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { questions, isRegistered, hasVoted, submitVote } = useSurveyStore();
  
  const email = searchParams.get('email') || '';
  const [selectedOptions, setSelectedOptions] = useState<{ [questionId: string]: string }>({});
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'voted' | 'success'>('loading');

  useEffect(() => {
    if (!email) {
      setStatus('invalid');
      return;
    }

    if (!isRegistered(email)) {
      setStatus('invalid');
      return;
    }

    if (hasVoted(email)) {
      setStatus('voted');
      return;
    }

    setStatus('valid');
  }, [email, isRegistered, hasVoted]);

  const handleSubmit = () => {
    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "No hay preguntas disponibles para votar",
        variant: "destructive",
      });
      return;
    }

    // Check all questions answered
    const allAnswered = questions.every(q => selectedOptions[q.id]);
    if (!allAnswered) {
      toast({
        title: "Error",
        description: "Por favor responde todas las preguntas",
        variant: "destructive",
      });
      return;
    }

    // Submit votes
    let success = true;
    for (const question of questions) {
      const optionId = selectedOptions[question.id];
      if (optionId) {
        const result = submitVote(email, question.id, optionId);
        if (!result) {
          success = false;
          break;
        }
      }
    }

    if (success) {
      setStatus('success');
      toast({
        title: "¡Gracias por votar!",
        description: "Tu voto ha sido registrado exitosamente.",
      });
    } else {
      toast({
        title: "Error",
        description: "Hubo un problema al registrar tu voto",
        variant: "destructive",
      });
    }
  };

  // Render different states
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="gaming-card p-8 max-w-md text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Acceso Denegado
          </h1>
          <p className="text-muted-foreground mb-6">
            {!email 
              ? "No se proporcionó un correo electrónico válido en el enlace."
              : "Este correo no está registrado para participar en la encuesta."
            }
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'voted') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="gaming-card p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-warning mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Ya Has Votado
          </h1>
          <p className="text-muted-foreground mb-6">
            Este correo electrónico ya ha participado en la encuesta. Solo se permite un voto por participante.
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="gaming-card p-8 max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            ¡Gracias por Participar!
          </h1>
          <p className="text-muted-foreground mb-6">
            Tu voto ha sido registrado exitosamente. Agradecemos tu participación en nuestra encuesta de videojuegos.
          </p>
          <Button variant="gaming" onClick={() => navigate('/resultados')}>
            Ver Resultados
          </Button>
        </div>
      </div>
    );
  }

  // Valid status - show voting form
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 blur-lg bg-primary/30" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">
                GAME<span className="text-primary">SURVEY</span>
              </h1>
              <p className="text-xs text-muted-foreground">Encuesta de Videojuegos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            ¡Bienvenido a la Encuesta!
          </h2>
          <p className="text-muted-foreground">
            Votando como: <span className="text-primary font-medium">{email}</span>
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="gaming-card p-12 text-center text-muted-foreground">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay preguntas disponibles en este momento</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <div 
                key={question.id} 
                className="gaming-card p-6 animate-fade-in"
                style={{ animationDelay: `${qIndex * 100}ms` }}
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {qIndex + 1}. {question.title}
                </h3>
                {question.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {question.description}
                  </p>
                )}

                <div className="grid gap-2">
                  {question.options.map((option) => {
                    const isSelected = selectedOptions[question.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOptions(prev => ({ 
                          ...prev, 
                          [question.id]: option.id 
                        }))}
                        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className={isSelected ? 'font-medium' : ''}>
                            {option.text}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-4">
              <Button 
                variant="gaming" 
                size="xl" 
                onClick={handleSubmit}
                className="min-w-[200px]"
              >
                Enviar Votos
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
