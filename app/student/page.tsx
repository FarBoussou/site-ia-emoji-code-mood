"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function StudentPage() {
  const [sessionCode, setSessionCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionCode.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Check if session exists and is active
      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .select("*")
        .eq("session_code", sessionCode.toUpperCase())
        .eq("is_active", true)
        .single()

      if (sessionError || !session) {
        throw new Error("Code de session invalide ou session inactive")
      }

      // Redirect to mood form with session ID
      router.push(`/student/mood?session=${session.id}&code=${sessionCode.toUpperCase()}`)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
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
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Users className="w-4 h-4 mr-2" />
              Étudiant
            </Badge>
          </div>

          {/* Main Card */}
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm ai-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Rejoindre une Session
              </CardTitle>
              <CardDescription className="text-lg">
                Entrez le code fourni par votre enseignant pour participer à la session interactive
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleJoinSession} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionCode" className="text-base font-medium">
                    Code de Session
                  </Label>
                  <Input
                    id="sessionCode"
                    type="text"
                    placeholder="Ex: ABC123"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                    className="text-center text-2xl font-mono tracking-wider h-14 bg-secondary/50 border-primary/30"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Le code est généralement composé de 6 caractères
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-lg ai-glow"
                  disabled={isLoading || !sessionCode.trim()}
                >
                  {isLoading ? "Connexion..." : "Rejoindre la Session"}
                </Button>
              </form>

              {/* Help Section */}
              <div className="mt-8 p-4 bg-secondary/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-accent">Besoin d'aide ?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Demandez le code de session à votre enseignant</li>
                  <li>• Vérifiez que la session est bien active</li>
                  <li>• Le code est insensible à la casse</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
