import type { Route } from '../types'
import { ROUTES_DOMESTIC_SINGLE } from './routes-domestic-single'
import { ROUTES_DOMESTIC_TOUR } from './routes-domestic-tour'
import { ROUTES_DOMESTIC_SEASONAL } from './routes-domestic-seasonal'
import { ROUTES_ASIA } from './routes-asia'
import { ROUTES_EUROPE } from './routes-europe'
import { ROUTES_AMERICAS_OCEANIA_ETC } from './routes-americas-oceania-etc'
import { ROUTES_EXTRA } from './routes-extra'
import { ROUTES_EXTRA_2 } from './routes-extra-2'
import { ROUTES_EXTRA_3 } from './routes-extra-3'
import { ROUTES_EXTRA_4 } from './routes-extra-4'
import { ROUTES_EXTRA_5 } from './routes-extra-5'
import { ROUTES_1N2 } from './routes-1n2'

export const ALL_ROUTES: Route[] = [
    ...ROUTES_DOMESTIC_SINGLE,
    ...ROUTES_DOMESTIC_TOUR,
    ...ROUTES_DOMESTIC_SEASONAL,
    ...ROUTES_ASIA,
    ...ROUTES_EUROPE,
    ...ROUTES_AMERICAS_OCEANIA_ETC,
    ...ROUTES_EXTRA,
    ...ROUTES_EXTRA_2,
    ...ROUTES_EXTRA_3,
    ...ROUTES_EXTRA_4,
    ...ROUTES_EXTRA_5,
    ...ROUTES_1N2,
]
