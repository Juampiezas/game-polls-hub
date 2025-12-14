import { useState } from 'react';
import { Plus, Trash2, ClipboardList, Gamepad2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSurveyStore } from '@/store/surveyStore';
import { useToast } from '@/hooks/use-toast';

export default function Questions() {
  const { questions, addQuestion, removeQuestion, addOptionToQuestion, removeOptionFromQuestion } = useSurveyStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', '', ''],
  });
  const [newOption, setNewOption] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validOptions = formData.options.filter(o => o.trim() !== '');
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un título para la pregunta",
        variant: "destructive",
      });
      return;
    }

    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Debes agregar al menos 2 opciones",
        variant: "destructive",
      });
      return;
    }

    addQuestion({
      title: formData.title,
      description: formData.description,
      options: validOptions,
    });

    setFormData({ title: '', description: '', options: ['', '', ''] });
    toast({
      title: "¡Pregunta creada!",
      description: "La pregunta ha sido agregada exitosamente.",
    });
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const addOptionField = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const handleAddNewOption = (questionId: string) => {
    const optionText = newOption[questionId]?.trim();
    if (!optionText) {
      toast({
        title: "Error",
        description: "Por favor ingresa el texto de la opción",
        variant: "destructive",
      });
      return;
    }

    addOptionToQuestion(questionId, optionText);
    setNewOption(prev => ({ ...prev, [questionId]: '' }));
    toast({
      title: "¡Opción agregada!",
      description: "La opción ha sido añadida a la pregunta.",
    });
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground tracking-wide mb-2">
          Preguntas de la Encuesta
        </h1>
        <p className="text-muted-foreground">
          Crea las preguntas y opciones para tu encuesta de videojuegos
        </p>
      </div>

      {/* Add Question Form */}
      <div className="gaming-card p-6 mb-8">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Nueva Pregunta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Pregunta</Label>
              <Input
                id="title"
                placeholder="Ej: ¿Cuál es tu videojuego favorito?"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                placeholder="Descripción adicional..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Opciones de Respuesta</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Las opciones "No sé" y "Ninguno" se agregan automáticamente
            </p>
            <div className="grid gap-2 md:grid-cols-3">
              {formData.options.map((option, index) => (
                <Input
                  key={index}
                  placeholder={`Opción ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={addOptionField} className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              Agregar opción
            </Button>
          </div>

          <Button type="submit" variant="gaming" size="lg">
            Crear Pregunta
          </Button>
        </form>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold text-foreground">
          Preguntas Creadas ({questions.length})
        </h2>

        {questions.length === 0 ? (
          <div className="gaming-card p-12 text-center text-muted-foreground">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay preguntas creadas</p>
            <p className="text-sm mt-1">Crea tu primera pregunta usando el formulario de arriba</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div 
              key={question.id} 
              className="gaming-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {question.title}
                  </h3>
                  {question.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {question.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    removeQuestion(question.id);
                    toast({
                      title: "Pregunta eliminada",
                      description: "La pregunta ha sido removida de la encuesta.",
                    });
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Opciones:</Label>
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm"
                    >
                      <span>{option.text}</span>
                      <span className="text-xs text-muted-foreground">({option.votes})</span>
                      {!['No sé', 'Ninguno'].includes(option.text) && (
                        <button
                          onClick={() => {
                            removeOptionFromQuestion(question.id, option.id);
                            toast({ title: "Opción eliminada" });
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add new option to existing question */}
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Nueva opción..."
                  value={newOption[question.id] || ''}
                  onChange={(e) => setNewOption(prev => ({ ...prev, [question.id]: e.target.value }))}
                  className="max-w-xs"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddNewOption(question.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
