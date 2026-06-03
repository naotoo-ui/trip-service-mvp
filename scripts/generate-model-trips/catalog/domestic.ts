import type { DestinationEntry } from '../types'
import { DOMESTIC_PART1 } from './domestic-1'
import { DOMESTIC_PART2 } from './domestic-2'
import { DOMESTIC_PART3 } from './domestic-3'
import { DOMESTIC_PART4 } from './domestic-4'
import { DOMESTIC_EXTRA } from './domestic-extra'

export const DOMESTIC_DESTINATIONS: DestinationEntry[] = [
    ...DOMESTIC_PART1,
    ...DOMESTIC_PART2,
    ...DOMESTIC_PART3,
    ...DOMESTIC_PART4,
    ...DOMESTIC_EXTRA,
]
