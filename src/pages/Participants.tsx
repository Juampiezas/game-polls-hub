import { useState } from 'react';
import { UserPlus, Trash2, Mail, Copy, Check } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSurveyStore } from '@/store/surveyStore';
import { useToast } from '@/hooks/use-toast';

export default function Participants() {
  const { participants, addParticipant, removeParticipant } = useSurveyStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const exists = participants.some(p => p.email.toLowerCase() === formData.email.toLowerCase());
    if (exists) {
      toast({
        title: "Error",
        description: "Este correo ya está registrado",
        variant: "destructive",
      });
      return;
    }

    addParticipant(formData);
    setFormData({ email: '', firstName: '', lastName: '' });
    toast({
      title: "¡Participante agregado!",
      description: `${formData.firstName} ${formData.lastName} ha sido registrado exitosamente.`,
    });
  };

  const copyVoteLink = (email: string) => {
    const voteUrl = `${window.location.origin}/votar?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(voteUrl);
    setCopiedEmail(email);
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace de votación ha sido copiado al portapapeles.",
    });
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground tracking-wide mb-2">
          Participantes
        </h1>
        <p className="text-muted-foreground">
          Gestiona los participantes que podrán votar en la encuesta
        </p>
      </div>

      {/* Add Participant Form */}
      <div className="gaming-card p-6 mb-8">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Registrar Participante
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              placeholder="Juan"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              placeholder="Pérez"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="gaming" className="w-full">
              Agregar
            </Button>
          </div>
        </form>
      </div>

      {/* Participants List */}
      <div className="gaming-card p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Lista de Participantes ({participants.length})
        </h2>
        
        {participants.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay participantes registrados</p>
            <p className="text-sm mt-1">Agrega participantes usando el formulario de arriba</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Correo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr 
                    key={participant.id} 
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-foreground">
                        {participant.firstName} {participant.lastName}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {participant.email}
                    </td>
                    <td className="py-4 px-4">
                      {participant.hasVoted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">
                          <Check className="h-3 w-3" />
                          Votó
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-warning/10 text-warning">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyVoteLink(participant.email)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {copiedEmail === participant.email ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeParticipant(participant.id);
                            toast({
                              title: "Participante eliminado",
                              description: `${participant.firstName} ha sido removido de la lista.`,
                            });
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
