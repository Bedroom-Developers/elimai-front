import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useQrScanner } from "../use-qr-scanner";

function barcode(rawValue: string): IDetectedBarcode {
    return { rawValue, boundingBox: {} as DOMRectReadOnly, cornerPoints: [], format: "" };
}

const ticketScanListMock = vi.fn();
const shareholderScanListMock = vi.fn();

vi.mock("@/shared/api/generated", () => ({
    ticketScanList: (...args: unknown[]) => ticketScanListMock(...args),
    shareholderScanList: (...args: unknown[]) => shareholderScanListMock(...args),
}));

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            mutations: { retry: false },
        },
    });
    return function Wrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };
}

const eventId = "evt-123";

const ticketBarcode = barcode("ticket-TICKET-CODE-123");
const certBarcode = barcode("cert-CERT-CODE-456");
const unknownBarcode = barcode("unknown-XYZ");

describe("useQrScanner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns idle result and dialog state initially", () => {
        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        expect(result.current.result).toEqual({ status: "idle" });
        expect(result.current.openScannerDialog).toBe(false);
    });

    it("calls ticketScanList and sets success when ticket scan succeeds", async () => {
        ticketScanListMock.mockResolvedValue({ message: "ok" });
        shareholderScanListMock.mockResolvedValue(undefined);

        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([ticketBarcode]);
        });

        expect(ticketScanListMock).toHaveBeenCalledWith({
            event_id: eventId,
            code: "ticket-TICKET-CODE-123",
        });
        expect(shareholderScanListMock).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current.result.status).toBe("success");
            expect(result.current.result).toMatchObject({
                status: "success",
                message: expect.stringContaining("Сканирование успешно"),
            });
        });
    });

    it("sets error message when ticket scan returns 409", async () => {
        const err = Object.assign(new Error("Conflict"), {
            response: { status: 409, data: { error: "not-scan" } },
        });
        ticketScanListMock.mockRejectedValue(err);

        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([ticketBarcode]);
        });

        await waitFor(() => {
            expect(result.current.result.status).toBe("error");
            expect(result.current.result).toMatchObject({
                status: "error",
                message: expect.stringContaining("данный билет уже использован"),
            });
        });
    });

    it("calls shareholderScanList and sets success when cert scan succeeds with level", async () => {
        shareholderScanListMock.mockResolvedValue({
            full_name: "Иван Иванов",
            shareholder_level: "2-A",
            bonus_status: true,
        });
        ticketScanListMock.mockResolvedValue(undefined);

        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([certBarcode]);
        });

        expect(shareholderScanListMock).toHaveBeenCalledWith({
            event_id: eventId,
            code: "cert-CERT-CODE-456",
        });
        expect(ticketScanListMock).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current.result).toMatchObject({
                status: "success",
                message: expect.stringMatching(/Иван Иванов/),
            });
            expect(result.current.result).toMatchObject({
                status: "success",
                message: expect.stringContaining("2-A"),
            });
        });
    });

    it("sets cert not found when cert scan returns level 0", async () => {
        shareholderScanListMock.mockResolvedValue({
            shareholder_level: undefined,
            full_name: "",
            bonus_status: false,
        });

        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([certBarcode]);
        });

        await waitFor(() => {
            expect(result.current.result).toMatchObject({
                status: "error",
                message: expect.stringContaining("Сертификат не найден"),
            });
        });
    });

    it("sets error when cert scan returns 409 used", async () => {
        const err = Object.assign(new Error("Conflict"), {
            response: {
                status: 409,
                data: { error: "used", time: "2025-01-01T12:00+00:00" },
            },
        });
        shareholderScanListMock.mockRejectedValue(err);

        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([certBarcode]);
        });

        await waitFor(() => {
            expect(result.current.result).toMatchObject({
                status: "error",
                message: expect.stringContaining("Сертификат уже использован"),
            });
            expect(result.current.result).toMatchObject({
                status: "error",
                message: expect.stringContaining("Время последнего сканирования"),
            });
        });
    });

    it("sets error when cert scan returns 409 bonus_status false", async () => {
        const err = Object.assign(new Error("Conflict"), {
            response: {
                status: 409,
                data: { error: "other", bonus_status: false },
            },
        });
        shareholderScanListMock.mockRejectedValue(err);

        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([certBarcode]);
        });

        await waitFor(() => {
            expect(result.current.result).toMatchObject({
                status: "error",
                message: expect.stringContaining("Бонусы не активны"),
            });
        });
    });

    it("sets cert not found when cert scan returns 404", async () => {
        const err = Object.assign(new Error("Not found"), {
            response: { status: 404, data: {} },
        });
        shareholderScanListMock.mockRejectedValue(err);

        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([certBarcode]);
        });

        await waitFor(() => {
            expect(result.current.result).toMatchObject({
                status: "error",
                message: expect.stringContaining("Сертификат не найден"),
            });
        });
    });

    it("sets error for unknown barcode type", async () => {
        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([unknownBarcode]);
        });

        expect(ticketScanListMock).not.toHaveBeenCalled();
        expect(shareholderScanListMock).not.toHaveBeenCalled();
        expect(result.current.result).toMatchObject({
            status: "error",
            message: expect.stringContaining("Неправильный формат билета"),
        });
    });

    it("handleOpenChange(false) sets result to idle", async () => {
        ticketScanListMock.mockResolvedValue({ message: "ok" });
        const { result } = renderHook(() => useQrScanner({ id: eventId }), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.onScan([ticketBarcode]);
        });
        await waitFor(() => expect(result.current.result.status).toBe("success"));

        act(() => {
            result.current.handleOpenChange(false);
        });

        expect(result.current.result).toEqual({ status: "idle" });
    });

    it("does not call scan when onScan receives empty result and no id", () => {
        const { result } = renderHook(() => useQrScanner({ id: "" }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.onScan([]);
        });

        expect(ticketScanListMock).not.toHaveBeenCalled();
        expect(shareholderScanListMock).not.toHaveBeenCalled();
    });
});
