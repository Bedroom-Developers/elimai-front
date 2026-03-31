"use client";
import { useEffect } from "react";
import { CanvasData, useCanvas } from "./use-canvas";

interface UseResizeObserverProps {
    data: CanvasData
    kind: 'certificate' | 'ticket'
    templateUrl: string
}

export const useResizeObserver = ({ data, kind, templateUrl }: UseResizeObserverProps) => {
    const { canvasRef, render } = useCanvas();

    useEffect(() => {
        if (!canvasRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (!canvasRef.current) return;
                const ctx = canvasRef.current.getContext("2d");
                if (!ctx) return;

                const { width, height } = entry.contentRect;

                render({
                    data: {
                        templateUrl: templateUrl,
                        kind: kind,
                        data: data
                    }, c: canvasRef.current, ctx, observedWidth: width, observedHeight: height
                });
            }
        });

        observer.observe(canvasRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);
    return { canvasRef }

}