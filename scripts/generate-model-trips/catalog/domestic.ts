import type { DestinationEntry } from '../types'
import { DOMESTIC_PART1 } from './domestic-1'
import { DOMESTIC_PART2 } from './domestic-2'
import { DOMESTIC_PART3 } from './domestic-3'
import { DOMESTIC_PART4 } from './domestic-4'
import { DOMESTIC_EXTRA } from './domestic-extra'
import { DOMESTIC_NICHE } from './domestic-niche'
import { DOMESTIC_NICHE_2 } from './domestic-niche-2'
import { DOMESTIC_NICHE_3 } from './domestic-niche-3'
import { DOMESTIC_1N2 } from './domestic-1n2'

export const DOMESTIC_DESTINATIONS: DestinationEntry[] = [
    ...DOMESTIC_PART1,
    ...DOMESTIC_PART2,
    ...DOMESTIC_PART3,
    ...DOMESTIC_PART4,
    ...DOMESTIC_EXTRA,
    ...DOMESTIC_NICHE,
    ...DOMESTIC_NICHE_2,
    ...DOMESTIC_NICHE_3,
    ...DOMESTIC_1N2,
]
