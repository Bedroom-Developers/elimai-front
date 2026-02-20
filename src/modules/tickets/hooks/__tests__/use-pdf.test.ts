import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Ticket } from "../../types";
import { useCreatePdf } from "../use-pdf";

import { EventStatus } from "@/modules/events/constants";
import { Certificate } from "@/modules/users/types";
import * as utils from "../../utils";
vi.mock("pdf-lib", () => {
    const addPageMock = vi.fn(() => ({
        getWidth: () => 800,
        getHeight: () => 600,
        drawImage: vi.fn(),
        drawText: vi.fn(),
        setFont: vi.fn(),
        setFontSize: vi.fn(),
    }))
    const imageMock = {
        scale: vi.fn(() => ({
            width: 800,
            height: 600,
        })),
    }

    const pdfDocMock = {
        registerFontkit: vi.fn(),
        embedFont: vi.fn().mockResolvedValue({
            widthOfTextAtSize: () => 100,
        }),
        addPage: addPageMock,
        embedPng: vi.fn().mockResolvedValue(imageMock),
        embedJpg: vi.fn().mockResolvedValue(imageMock),
    }
    return {
        PDFDocument: {
            create: vi.fn().mockResolvedValue(pdfDocMock),
        },
        rgb: () => ({}),
    }
})

describe('use-pdf', () => {
    beforeEach(() => {
        vi.spyOn(global, "fetch" as any).mockResolvedValue({
            arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
        } as any)
        vi.spyOn(utils, "downloadPDF").mockImplementation(async () => { })
        vi.spyOn(utils, "generateQrDataUrl").mockResolvedValue("data:image/png;base64,xxx")
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })
    it('should download tickets PDF', async () => {
        const { result } = renderHook(() => useCreatePdf())
        const { downloadTicketsPDF } = result.current
        const tickets: Ticket[] = [{ code: '1', status: EventStatus.ACTIVE, date: new Date().toISOString(), name_kz: "Event1", name_ru: 'Event2' }]
        await downloadTicketsPDF(tickets)
        expect(utils.downloadPDF).toHaveBeenCalledTimes(1)
    })

    it("should download cert PDF", async () => {
        const { result } = renderHook(() => useCreatePdf())
        const { downloadCertPDF } = result.current
        const cert: Certificate = { code: '123', full_name: 'John Doe', shareholder_level: 'A', position: '1', count: '1', id: '1' }
        await downloadCertPDF(cert)
        expect(utils.downloadPDF).toHaveBeenCalledTimes(1)
    })

    it("should not download cert PDF if tickets length is 0", async () => {
        const { result } = renderHook(() => useCreatePdf())
        const { downloadTicketsPDF } = result.current
        const tickets: Ticket[] = []
        await downloadTicketsPDF(tickets)
        expect(utils.downloadPDF).not.toHaveBeenCalled()
    })
})