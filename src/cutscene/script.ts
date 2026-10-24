/**
 * Сценарий вступительной катсцены: 12 сцен, ~95 секунд.
 * Тайминг каждой сцены правится одним числом `duration`.
 */
import { carSprite, liveries, outfits, personSprite, wreckSprite, type CarId } from '../game/sprites.ts'
import {
  H,
  LANE_FAR,
  LANE_NEAR,
  TRACK_BOTTOM,
  TRACK_TOP,
  VIP_X,
  W,
  drawFinishLine,
  drawPitBox,
  drawPitWall,
  drawRain,
  drawSideTrack,
  drawStartLights,
  drawTopTrack,
  fill,
  ovalPoint,
  rng,
} from '../game/scenery.ts'
import type { GameAudio } from '../game/audio.ts'
import { CRASH_SITE_SCROLL, drawCrashSite } from '../game/crashSite.ts'
import type { Scene } from './types.ts'

const between = (t: number, from: number, to: number) => t >= from && t < to
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const easeOut = (value: number) => 1 - (1 - clamp01(value)) ** 3

const CAR_H = 12

function car(ctx: CanvasRenderingContext2D, id: CarId, x: number, lane: number, frame: number) {
  ctx.drawImage(carSprite(id, frame >> 1), Math.round(x), lane - CAR_H)
}

/** Клубы дыма: позиция растёт со временем, seed фиксирует узор */
function smoke(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, amount: number, seed: number) {
  const rand = rng(seed)
  for (let i = 0; i < amount; i++) {
    const life = (t * 1.4 + rand()) % 1
    const px = x - life * (20 + rand() * 30)
    const py = y - life * (10 + rand() * 16)
    const size = 2 + Math.round(life * 4)
    ctx.globalAlpha = 0.7 * (1 - life)
    fill(ctx, rand() > 0.5 ? '#6f7a75' : '#4a5550', px, py, size, size)
  }
  ctx.globalAlpha = 1
}

function sparks(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, amount: number) {
  const rand = rng(frame)
  for (let i = 0; i < amount; i++) {
    fill(ctx, rand() > 0.4 ? '#e8c43a' : '#ffffff', x - rand() * 24, y - rand() * 3, 1 + Math.round(rand()), 1)
  }
}

/** Пиксельный восклицательный знак над шлемом */
function alert(ctx: CanvasRenderingContext2D, x: number, y: number) {
  fill(ctx, '#0b0f0e', x - 1, y - 1, 4, 12)
  fill(ctx, '#e8c43a', x, y, 2, 6)
  fill(ctx, '#e8c43a', x, y + 8, 2, 2)
}

const grid: { id: CarId; x: number; lane: number; pace: number }[] = [
  { id: 'car14', x: 40, lane: LANE_FAR, pace: -26 },
  { id: 'car3', x: 96, lane: LANE_FAR, pace: -14 },
  { id: 'car7', x: 152, lane: LANE_FAR, pace: 6 },
  { id: 'car31', x: 14, lane: LANE_NEAR, pace: -30 },
  { id: 'car9', x: 70, lane: LANE_NEAR, pace: -20 },
  { id: 'car22', x: 126, lane: LANE_NEAR, pace: 2 },
]

const mechanic = () => personSprite('mechanic', outfits.mechanic7)
const fifthMechanic = () => personSprite('mechanicFifth', outfits.mechanic7)

/** Механики в боксе: где ждут и куда бегут к машине */
const crew = [
  { from: 30, to: 120, fifth: false },
  { from: 52, to: 186, fifth: false },
  { from: 236, to: 104, fifth: false },
  { from: 258, to: 200, fifth: false },
  { from: 290, to: 150, fifth: true },
]

const PIT_CAR_X = 136
const PIT_LANE = 150

export const script: Scene[] = [
  {
    id: 'disclaimer',
    duration: 5,
    draw: ({ ctx }) => fill(ctx, '#000000', 0, 0, W, H),
    overlay: (t) => (t > 0.4 ? { caption: { text: 'Основано на реальных событиях', size: 'md' } } : {}),
    cues: [{ at: 0.5, run: (audio, loops) => (loops.crowd = audio.crowd()) }],
  },
  {
    id: 'title',
    duration: 5,
    draw: ({ ctx, t }) => {
      drawTopTrack(ctx)
      ctx.globalAlpha = 1 - clamp01(t / 1.5)
      fill(ctx, '#000000', 0, 0, W, H)
      ctx.globalAlpha = 1
    },
    overlay: (t) => (t > 0.8 ? { caption: { text: 'Последний круг', size: 'xl' } } : {}),
    cues: [{ at: 0.6, run: (audio) => audio.engineSet(0.08, 0.05, 1) }],
  },
  {
    id: 'start',
    duration: 10,
    draw: ({ ctx, t, frame }) => {
      const go = 6.2
      const run = Math.max(0, t - go)
      drawSideTrack(ctx, { scroll: run * run * 70, stands: { sponsorInBox: true, crowd: true } })
      const lit = t < go ? Math.min(5, Math.floor(t)) : 0
      drawStartLights(ctx, 129, 18, lit)
      const sorted = [...grid].sort((a, b) => a.lane - b.lane)
      for (const entry of sorted) {
        const x = entry.x + run * run * entry.pace * 0.6
        car(ctx, entry.id, x, entry.lane, run > 0 ? frame : 0)
        if (between(run, 0.01, 1.6)) smoke(ctx, x + 2, entry.lane - 2, run, 6, entry.x)
      }
    },
    shake: (t) => (between(t, 6.2, 7.6) ? 1 : 0),
    cues: [
      { at: 0.3, run: (audio) => audio.engineSet(0.25, 0.1) },
      ...[1, 2, 3, 4, 5].map((at) => ({ at, run: (audio: GameAudio) => audio.beep() })),
      {
        at: 6.2,
        run: (audio) => {
          audio.beep(true)
          audio.tireScreech()
          audio.engineSet(0.75, 0.18, 0.8)
        },
      },
    ],
    overlay: (t) => (t > 6.2 && t < 8 ? { sound: '[визг шин, рёв моторов]' } : {}),
  },
  {
    id: 'laps',
    duration: 12,
    draw: ({ ctx, t, frame }) => {
      const local = t % 6
      if (local < 4) {
        drawTopTrack(ctx)
        const lead = Math.PI / 2 - (t / 6) * Math.PI * 2
        const order: CarId[] = ['car7', 'car22', 'car3', 'car9', 'car14', 'car31']
        order.forEach((id, i) => {
          const p = ovalPoint(lead + i * 0.22 + (i > 1 ? i * 0.04 : 0))
          const livery = liveries[id]
          fill(ctx, livery.A, p.x - 2, p.y - 2, 5, 4)
          fill(ctx, livery.C, p.x - 1, p.y - 1, 3, 2)
        })
      } else {
        drawSideTrack(ctx, { scroll: 2000 + t * 40, stands: { sponsorInBox: true, crowd: true } })
        const pass = local - 4
        car(ctx, 'car7', -50 + pass * 260, LANE_FAR, frame)
        car(ctx, 'car22', -110 + pass * 260, LANE_NEAR, frame)
      }
    },
    overlay: (t) => ({ lap: t < 6 ? 'Круг 1' : 'Круг 2' }),
    cues: [
      { at: 0, run: (audio) => audio.engineSet(0.55, 0.06) },
      { at: 4.1, run: (audio) => audio.passBy() },
      { at: 10.1, run: (audio) => audio.passBy() },
    ],
  },
  {
    id: 'grind',
    duration: 6,
    draw: ({ ctx, t, frame }) => {
      drawSideTrack(ctx, { scroll: 4000 + t * 520, stands: { sponsorInBox: true, crowd: true } })
      const wobble = frame % 6 < 3 ? 0 : 1
      car(ctx, 'car7', 140, LANE_NEAR + wobble, frame)
      sparks(ctx, 156, LANE_NEAR - 2, frame, 6 + Math.round(t * 3))
      if (t > 1 && frame % 20 < 14) alert(ctx, 155, LANE_NEAR - 28)
    },
    shake: () => 1,
    overlay: (t) => ({
      ...(t < 1.6 ? { sound: '[скрежет металла]' } : {}),
      ...(between(t, 1.6, 5.8) ? { subtitle: { speaker: 'Пилот №7', text: 'Бокс, бокс! С машиной что-то не так.' } } : {}),
    }),
    cues: [
      { at: 0.2, run: (audio) => audio.metalGrind() },
      { at: 1.5, run: (audio) => audio.radioClick() },
    ],
  },
  {
    id: 'pit',
    duration: 12,
    draw: ({ ctx, t, frame }) => {
      drawPitBox(ctx)
      const arrive = easeOut(t / 2.5)
      const leave = Math.max(0, t - 10)
      const carX = t < 10 ? -50 + (PIT_CAR_X + 50) * arrive : PIT_CAR_X + leave * leave * 90

      const atCar = clamp01((t - 2.6) / 0.9)
      const back = clamp01((t - 9) / 0.8)
      const positions = crew.map((member) => {
        const x = member.from + (member.to - member.from) * (atCar - back * atCar)
        const working = atCar === 1 && back === 0
        const bob = working && frame % 10 < 5 ? 1 : 0
        const lean = member.fifth && between(t, 6, 7.1) ? 3 : 0
        return { ...member, x, y: PIT_LANE - 24 + bob + lean }
      })

      // пятый работает у кокпита — за машиной, поэтому рисуем его раньше болида
      for (const member of positions.filter((m) => m.fifth)) {
        ctx.drawImage(fifthMechanic(), Math.round(member.x), member.y - 6)
      }
      car(ctx, 'car7', carX, PIT_LANE, t < 2.5 || t > 10 ? frame : 0)
      for (const member of positions.filter((m) => !m.fifth)) {
        ctx.drawImage(mechanic(), Math.round(member.x), member.y)
      }
      if (between(t, 3.6, 8.8) && frame % 4 < 2) sparks(ctx, 128, PIT_LANE - 3, frame, 3)
    },
    overlay: (t) => (between(t, 3.5, 5.2) ? { sound: '[гайковёрты]' } : {}),
    cues: [
      { at: 0, run: (audio) => audio.engineSet(0.3, 0.08, 0.6) },
      // музыка вступает, когда болид подъезжает к механикам
      { at: 1.2, run: (audio) => audio.musicStart() },
      { at: 2.5, run: (audio) => audio.engineSet(0.08, 0.04, 0.5) },
      { at: 3.6, run: (audio) => audio.impactWrench() },
      { at: 5.2, run: (audio) => audio.impactWrench() },
      { at: 7.6, run: (audio) => audio.impactWrench() },
      { at: 9.8, run: (audio) => audio.engineSet(0.6, 0.12, 0.4) },
    ],
  },
  {
    id: 'runaway',
    duration: 12,
    draw: ({ ctx, t, frame }) => {
      const scroll = 6000 + 520 * t + (26 * t * t * t) / 3
      drawSideTrack(ctx, { scroll, stands: { sponsorInBox: false, crowd: true } })
      if (between(t, 1.5, 6)) car(ctx, 'car22', 120 - (t - 1.5) * 50, LANE_FAR, frame)
      const x = 132 + Math.round(t * 2)
      car(ctx, 'car7', x, LANE_NEAR, frame)
      if (t > 3.5) smoke(ctx, x + 6, LANE_NEAR - 9, t, Math.round((t - 3.5) * 3), 5)
      if (t > 8 && frame % 6 < 3) fill(ctx, '#e04848', x + 14, LANE_NEAR - 10, 3, 2)
    },
    shake: (t) => (t > 6 ? 1 + Math.floor((t - 6) / 3) : 0),
    overlay: (t) => ({
      hud: { speed: Math.round(280 + (t / 12) * 92), heat: clamp01(0.45 + (t / 12) * 0.55) },
      ...(t > 7 ? { sound: '[сигнал перегрева]' } : {}),
    }),
    cues: [
      { at: 0, run: (audio) => audio.engineSet(0.7, 0.13, 0.5) },
      { at: 4, run: (audio) => audio.engineSet(0.85, 0.15, 2) },
      { at: 8, run: (audio) => audio.engineSet(1, 0.17, 2) },
      { at: 7, run: (audio) => audio.overheatAlarm(5) },
    ],
  },
  {
    id: 'radio',
    duration: 8,
    draw: ({ ctx, t }) => {
      drawPitWall(ctx, clamp01(0.8 + t / 40), t)
      const engineer = personSprite('engineer', outfits.mechanic7)
      ctx.drawImage(engineer, 136, 64, engineer.width * 3, engineer.height * 3)
      fill(ctx, '#2a3530', 20, 98, 280, 8)
    },
    overlay: (t) => ({
      ...(between(t, 0.3, 3) ? { subtitle: { speaker: 'Инженер', text: 'Седьмой, сбрось скорость!' } } : {}),
      ...(between(t, 3.2, 5.5) ? { subtitle: { speaker: 'Инженер', text: 'Седьмой, ответь! Седьмой!' } } : {}),
      ...(t >= 5.7 ? { subtitle: { text: '…' }, sound: '[помехи в эфире]' } : {}),
    }),
    cues: [
      { at: 0, run: (audio) => audio.engineSet(0.95, 0.05, 0.5) },
      { at: 0.3, run: (audio) => audio.radioClick() },
      { at: 3.2, run: (audio) => audio.radioClick() },
      { at: 5.7, run: (audio) => audio.radioStatic(2.2) },
    ],
  },
  {
    id: 'crash',
    duration: 4,
    draw: ({ ctx, t, frame }) => {
      const impact = 0.7
      drawSideTrack(ctx, { scroll: CRASH_SITE_SCROLL, stands: { sponsorInBox: false, crowd: true } })
      if (t < impact) {
        const k = t / impact
        const x = -40 + k * 276
        const y = Math.round(LANE_NEAR - (LANE_NEAR - TRACK_TOP - 6) * k * k)
        car(ctx, 'car7', x, y, frame)
        return
      }
      const after = t - impact
      ctx.drawImage(wreckSprite(), 232, TRACK_TOP - 6)
      const rand = rng(17)
      for (let i = 0; i < 16; i++) {
        const vx = (rand() - 0.3) * 90
        const vy = -40 - rand() * 60
        const px = 252 + vx * after
        const py = TRACK_TOP + vy * after + 80 * after * after
        if (py < TRACK_BOTTOM + 10) fill(ctx, rand() > 0.5 ? liveries.car7.A : '#1a1d22', px, py, 2, 2)
      }
      smoke(ctx, 262, TRACK_TOP - 4, t, 10, 9)
    },
    shake: (t) => (between(t, 0.7, 1.3) ? 3 : 0),
    flash: (t) => (between(t, 0.7, 0.77) || between(t, 0.84, 0.9) ? 1 : 0),
    overlay: (t) => (t > 1.2 ? { sound: '[удар. тишина]' } : {}),
    cues: [
      {
        at: 0.7,
        run: (audio, loops) => {
          audio.silence()
          loops.crowd = undefined
          audio.crash()
        },
      },
    ],
  },
  {
    id: 'finish',
    duration: 8,
    draw: ({ ctx, t, frame }) => {
      drawSideTrack(ctx, { scroll: 9400, stands: { sponsorInBox: false, crowd: true } })
      drawFinishLine(ctx, 200)
      smoke(ctx, 40, TRACK_TOP - 30, t, 6, 3)
      // флаг у финиша
      fill(ctx, '#a9b3ae', 222, TRACK_TOP - 36, 1, 26)
      const wave = frame % 30 < 15 ? 0 : 1
      for (let fy = 0; fy < 8; fy += 2) {
        for (let fx = 0; fx < 12; fx += 2) {
          const dark = ((fx + fy) / 2) % 2 === 0
          fill(ctx, dark ? '#0b0f0e' : '#e8ece9', 223 + fx, TRACK_TOP - 36 + fy + (fx > 5 ? wave : 0), 2, 2)
        }
      }
      car(ctx, 'car22', -50 + t * 52, LANE_FAR, t < 7.6 ? frame >> 1 : 0)
    },
    cues: [
      { at: 0.4, run: (audio, loops) => (loops.wind = audio.wind()) },
      { at: 0.8, run: (audio) => audio.engineSet(0.3, 0.035, 1) },
      { at: 7.2, run: (audio) => audio.engineStop() },
    ],
    overlay: (t) => (t < 3 ? { sound: '[трибуны молчат]' } : {}),
  },
  {
    id: 'photo',
    duration: 5,
    draw: ({ ctx, t }) => {
      fill(ctx, '#050706', 0, 0, W, H)
      const frameX = 62
      const frameY = 22
      fill(ctx, '#e8ece9', frameX, frameY, 196, 116)
      ctx.save()
      ctx.beginPath()
      ctx.rect(frameX + 4, frameY + 4, 188, 100)
      ctx.clip()
      // камера смотрит на трибуну так, чтобы VIP-ложа попала в кадр
      ctx.translate(0, -8)
      const scroll = (VIP_X - 140) / 0.35
      drawSideTrack(ctx, { scroll, stands: { sponsorInBox: false, crowd: true } })
      car(ctx, 'car22', 118, LANE_FAR + 2, 0)
      ctx.restore()
      // проявление снимка
      ctx.globalAlpha = 1 - clamp01((t - 0.1) / 1.4)
      fill(ctx, '#ffffff', frameX + 4, frameY + 4, 188, 100)
      ctx.globalAlpha = 1
    },
    flash: (t) => (t < 0.12 ? 1 : 0),
    overlay: (t) => (t > 1.4 ? { photo: 'Фото с финиша · болид №22 на фоне трибуны' } : { sound: '[щелчок затвора]' }),
    cues: [{ at: 0, run: (audio) => audio.shutter() }],
  },
  {
    id: 'two-days-later',
    duration: 8,
    draw: ({ ctx, t, frame }) => {
      if (t < 3) {
        fill(ctx, '#000000', 0, 0, W, H)
        return
      }
      drawCrashSite(ctx, t, false)
      const walk = clamp01((t - 3) / 3.5)
      const bob = walk < 1 && frame % 16 < 8 ? 1 : 0
      ctx.drawImage(personSprite('detective', outfits.detective), Math.round(-20 + walk * 150), LANE_NEAR - 22 + bob)
      drawRain(ctx, t)
      ctx.globalAlpha = 1 - clamp01((t - 3) / 1.2)
      fill(ctx, '#000000', 0, 0, W, H)
      ctx.globalAlpha = 1
    },
    overlay: (t, playerName) => ({
      ...(t < 3 ? { caption: { text: 'Спустя два дня…', size: 'md' as const } } : {}),
      ...(t > 5 ? { caption: { text: `Детектив ${playerName}, вас ждут на трассе`, size: 'md' as const } } : {}),
    }),
    cues: [{ at: 0.2, run: (audio, loops) => (loops.rain = audio.rain()) }],
  },
]

export const totalDuration = script.reduce((sum, scene) => sum + scene.duration, 0)
