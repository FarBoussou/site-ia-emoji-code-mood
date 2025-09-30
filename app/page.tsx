import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Code, Zap, Sparkles, Bot, ArrowRight, Eye } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6">
        <div className="absolute inset-0 ai-grid-pattern opacity-40" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge
              variant="secondary"
              className="px-6 py-2 text-base font-medium bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Plateforme Éducative IA
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance text-foreground">
            <span className="text-primary">AI Code Mood</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-4xl mx-auto text-balance leading-relaxed">
            Exprimez votre humeur et vos préférences en intelligence artificielle à travers le code. Un outil
            pédagogique simple et interactif pour connecter étudiants et enseignants.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/mood">
              <Button size="lg" className="px-10 py-4 text-lg ai-glow">
                <Bot className="w-5 h-5 mr-2" />
                Exprimer mon Humeur
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/humeurs">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-4 text-lg border-2 border-primary/30 hover:bg-primary/10 bg-transparent"
              >
                <Eye className="w-5 h-5 mr-2" />
                Voir les Humeurs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Fonctionnalités Simples</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Une approche directe pour comprendre l'état d'esprit des étudiants en programmation et IA
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/20 bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Brain className="w-16 h-16 text-primary mb-4 mx-auto" />
                <CardTitle className="text-xl">Expression IA</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Partagez vos outils IA préférés et votre niveau d'énergie pour l'apprentissage
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-accent/20 bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Code className="w-16 h-16 text-accent mb-4 mx-auto" />
                <CardTitle className="text-xl">Code Interactif</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Exprimez votre humeur à travers des snippets de code dans votre langage favori
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20 bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Zap className="w-16 h-16 text-primary mb-4 mx-auto" />
                <CardTitle className="text-xl">Temps Réel</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Visualisation instantanée des réponses pour adapter l'enseignement
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Comment ça Marche</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Accès Direct</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Cliquez simplement sur "Exprimer mon Humeur" pour commencer
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Exprimer</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Partagez votre humeur, énergie, préférences IA et code facilement
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Visualiser</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Les enseignants voient les réponses en temps réel sur le dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-base">
            © 2025 AI Code Mood - Outil pédagogique pour l'ère de l'intelligence artificielle
          </p>
        </div>
      </footer>
    </div>
  )
}
