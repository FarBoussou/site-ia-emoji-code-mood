"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, GraduationCap, Copy, Check } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function TeacherPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teacherName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionCreated, setSessionCreated] = useState<{
    id: string
    code: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const sessionCode = generateSessionCode()

      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          title: formData.title,
          description: formData.description,
          teacher_name: formData.teacherName,
          session_code: sessionCode,
          is_active: true,
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      setSessionCreated({
        id: session.id,
        code: sessionCode,
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (sessionCreated) {
      await navigator.clipboard.writeText(sessionCreated.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const goToDashboard = () => {
    if (sessionCreated) {
      router.push(`/teacher/dashboard/${sessionCreated.id}`)
    }
  }

  if (sessionCreated) {
    return (
      <div className="min-h-screen neural-network-bg">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm ai-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-accent">Session Créée avec Succès !</CardTitle>
                <CardDescription className="text-lg">Partagez ce code avec vos étudiants</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <Label className="text-base font-medium">Code de Session</Label>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="text-4xl font-mono font-bold bg-primary/20 px-6 py-4 rounded-lg border-2 border-primary/30">
                      {sessionCreated.code}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="border-primary/30 bg-transparent"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={goToDashboard} className="flex-1 ai-glow">
                    Accéder au Tableau de Bord
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSessionCreated(null)}
                    className="flex-1 border-primary/30"
                  >
                    Créer une Nouvelle Session
                  </Button>
                </div>

                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h3 className="font-semibold mb-2 text-accent">Instructions</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Partagez le code <strong>{sessionCreated.code}</strong> avec vos étudiants
                    </li>
                    <li>• Ils peuvent rejoindre via la page étudiant</li>
                    <li>• Suivez les réponses en temps réel sur votre tableau de bord</li>
                  </ul>
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              <GraduationCap className="w-4 h-4 mr-2" />
              Enseignant
            </Badge>
          </div>

          {/* Main Card */}
          <Card className="border-accent/20 bg-card/80 backdrop-blur-sm ai-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Créer une Session
              </CardTitle>
              <CardDescription className="text-lg">
                Configurez une nouvelle session interactive pour vos étudiants
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCreateSession} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teacherName" className="text-base font-medium">
                    Nom de l'Enseignant
                  </Label>
                  <Input
                    id="teacherName"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.teacherName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, teacherName: e.target.value }))}
                    className="bg-secondary/50 border-accent/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    Titre de la Session
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ex: Introduction à l'IA - Séance 1"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-secondary/50 border-accent/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description (optionnel)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez brièvement l'objectif de cette session..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-secondary/50 border-accent/30 min-h-[100px]"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full h-12 text-lg ai-glow" disabled={isLoading}>
                  {isLoading ? "Création..." : "Créer la Session"}
                </Button>
              </form>

              {/* Info Section */}
              <div className="mt-8 p-4 bg-secondary/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-accent">À propos des Sessions</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Un code unique sera généré automatiquement</li>
                  <li>• Les étudiants pourront rejoindre avec ce code</li>
                  <li>• Vous pourrez suivre les réponses en temps réel</li>
                  <li>• Les données peuvent être exportées pour analyse</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
