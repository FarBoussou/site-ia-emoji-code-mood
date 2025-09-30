"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Users, Download, Eye, EyeOff, Copy, Check, Brain, Code, Zap } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Session {
  id: string
  title: string
  description: string
  teacher_name: string
  session_code: string
  is_active: boolean
  created_at: string
}

interface MoodResponse {
  id: string
  student_name: string
  mood_emoji: string
  energy_level: number
  ai_preference: string
  code_snippet: string | null
  programming_language: string
  learning_goal: string | null
  created_at: string
}

interface MoodStats {
  totalResponses: number
  averageEnergy: number
  moodDistribution: { [key: string]: number }
  aiPreferences: { [key: string]: number }
  languageDistribution: { [key: string]: number }
}

export default function TeacherDashboard() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [session, setSession] = useState<Session | null>(null)
  const [responses, setResponses] = useState<MoodResponse[]>([])
  const [stats, setStats] = useState<MoodStats>({
    totalResponses: 0,
    averageEnergy: 0,
    moodDistribution: {},
    aiPreferences: {},
    languageDistribution: {},
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [newResponsesCount, setNewResponsesCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    fetchSessionData()
    fetchResponses()

    const supabase = createClient()

    const responseSubscription = supabase
      .channel("mood_responses_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mood_responses",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("[v0] New response received:", payload.new)
          const newResponse = payload.new as MoodResponse

          setResponses((prev) => [newResponse, ...prev])

          toast({
            title: "Nouvelle réponse !",
            description: `${newResponse.student_name} a partagé son humeur ${newResponse.mood_emoji}`,
          })

          setNewResponsesCount((prev) => prev + 1)
        },
      )
      .subscribe((status) => {
        console.log("[v0] Subscription status:", status)
        setIsConnected(status === "SUBSCRIBED")
      })

    const sessionSubscription = supabase
      .channel("session_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          console.log("[v0] Session updated:", payload.new)
          setSession(payload.new as Session)
        },
      )
      .subscribe()

    return () => {
      console.log("[v0] Cleaning up subscriptions")
      supabase.removeChannel(responseSubscription)
      supabase.removeChannel(sessionSubscription)
    }
  }, [sessionId])

  useEffect(() => {
    calculateStats(responses)
  }, [responses])

  const clearNotifications = () => {
    setNewResponsesCount(0)
  }

  const fetchSessionData = async () => {
    try {
      const supabase = createClient()
      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single()

      if (sessionError) throw sessionError
      setSession(sessionData)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const fetchResponses = async () => {
    try {
      const supabase = createClient()
      const { data: responsesData, error: responsesError } = await supabase
        .from("mood_responses")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })

      if (responsesError) throw responsesError

      setResponses(responsesData || [])
      calculateStats(responsesData || [])
      setIsLoading(false)
    } catch (error: any) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const calculateStats = (responsesData: MoodResponse[]) => {
    const totalResponses = responsesData.length
    const averageEnergy =
      totalResponses > 0 ? responsesData.reduce((sum, r) => sum + r.energy_level, 0) / totalResponses : 0

    const moodDistribution: { [key: string]: number } = {}
    const aiPreferences: { [key: string]: number } = {}
    const languageDistribution: { [key: string]: number } = {}

    responsesData.forEach((response) => {
      moodDistribution[response.mood_emoji] = (moodDistribution[response.mood_emoji] || 0) + 1
      aiPreferences[response.ai_preference] = (aiPreferences[response.ai_preference] || 0) + 1
      languageDistribution[response.programming_language] =
        (languageDistribution[response.programming_language] || 0) + 1
    })

    setStats({
      totalResponses,
      averageEnergy,
      moodDistribution,
      aiPreferences,
      languageDistribution,
    })
  }

  const toggleSessionStatus = async () => {
    if (!session) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("sessions").update({ is_active: !session.is_active }).eq("id", sessionId)

      if (error) throw error

      toast({
        title: session.is_active ? "Session désactivée" : "Session activée",
        description: session.is_active
          ? "Les étudiants ne peuvent plus rejoindre cette session"
          : "Les étudiants peuvent maintenant rejoindre cette session",
      })
    } catch (error: any) {
      setError(error.message)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const copySessionCode = async () => {
    if (session) {
      await navigator.clipboard.writeText(session.session_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Code copié !",
        description: `Le code ${session.session_code} a été copié dans le presse-papiers`,
      })
    }
  }

  const exportData = () => {
    const csvContent = [
      ["Nom", "Humeur", "Énergie", "IA Préférée", "Langage", "Objectif", "Date"].join(","),
      ...responses.map((r) =>
        [
          r.student_name,
          r.mood_emoji,
          r.energy_level,
          r.ai_preference,
          r.programming_language,
          r.learning_goal || "",
          new Date(r.created_at).toLocaleString("fr-FR"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mood-responses-${session?.session_code}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export réussi !",
      description: `${responses.length} réponses exportées en CSV`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen neural-network-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen neural-network-bg flex items-center justify-center">
        <Card className="border-destructive/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>{error || "Session introuvable"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/teacher">
              <Button>Retour aux sessions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen neural-network-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/teacher">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {session.title}
              </h1>
              <p className="text-muted-foreground">Par {session.teacher_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs text-muted-foreground">{isConnected ? "Temps réel actif" : "Connexion..."}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30">
                Code: {session.session_code}
              </Badge>
              <Button variant="ghost" size="sm" onClick={copySessionCode}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <Badge variant={session.is_active ? "default" : "secondary"} className="ai-glow">
              {session.is_active ? "Active" : "Inactive"}
            </Badge>

            <Button variant="outline" onClick={toggleSessionStatus} className="border-primary/30 bg-transparent">
              {session.is_active ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {session.is_active ? "Désactiver" : "Activer"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalResponses}</div>
              <p className="text-xs text-muted-foreground">étudiants ont répondu</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Énergie Moyenne</CardTitle>
              <Zap className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.averageEnergy.toFixed(1)}/5</div>
              <Progress value={(stats.averageEnergy / 5) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">IA Populaire</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {Object.keys(stats.aiPreferences).length > 0
                  ? Object.entries(stats.aiPreferences).sort(([, a], [, b]) => b - a)[0][0]
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">outil IA le plus utilisé</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Langage Populaire</CardTitle>
              <Code className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {Object.keys(stats.languageDistribution).length > 0
                  ? Object.entries(stats.languageDistribution).sort(([, a], [, b]) => b - a)[0][0]
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">langage le plus utilisé</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="responses" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-secondary/50">
              <TabsTrigger value="responses" onClick={clearNotifications} className="relative">
                Réponses
                {newResponsesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {newResponsesCount > 9 ? "9+" : newResponsesCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
              <TabsTrigger value="code">Code Partagé</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-md border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-primary font-medium">Temps réel</span>
              </div>
              <Button variant="outline" size="sm" onClick={exportData} className="border-accent/30 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </div>

          <TabsContent value="responses" className="space-y-4">
            {responses.length === 0 ? (
              <Card className="border-muted/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune réponse pour le moment</h3>
                  <p className="text-muted-foreground text-center">
                    Partagez le code <strong>{session.session_code}</strong> avec vos étudiants pour qu'ils puissent
                    participer.
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    En attente de réponses en temps réel...
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {responses.map((response, index) => (
                  <Card
                    key={response.id}
                    className={`border-primary/20 bg-card/80 backdrop-blur-sm transition-all duration-500 ${
                      index < newResponsesCount ? "ring-2 ring-primary/50 ai-glow" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{response.mood_emoji}</div>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {response.student_name}
                              {index < newResponsesCount && (
                                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                                  Nouveau
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{new Date(response.created_at).toLocaleString("fr-FR")}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-accent/30">
                            Énergie: {response.energy_level}/5
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {response.ai_preference}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          <Code className="w-4 h-4 inline mr-1" />
                          {response.programming_language}
                        </span>
                      </div>
                      {response.learning_goal && (
                        <div className="p-3 bg-secondary/30 rounded-lg">
                          <p className="text-sm">
                            <strong>Objectif:</strong> {response.learning_goal}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Distribution des Humeurs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(stats.moodDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([mood, count]) => (
                      <div key={mood} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{mood}</span>
                          <span className="text-sm text-muted-foreground">{count} étudiants</span>
                        </div>
                        <Progress value={(count / stats.totalResponses) * 100} className="w-24" />
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Préférences IA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(stats.aiPreferences)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([tool, count]) => (
                      <div key={tool} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{tool}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(count / stats.totalResponses) * 100} className="w-24" />
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Langages de Programmation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats.languageDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([lang, count]) => (
                      <div key={lang} className="text-center p-3 bg-secondary/30 rounded-lg">
                        <div className="text-lg font-bold text-primary">{count}</div>
                        <div className="text-sm text-muted-foreground">{lang}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            {responses.filter((r) => r.code_snippet).length === 0 ? (
              <Card className="border-muted/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Code className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun code partagé</h3>
                  <p className="text-muted-foreground text-center">
                    Les étudiants n'ont pas encore partagé de snippets de code.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {responses
                  .filter((r) => r.code_snippet)
                  .map((response) => (
                    <Card key={response.id} className="border-accent/20 bg-card/80 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">{response.mood_emoji}</div>
                            <div>
                              <CardTitle className="text-lg">{response.student_name}</CardTitle>
                              <CardDescription>{response.programming_language}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-accent/30">
                            {response.ai_preference}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-accent/20">
                          <code>{response.code_snippet}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
