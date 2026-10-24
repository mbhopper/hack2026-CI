import background from '../../assets/locations/vip-box.png'
import bartenderSheet from '../../assets/characters/bartender.png'
import { bartenderTopics } from '../dialogues.ts'
import { bartenderPortraits } from '../portraits.ts'
import { vipBoxClues } from '../story.ts'
import type { Location } from './location.ts'

/** Кадр бармена 32×32: стоит, протирает бокал (два кадра). Ниже пояса его закрывает стойка */
const FRAME = 32
const BARTENDER = { x: 250, y: 88 }
/** Секунд в цикле: сначала стоит, в конце цикла протирает бокал */
const IDLE_CYCLE = 7
const WIPE_FROM = 4.5

/** VIP-ложа над финишной прямой: кресла у окна, бар справа, диван со столиком слева */
export const vipBox: Location = {
  id: 'vip-box',
  title: 'VIP-ложа',
  lead: 'Ложа спонсора над финишной прямой. Отсюда видно всю трассу. За стойкой всё тот же бармен.',
  background,
  walkable: [
    { x: 20, y: 92, w: 212, h: 24 }, // проход вдоль кресел
    { x: 112, y: 114, w: 7, h: 62 }, // между диваном и торшером
    { x: 17, y: 158, w: 102, h: 17 }, // у столика с бокалами
    { x: 138, y: 114, w: 94, h: 62 }, // середина ложи
    { x: 228, y: 160, w: 70, h: 15 }, // перед барными табуретами
  ],
  start: { x: 176, y: 170, dir: 'up' },
  clues: vipBoxClues,
  rain: false,
  music: 'jazz',
  npc: {
    id: 'bartender',
    name: 'Бармен',
    area: { x: 236, y: 84, w: 58, h: 56 },
    topics: bartenderTopics,
    portraits: bartenderPortraits,
    idleMood: 'calm',
    sheet: bartenderSheet,
    draw(ctx, sheet, time, talking) {
      const phase = time % IDLE_CYCLE
      const frame = talking || phase < WIPE_FROM ? 0 : 1 + (Math.floor(phase * 4) % 2)
      ctx.drawImage(sheet, frame * FRAME, 0, FRAME, FRAME, BARTENDER.x, BARTENDER.y, FRAME, FRAME)
    },
  },
}
