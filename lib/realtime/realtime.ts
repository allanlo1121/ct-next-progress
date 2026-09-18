// lib/realtime.ts

type Listener = (event: string) => void

const listeners = new Set<Listener>()

export function subscribe(listener: Listener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function broadcast(event: string) {
  console.log(
    "===== REALTIME BROADCAST V2 =====",
    event,
    "listeners:",
    listeners.size
  )

  for (const listener of listeners) {
    console.log("===== CALL LISTENER =====")

    listener(event)
  }
}