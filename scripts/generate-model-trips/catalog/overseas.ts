import type { DestinationEntry } from '../types'
import { OVERSEAS_PART1 } from './overseas-1'
import { OVERSEAS_PART2 } from './overseas-2'
import { OVERSEAS_PART3 } from './overseas-3'
import { OVERSEAS_PART4 } from './overseas-4'
import { OVERSEAS_EXTRA_EUROPE } from './overseas-extra-europe'
import { OVERSEAS_EXTRA_ASIA } from './overseas-extra-asia'
import { OVERSEAS_EXTRA_AMERICAS_AFRICA } from './overseas-extra-americas-africa'

export const OVERSEAS_DESTINATIONS: DestinationEntry[] = [
    ...OVERSEAS_PART1,
    ...OVERSEAS_PART2,
    ...OVERSEAS_PART3,
    ...OVERSEAS_PART4,
    ...OVERSEAS_EXTRA_EUROPE,
    ...OVERSEAS_EXTRA_ASIA,
    ...OVERSEAS_EXTRA_AMERICAS_AFRICA,
]
