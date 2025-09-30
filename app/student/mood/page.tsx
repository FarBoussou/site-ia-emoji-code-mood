"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Bot, Code, Zap, Heart, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const MOOD_EMOJIS = [
  { emoji: "😊", label: "Heureux" },
  { emoji: "🤔", label: "Réfléchi" },
  { emoji: "😴", label: "Fatigué" },
  { emoji: "🚀", label: "Motivé" },
  { emoji: "😰", label: "Stressé" },
  { emoji: "🤯", label: "Dépassé" },
  { emoji: "💡", label: "Inspiré" },
  { emoji: "😎", label: "Confiant" },
  { emoji: "🔥", label: "Passionné" },
  { emoji: "🌟", label: "Excité" },
]

const AI_TOOLS = [
  "ChatGPT",
  "Claude",
  "GitHub Copilot",
  "Cursor",
  "v0",
  "Midjourney",
  "Stable Diffusion",
  "Gemini",
  "Perplexity",
  "Notion AI",
  "Autre",
]

const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Dart",
  "SQL",
  "HTML/CSS",
  "Autre",
]

function MoodFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session")
  const sessionCode = searchParams.get("code")

  const [formData, setFormData] = useState({
    studentName: "",
    moodEmoji: "",
    energyLevel: [3],
    aiPreference: "",
    codeSnippet: "",
    programmingLanguage: "",
    learningGoal: "",
  })

  const [sessionInfo, setSessionInfo] = useState<{
    title: string
    teacher_name: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (sessionId) {
      fetchSessionInfo()
    }
  }, [sessionId])

  const fetchSessionInfo = async () => {
    try {
      const supabase = createClient()
      const { data: session, error } = await supabase
        .from("sessions")
        .select("title, teacher_name")
        .eq("id", sessionId)
        .single()

      if (error) throw error
      setSessionInfo(session)
    } catch (error) {
      console.error("Error fetching session:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from("mood_responses").insert({
        session_id: sessionId,
        student_name: formData.studentName,
        mood_emoji: formData.moodEmoji,
        energy_level: formData.energyLevel[0],
        ai_preference: formData.aiPreference,
        code_snippet: formData.codeSnippet || null,
        programming_language: formData.programmingLanguage,
        learning_goal: formData.learningGoal || null,
      })

      if (insertError) throw insertError

      toast({
        title: "Humeur partagée !",
        description: "Votre réponse a été envoyée en temps réel à votre enseignant",
      })

      setSubmitted(true)
    } catch (error: any) {
      setError(error.message)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!sessionId || !sessionCode) {
    return (
      <div className="min-h-screen neural-network-bg flex items-center justify-center">
        <Card className="border-destructive/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-destructive">Session Invalide</CardTitle>
            <CardDescription>Paramètres de session manquants</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/student">
              <Button>Retour à la page étudiant</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen neural-network-bg">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm ai-glow text-center">
              <CardHeader>
                <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-accent">Merci pour votre participation !</CardTitle>
                <CardDescription className="text-lg">
                  Votre humeur et vos préférences ont été enregistrées avec succès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-muted-foreground">
                    Votre enseignant peut maintenant voir vos réponses en temps réel sur son tableau de bord.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/student" className="flex-1">
                    <Button variant="outline" className="w-full border-primary/30 bg-transparent">
                      Rejoindre une autre session
                    </Button>
                  </Link>
                  <Link href="/" className="flex-1">
                    <Button className="w-full ai-glow">Retour à l'accueil</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen neural-network-bg">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/student">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Session: {sessionCode}
            </Badge>
            {sessionInfo && (
              <Badge variant="outline" className="border-accent/30">
                {sessionInfo.title}
              </Badge>
            )}
          </div>

          {/* Main Form */}
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm ai-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Exprimez votre Humeur Code
              </CardTitle>
              <CardDescription className="text-lg">
                Partagez votre état d'esprit, vos préférences IA et votre code du moment
              </CardDescription>
              {sessionInfo && (
                <p className="text-sm text-muted-foreground">
                  Session animée par <strong>{sessionInfo.teacher_name}</strong>
                </p>
              )}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-primary font-medium">Envoi en temps réel</span>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Student Name */}
                <div className="space-y-2">
                  <Label htmlFor="studentName" className="text-base font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4 text-accent" />
                    Votre Prénom
                  </Label>
                  <Input
                    id="studentName"
                    type="text"
                    placeholder="Comment vous appelez-vous ?"
                    value={formData.studentName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, studentName: e.target.value }))}
                    className="bg-secondary/50 border-primary/30"
                    required
                  />
                </div>

                {/* Mood Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    Comment vous sentez-vous aujourd'hui ?
                  </Label>
                  <div className="grid grid-cols-5 gap-3">
                    {MOOD_EMOJIS.map((mood) => (
                      <button
                        key={mood.emoji}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, moodEmoji: mood.emoji }))}
                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                          formData.moodEmoji === mood.emoji
                            ? "border-primary bg-primary/20 ai-glow"
                            : "border-border bg-secondary/30 hover:border-primary/50"
                        }`}
                      >
                        <div className="text-3xl mb-1">{mood.emoji}</div>
                        <div className="text-xs text-muted-foreground">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Level */}
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    Niveau d'énergie pour apprendre (1-5)
                  </Label>
                  <div className="px-4">
                    <Slider
                      value={formData.energyLevel}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, energyLevel: value }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>Faible</span>
                      <span className="font-semibold text-primary">Niveau: {formData.energyLevel[0]}</span>
                      <span>Élevé</span>
                    </div>
                  </div>
                </div>

                {/* AI Preference */}
                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    Votre outil IA préféré
                  </Label>
                  <Select
                    value={formData.aiPreference}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, aiPreference: value }))}
                    required
                  >
                    <SelectTrigger className="bg-secondary/50 border-primary/30">
                      <SelectValue placeholder="Choisissez votre outil IA favori" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_TOOLS.map((tool) => (
                        <SelectItem key={tool} value={tool}>
                          {tool}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Programming Language */}
                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Code className="w-4 h-4 text-accent" />
                    Langage de programmation du moment
                  </Label>
                  <Select
                    value={formData.programmingLanguage}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, programmingLanguage: value }))}
                    required
                  >
                    <SelectTrigger className="bg-secondary/50 border-accent/30">
                      <SelectValue placeholder="Quel langage utilisez-vous actuellement ?" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Code Snippet */}
                <div className="space-y-2">
                  <Label htmlFor="codeSnippet" className="text-base font-medium flex items-center gap-2">
                    <Code className="w-4 h-4 text-accent" />
                    Partagez un bout de code (optionnel)
                  </Label>
                  <Textarea
                    id="codeSnippet"
                    placeholder="// Collez ici un snippet qui représente votre humeur ou votre apprentissage actuel
console.log('Hello AI World!');"
                    value={formData.codeSnippet}
                    onChange={(e) => setFormData((prev) => ({ ...prev, codeSnippet: e.target.value }))}
                    className="bg-secondary/50 border-accent/30 font-mono text-sm min-h-[120px]"
                  />
                </div>

                {/* Learning Goal */}
                <div className="space-y-2">
                  <Label htmlFor="learningGoal" className="text-base font-medium flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    Objectif d'apprentissage (optionnel)
                  </Label>
                  <Textarea
                    id="learningGoal"
                    placeholder="Que souhaitez-vous apprendre ou améliorer aujourd'hui ?"
                    value={formData.learningGoal}
                    onChange={(e) => setFormData((prev) => ({ ...prev, learningGoal: e.target.value }))}
                    className="bg-secondary/50 border-primary/30 min-h-[80px]"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-lg ai-glow"
                  disabled={
                    isLoading ||
                    !formData.studentName ||
                    !formData.moodEmoji ||
                    !formData.aiPreference ||
                    !formData.programmingLanguage
                  }
                >
                  {isLoading ? "Envoi en cours..." : "Partager mon Humeur Code"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MoodPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen neural-network-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      }
    >
      <MoodFormContent />
    </Suspense>
  )
}
