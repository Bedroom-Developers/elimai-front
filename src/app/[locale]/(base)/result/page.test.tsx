import { renderWithProviders } from '@/shared/lib/tests'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Page from './page'

describe('ResultPage', () => {

    it('extracts searchParams correctly', async () => {
        const page = await Page({ searchParams: Promise.resolve({ order: '1123' }) })
        const { findByTestId } = render(renderWithProviders(page))

        expect(await findByTestId('result-page')).toHaveAttribute('data-order', '1123')
    })

    it("if order is not provided, should show error", async () => {

        const page = await Page({
            searchParams: Promise.resolve({
                order: ''
            })
        })

        const { findByTestId } = render(renderWithProviders(page))

        expect(await findByTestId('purchase-error-view')).toBeInTheDocument()
    })
})
