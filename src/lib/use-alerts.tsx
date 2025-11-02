"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface Alert {
  _id: string
  type: string
  location: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "active" | "resolved" | "dismissed"
  createdAt: string
  updatedAt: string
}

interface AlertsContextType {
  alerts: Alert[]
  loading: boolean
  sendAlert: (data: Partial<Alert>) => Promise<void>
  updateAlertStatus: (id: string, status: string) => Promise<void>
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined)

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()

    // Simulate WebSocket connection for real-time updates
    const interval = setInterval(() => {
      fetchAlerts()
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }, [])

  async function fetchAlerts() {
    try {
      const response = await fetch("/api/alerts")
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts)
      }
    } catch (error) {
      console.error("[v0] Fetch alerts error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function sendAlert(data: Partial<Alert>) {
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchAlerts()
      }
    } catch (error) {
      console.error("[v0] Send alert error:", error)
      throw error
    }
  }

  async function updateAlertStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchAlerts()
      }
    } catch (error) {
      console.error("[v0] Update alert status error:", error)
      throw error
    }
  }

  return (
    <AlertsContext.Provider value={{ alerts, loading, sendAlert, updateAlertStatus }}>
      {children}
    </AlertsContext.Provider>
  )
}

export function useAlerts() {
  const context = useContext(AlertsContext)
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertsProvider")
  }
  return context
}
