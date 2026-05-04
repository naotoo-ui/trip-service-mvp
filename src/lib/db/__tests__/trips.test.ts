import { generateShareId } from '../trips'

describe('generateShareId', () => {
    it('8文字の英数字文字列を返す', () => {
        const id = generateShareId()
        expect(id).toHaveLength(8)
        expect(id).toMatch(/^[a-z0-9]{8}$/)
    })

    it('呼び出すたびに異なる値を返す', () => {
        const ids = new Set(Array.from({ length: 20 }, generateShareId))
        expect(ids.size).toBeGreaterThan(15)
    })
})
