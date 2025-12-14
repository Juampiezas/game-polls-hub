import { Users, ClipboardList, Vote, BarChart3, Gamepad2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useSurveyStore } from '@/store/surveyStore';

export default function Index() {
  const { participants, questions, votes } = useSurveyStore();

  const stats = [
    {
      label: 'Participantes',
      value: participants.length,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      link: '/participantes',
    },
    {
      label: 'Preguntas',
      value: questions.length,
      icon: ClipboardList,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      link: '/preguntas',
    },
    {
      label: 'Votos Totales',
      value: votes.length,
      icon: Vote,
      color: 'text-success',
      bgColor: 'bg-success/10',
      link: '/resultados',
    },
    {
      label: 'Tasa de Participación',
      value: participants.length > 0 
        ? `${Math.round((votes.length / participants.length) * 100)}%` 
        : '0%',
      icon: BarChart3,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      link: '/resultados',
    },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="relative">
            <Gamepad2 className="h-12 w-12 text-primary animate-float" />
            <div className="absolute inset-0 blur-xl bg-primary/30" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-wide">
              Panel de Control
            </h1>
            <p className="text-muted-foreground">
              Gestiona tu encuesta de videojuegos
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="gaming-card p-6 hover:border-primary/50 transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
              <span>Ver detalles</span>
              <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="gaming-card p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/participantes">
            <Button variant="neon" className="w-full justify-start gap-3" size="lg">
              <Users className="h-5 w-5" />
              Agregar Participantes
            </Button>
          </Link>
          <Link to="/preguntas">
            <Button variant="neon" className="w-full justify-start gap-3" size="lg">
              <ClipboardList className="h-5 w-5" />
              Crear Preguntas
            </Button>
          </Link>
          <Link to="/resultados">
            <Button variant="neon" className="w-full justify-start gap-3" size="lg">
              <BarChart3 className="h-5 w-5" />
              Ver Resultados
            </Button>
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 gaming-card p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          ¿Cómo funciona?
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { step: '1', title: 'Registra Participantes', desc: 'Añade los correos de quienes podrán votar' },
            { step: '2', title: 'Crea Preguntas', desc: 'Define las categorías y opciones de videojuegos' },
            { step: '3', title: 'Envía Encuestas', desc: 'Comparte el enlace único por email' },
            { step: '4', title: 'Ve Resultados', desc: 'Analiza las respuestas en tiempo real' },
          ].map((item, index) => (
            <div 
              key={item.step}
              className="relative p-4 rounded-lg bg-secondary/30 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                {item.step}
              </span>
              <h3 className="font-semibold text-foreground mb-1 mt-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
