"use client";
import { useCanvas } from "@/modules/tickets";
import { useEffect } from "react";
interface CanvasRendererProps<T> {
    data: T
}
export const CanvasRenderer = <T,>({ data }: CanvasRendererProps<T>) => {
    const { canvasRef, resizeCanvas } = useCanvas();

    useEffect(() => {
        if (!canvasRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (!canvasRef.current) return;
                const ctx = canvasRef.current.getContext("2d");
                if (!ctx) return;

                const { width, height } = entry.contentRect;

                resizeCanvas(canvasRef.current, ctx, width, height, data);
            }
        });

        observer.observe(canvasRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            width={564}
            height={800}
            className="w-full h-auto block max-w-[564px] max-h-[800px] rounded-lg shadow-md"
            ref={canvasRef}
        />
    );
} 