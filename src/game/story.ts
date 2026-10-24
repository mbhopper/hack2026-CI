import { outfits, type Palette, type PersonKind } from './sprites.ts'

/** Точка осмотра на трассе. Координаты — в пикселях сцены 320×180. */
export interface Clue {
  id: string
  title: string
  note: string
  x: number
  y: number
  w: number
  h: number
}

/** Улика, которую детектив получает вместе с делом: снимок из катсцены */
export const finishPhoto = {
  id: 'finish-photo',
  title: 'Фото с финиша',
  note: 'Снимок сделан, когда болид №22 пересёк финиш. На трибуне за ним видна VIP-ложа: среднее кресло, место спонсора, пустует.',
}

export const clues: Clue[] = [
  {
    id: 'shift-board',
    title: 'График смены бокса №7',
    note: 'На день гонки записаны четыре механика, под графиком четыре подписи. Рядом в корзине лежит комбинезон команды без бейджа.',
    x: 8,
    y: 70,
    w: 34,
    h: 34,
  },
  {
    id: 'vip-box',
    title: 'VIP-ложа спонсора',
    note: 'Отсюда спонсор смотрел гонку. Но на фото с финиша его кресло пустое. Где он был в момент аварии?',
    x: 52,
    y: 42,
    w: 80,
    h: 46,
  },
  {
    id: 'no-skid',
    title: 'Асфальт перед поворотом',
    note: 'Ни одного чёрного следа. Пилот даже не пытался тормозить, или машина ему не давала.',
    x: 120,
    y: 134,
    w: 80,
    h: 22,
  },
  {
    id: 'wreck',
    title: 'Болид №7',
    note: 'Машина разбита в хлам. Мотор выгорел изнутри: это перегрев, а не пожар после удара. Руль и педали целы.',
    x: 226,
    y: 106,
    w: 50,
    h: 22,
  },
  {
    id: 'barrier',
    title: 'Отбойник',
    note: 'Отбойник вмят почти на метр. Болид вошёл в него на огромной скорости, так и не сбросив газ.',
    x: 278,
    y: 100,
    w: 30,
    h: 20,
  },
]

export interface Suspect {
  id: string
  name: string
  role: string
  summary: string
  sprite: PersonKind
  outfit: Palette
}

export const suspects: Suspect[] = [
  {
    id: 'pilot',
    name: 'Пилот №22',
    role: 'Победитель гонки',
    summary: 'Лучший друг погибшего и его вечный соперник. В момент аварии сам был за рулём.',
    sprite: 'pilot',
    outfit: outfits.pilot22,
  },
  {
    id: 'mechanic',
    name: 'Механик бокса №7',
    role: 'Механик',
    summary: 'Работал на пит-стопе. Сразу после аварии его увезли в следственный изолятор.',
    sprite: 'mechanic',
    outfit: outfits.mechanic7,
  },
  {
    id: 'sponsor',
    name: 'Спонсор команды',
    role: 'Спонсор',
    summary: 'Вложил в команду миллионы. Уверяет, что всю гонку просидел на трибуне.',
    sprite: 'sponsor',
    outfit: outfits.sponsor,
  },
]
