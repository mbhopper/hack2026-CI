import { outfits, type Palette, type PersonKind } from './sprites.ts'

/**
 * Всё содержание расследования: места, улики, подозреваемые.
 * Время гонки: старт в 14:00, пит-стоп болида №7 — 14:36–14:39,
 * авария — 14:52.
 */

export type LocationId = 'track' | 'pitbox' | 'vip'

export interface Location {
  id: LocationId
  title: string
  lead: string
}

export const locations: Location[] = [
  {
    id: 'track',
    title: 'Место аварии',
    lead: 'Обломки болида №7 так и не убрали. Осмотрите трассу: нажимайте на мигающие метки.',
  },
  {
    id: 'pitbox',
    title: 'Бокс №7',
    lead: 'Здесь болид №7 стоял на пит-стопе за шестнадцать минут до аварии.',
  },
  {
    id: 'vip',
    title: 'VIP-ложа',
    lead: 'Отсюда спонсор, по его словам, смотрел всю гонку.',
  },
]

/** Прямоугольник метки в пикселях сцены 320×180 */
export interface Spot {
  x: number
  y: number
  w: number
  h: number
}

export interface Clue {
  id: string
  title: string
  note: string
  /** case — улика, которая выдаётся вместе с делом */
  location: LocationId | 'case'
  spot?: Spot
}

export const clues: Clue[] = [
  {
    id: 'finish-photo',
    title: 'Фото с финиша',
    note: 'Снимок сделан, когда болид №22 пересёк финиш. На трибуне за ним видна VIP-ложа: среднее кресло, место спонсора, пустует.',
    location: 'case',
  },
  {
    id: 'wreck',
    title: 'Болид №7',
    note: 'Машина разбита в хлам. Мотор выгорел изнутри: это перегрев, а не пожар после удара. Руль и педали целы.',
    location: 'track',
    spot: { x: 226, y: 106, w: 50, h: 22 },
  },
  {
    id: 'no-skid',
    title: 'Асфальт перед поворотом',
    note: 'Ни одного чёрного следа. Пилот даже не пытался тормозить, или машина ему не давала.',
    location: 'track',
    spot: { x: 120, y: 134, w: 80, h: 22 },
  },
  {
    id: 'barrier',
    title: 'Отбойник',
    note: 'Отбойник вмят почти на метр. Болид вошёл в него на огромной скорости, так и не сбросив газ.',
    location: 'track',
    spot: { x: 278, y: 100, w: 30, h: 20 },
  },
  {
    id: 'shift-board',
    title: 'График смены',
    note: 'На день гонки в боксе №7 записаны четыре механика, под графиком четыре подписи.',
    location: 'pitbox',
    spot: { x: 20, y: 36, w: 40, h: 44 },
  },
  {
    id: 'overalls',
    title: 'Лишний комбинезон',
    note: 'В корзине для белья — комбинезон команды без бейджа, совсем новый. В кармане браслет-пропуск в VIP-ложу.',
    location: 'pitbox',
    spot: { x: 246, y: 88, w: 40, h: 34 },
  },
  {
    id: 'telemetry',
    title: 'Ноутбук телеметрии',
    note: 'Запись болида №7: в 14:38, прямо во время пит-стопа, круиз-контроль переключили в ручной режим и зафиксировали на максимуме. После этого скорость только росла.',
    location: 'pitbox',
    spot: { x: 128, y: 70, w: 64, h: 40 },
  },
  {
    id: 'empty-seat',
    title: 'Кресло спонсора',
    note: 'Программка гонки на кресле не раскрыта, бокал полный и выдохшийся. Похоже, хозяин места ушёл почти сразу после старта.',
    location: 'vip',
    spot: { x: 128, y: 96, w: 40, h: 36 },
  },
  {
    id: 'turnstile',
    title: 'Журнал турникета',
    note: 'Пропуск спонсора: выход из ложи в 14:31, обратно — в 14:47. Его не было как раз во время пит-стопа болида №7.',
    location: 'vip',
    spot: { x: 12, y: 60, w: 36, h: 70 },
  },
  {
    id: 'insurance',
    title: 'Папка с документами',
    note: 'Страховой полис на жизнь пилота №7 на 50 миллионов, получатель выплаты — спонсор. Рядом письмо: пилот №7 уходит из команды в конце сезона.',
    location: 'vip',
    spot: { x: 236, y: 98, w: 44, h: 26 },
  },
]

export const clueById = (id: string) => clues.find((clue) => clue.id === id)
export const cluesAt = (location: LocationId) => clues.filter((clue) => clue.location === location)

/** Показание, которое детектив записал на допросе */
export interface Fact {
  id: string
  /** id подозреваемого, который это сказал */
  suspect: string
  text: string
}

export const facts: Fact[] = [
  { id: 'pilot-no-brakes', suspect: 'pilot', text: 'Болид №7 не тормозил перед поворотом, пилот даже не дёрнулся.' },
  { id: 'pilot-leaving', suspect: 'pilot', text: 'Об уходе пилота №7 из команды знали только он сам, пилот №22 и спонсор.' },
  { id: 'pilot-radio', suspect: 'pilot', text: 'По радио пилот №7 кричал, что газ держится сам и машина не слушается.' },
  { id: 'pilot-oil', suspect: 'pilot', text: 'После гонки у спонсора был испачкан маслом рукав пиджака.' },
  { id: 'mechanic-fifth', suspect: 'mechanic', text: 'На пит-стопе у болида №7 стоял пятый человек в форме команды.' },
  { id: 'mechanic-electronics', suspect: 'mechanic', text: 'Механики не трогают электронику: круиз-контроль настраивают с ноутбука или прямо в кокпите.' },
  { id: 'mechanic-cockpit', suspect: 'mechanic', text: 'В 14:38 пятый наклонился в кокпит болида №7, механик видел только спину и низкую кепку.' },
  { id: 'mechanic-badge', suspect: 'mechanic', text: 'Без бейджа в бокс не пускают, если только у тебя нет пропуска поважнее.' },
  { id: 'sponsor-alibi', suspect: 'sponsor', text: 'Спонсор утверждает, что всю гонку не выходил из VIP-ложи.' },
  { id: 'sponsor-toilet', suspect: 'sponsor', text: 'Прижатый журналом турникета, спонсор сказал, что на 16 минут выходил в уборную.' },
  { id: 'sponsor-insurance', suspect: 'sponsor', text: 'Спонсор признал страховку на 50 миллионов и проговорился, что знал про письмо об уходе.' },
  { id: 'sponsor-nervous', suspect: 'sponsor', text: 'Услышав про пятого механика у кокпита, спонсор оборвал допрос и потребовал адвоката.' },
]

export const factById = (id: string) => facts.find((fact) => fact.id === id)

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
