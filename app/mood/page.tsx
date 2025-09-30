"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const MOOD_EMOJIS = [
  { emoji: "😊", label: "Heureux" },
  { emoji: "😴", label: "Fatigué" },
  { emoji: "🤔", label: "Pensif" },
  { emoji: "😅", label: "Stressé" },
  { emoji: "🚀", label: "Motivé" },
  { emoji: "😵", label: "Confus" },
  { emoji: "💪", label: "Déterminé" },
  { emoji: "🎯", label: "Concentré" },
]

const AI_TOOLS = [
  "ChatGPT",
  "Claude",
  "GitHub Copilot",
  "Cursor",
  "v0",
  "Midjourney",
  "Stable Diffusion",
  "Perplexity",
  "Gemini",
  "Autre",
]

const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "TypeScript",
  "Go",
  "Rust",
  "PHP",
  "C#",
  "Swift",
  "Kotlin",
  "Ruby",
  "Autre",
]

export default function MoodPage() {
  const [formData, setFormData] = useState({
    name: "",
    mood: "",
    energy: [50],
    aiTool: "",
    language: "",
    codeSnippet: "",
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const energyLevel = Math.max(1, Math.min(5, Math.round((formData.energy[0] / 100) * 4) + 1))

      const { error } = await supabase.from("mood_responses").insert([
        {
          student_name: formData.name || "Anonyme",
          mood_emoji: formData.mood,
          energy_level: energyLevel,
          ai_preference: formData.aiTool,
          programming_language: formData.language,
          code_snippet: formData.codeSnippet,
          learning_goal: formData.comment,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      setIsSubmitted(true)
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      alert("Erreur lors de l'envoi. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen neural-network-bg flex items-center justify-center px-6">
        <Card className="max-w-md mx-auto border-2 border-primary/20 bg-card ai-glow">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-primary">Merci !</CardTitle>
            <CardDescription className="text-base">Votre humeur a été enregistrée avec succès</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button className="ai-glow">Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen neural-network-bg py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Expression d'Humeur
          </Badge>
        </div>

        {/* Main Form */}
        <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Comment vous sentez-vous aujourd'hui ?</CardTitle>
            <CardDescription className="text-lg">
              Partagez votre état d'esprit et vos préférences technologiques
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Votre nom (optionnel)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Alex"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 text-base"
                />
              </div>

              {/* Mood Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Votre humeur</Label>
                <div className="grid grid-cols-4 gap-3">
                  {MOOD_EMOJIS.map((mood) => (
                    <button
                      key={mood.emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: mood.emoji })}
                      className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        formData.mood === mood.emoji
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <div className="text-sm font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Niveau d'énergie: {formData.energy[0]}%</Label>
                <Slider
                  value={formData.energy}
                  onValueChange={(value) => setFormData({ ...formData, energy: value })}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Épuisé</span>
                  <span>Pleine forme</span>
                </div>
              </div>

              {/* AI Tool */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Outil IA préféré</Label>
                <Select value={formData.aiTool} onValueChange={(value) => setFormData({ ...formData, aiTool: value })}>
                  <SelectTrigger className="h-12 text-base">
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
                <Label className="text-base font-medium">Langage de programmation préféré</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Choisissez votre langage favori" />
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
                <Label htmlFor="code" className="text-base font-medium">
                  Partagez un bout de code (optionnel)
                </Label>
                <Textarea
                  id="code"
                  placeholder="// Votre code ici..."
                  value={formData.codeSnippet}
                  onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                  className="min-h-[120px] font-mono text-base"
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-base font-medium">
                  Objectif d'apprentissage (optionnel)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Que souhaitez-vous apprendre aujourd'hui ?"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="min-h-[100px] text-base"
                />
              </div>

              <Button type="submit" className="w-full h-14 text-lg ai-glow" disabled={isSubmitting || !formData.mood}>
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Partager mon Humeur
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
