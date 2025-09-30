"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Clock, Code, Brain } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface MoodResponse {
  id: string
  student_name: string
  mood_emoji: string
  energy_level: number
  ai_preference: string
  programming_language: string
  code_snippet: string
  learning_goal: string
  created_at: string
}

export default function HumeursPage() {
  const [responses, setResponses] = useState<MoodResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("mood_responses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      setResponses(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen neural-network-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des humeurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen neural-network-bg py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Users className="w-4 h-4 mr-2" />
              Humeurs Partagées
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {responses.length} humeur{responses.length > 1 ? "s" : ""} partagée{responses.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{responses.length}</div>
              <div className="text-sm text-muted-foreground">Réponses totales</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round(responses.reduce((acc, r) => acc + r.energy_level, 0) / responses.length) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Énergie moyenne</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">
                {responses.length > 0
                  ? [
                      ...responses.reduce((acc, r) => {
                        acc.set(r.mood_emoji, (acc.get(r.mood_emoji) || 0) + 1)
                        return acc
                      }, new Map()),
                    ].sort((a, b) => b[1] - a[1])[0]?.[0] || "😊"
                  : "😊"}
              </div>
              <div className="text-sm text-muted-foreground">Humeur populaire</div>
            </CardContent>
          </Card>
        </div>

        {/* Responses Grid */}
        {responses.length === 0 ? (
          <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🤔</div>
              <CardTitle className="text-xl mb-2">Aucune humeur partagée</CardTitle>
              <CardDescription className="mb-6">Soyez le premier à partager votre humeur !</CardDescription>
              <Link href="/mood">
                <Button className="ai-glow">Partager mon Humeur</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responses.map((response) => (
              <Card
                key={response.id}
                className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm hover:border-primary/40 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{response.mood_emoji}</div>
                      <div>
                        <CardTitle className="text-lg">{response.student_name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(response.created_at)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {response.energy_level}% énergie
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {response.ai_preference && (
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-sm">{response.ai_preference}</span>
                    </div>
                  )}
                  {response.programming_language && (
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-primary" />
                      <span className="text-sm">{response.programming_language}</span>
                    </div>
                  )}
                  {response.learning_goal && (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      "{response.learning_goal}"
                    </div>
                  )}
                  {response.code_snippet && (
                    <div className="text-xs font-mono bg-muted/50 p-3 rounded-lg overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{response.code_snippet}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
