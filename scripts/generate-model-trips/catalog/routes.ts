import type { Route } from '../types'
import { ROUTES_DOMESTIC_SINGLE } from './routes-domestic-single'
import { ROUTES_DOMESTIC_TOUR } from './routes-domestic-tour'
import { ROUTES_DOMESTIC_SEASONAL } from './routes-domestic-seasonal'
import { ROUTES_ASIA } from './routes-asia'
import { ROUTES_EUROPE } from './routes-europe'
import { ROUTES_AMERICAS_OCEANIA_ETC } from './routes-americas-oceania-etc'

export const ALL_ROUTES: Route[] = [
    ...ROUTES_DOMESTIC_SINGLE,
    ...ROUTES_DOMESTIC_TOUR,
    ...ROUTES_DOMESTIC_SEASONAL,
    ...ROUTES_ASIA,
    ...ROUTES_EUROPE,
    ...ROUTES_AMERICAS_OCEANIA_ETC,
]
