import { Gamepad2, Users, ClipboardList, BarChart3, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Gamepad2, label: 'Dashboard' },
  { path: '/participantes', icon: Users, label: 'Participantes' },
  { path: '/preguntas', icon: ClipboardList, label: 'Preguntas' },
  { path: '/resultados', icon: BarChart3, label: 'Resultados' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 px-6 border-b border-border">
          <div className="relative">
            <Gamepad2 className="h-10 w-10 text-primary" />
            <div className="absolute inset-0 blur-lg bg-primary/30" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground tracking-wide">
              GAME<span className="text-primary">SURVEY</span>
            </h1>
            <p className="text-xs text-muted-foreground">Encuestas Gaming</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary neon-glow"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Email reminder */}
        <div className="p-4 border-t border-border">
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Envío de Encuesta</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Usa el enlace de votación con el email del participante en la URL
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
