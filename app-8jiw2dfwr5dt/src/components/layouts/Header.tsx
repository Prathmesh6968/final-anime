import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
}

export function Header({ onSearch, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center gap-2 md:gap-4 px-2 md:px-4 max-w-full">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <span className="text-lg md:text-2xl font-bold gradient-text">HindiDubAnime</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Search Icon & Expandable Search */}
        <div className="flex items-center gap-2 shrink-0">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 animate-scale-in">
              <div className="relative w-40 sm:w-48 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search anime..."
                  className="pl-10 pr-4 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hover:bg-primary/10 shrink-0"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center gap-2 shrink-0">
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Browse
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/favorites">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
