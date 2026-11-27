import { useEffect, useState } from 'react'

type Axis = 'x' | 'y' | 'z'

interface Cubie {
  id: string
  x: number
  y: number
  z: number
  gold: boolean
}

interface Turn {
  axis: Axis
  layer: number
  dir: number
}

const COORDS = [-1, 0, 1]
const AXES: Axis[] = ['x', 'y', 'z']
const SPACING = 50
const FACES = ['front', 'back', 'right', 'left', 'top', 'bottom']
const TURN_MS = 1900
const PAUSE_MS = 900

const initialCubies: Cubie[] = COORDS.flatMap((x) =>
  COORDS.flatMap((y) =>
    COORDS.map((z) => ({
      id: `${x}:${y}:${z}`,
      x,
      y,
      z,
      gold: (x + y + z) % 2 === 0,
    }))
  )
)

const rotateCoords = (
  x: number,
  y: number,
  z: number,
  axis: Axis,
  dir: number
) => {
  if (axis === 'x') return { x, y: -dir * z, z: dir * y }
  if (axis === 'y') return { x: dir * z, y, z: -dir * x }
  return { x: -dir * y, y: dir * x, z }
}

const inLayer = (cubie: Cubie, axis: Axis, layer: number) =>
  cubie[axis] === layer

const PuzzleCube = () => {
  const [cubies, setCubies] = useState<Cubie[]>(initialCubies)
  const [turn, setTurn] = useState<Turn | null>(null)
  const [snap, setSnap] = useState(false)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const schedule = () => {
      if (cancelled) return

      const axis = AXES[Math.floor(Math.random() * AXES.length)]
      const layer = COORDS[Math.floor(Math.random() * COORDS.length)]
      const dir = Math.random() < 0.5 ? 1 : -1

      setTurn({ axis, layer, dir })

      timer = setTimeout(() => {
        if (cancelled) return

        setSnap(true)
        setCubies((current) =>
          current.map((cubie) =>
            inLayer(cubie, axis, layer)
              ? {
                  ...cubie,
                  ...rotateCoords(cubie.x, cubie.y, cubie.z, axis, dir),
                }
              : cubie
          )
        )
        setTurn(null)

        timer = setTimeout(() => {
          if (cancelled) return
          setSnap(false)
          timer = setTimeout(schedule, PAUSE_MS)
        }, 60)
      }, TURN_MS)
    }

    timer = setTimeout(schedule, PAUSE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="puzzle-scene">
      <div className={`puzzle${snap ? ' snap' : ''}`}>
        {cubies.map((cubie) => {
          const base = `translate3d(${cubie.x * SPACING}px, ${
            cubie.y * SPACING
          }px, ${cubie.z * SPACING}px)`
          const transform =
            turn && inLayer(cubie, turn.axis, turn.layer)
              ? `rotate${turn.axis.toUpperCase()}(${turn.dir * 90}deg) ${base}`
              : base

          return (
            <div
              key={cubie.id}
              className={`cubie${cubie.gold ? ' gold' : ''}`}
              style={{ transform }}
            >
              {FACES.map((face) => (
                <div key={face} className={`cubie-face ${face}`} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PuzzleCube
