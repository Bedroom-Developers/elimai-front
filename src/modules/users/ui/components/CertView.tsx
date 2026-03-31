"use client";
import { useResizeObserver } from "@/modules/tickets/hooks/use-resize-observer";
import { Certificate } from "../../types";
export const CertView = ({ certData }: { certData: Certificate }) => {
    const { canvasRef } = useResizeObserver({
        data: certData,
        kind: 'certificate',
        templateUrl: '/cert-template.PNG'
    })
    return (
        <canvas
            width={564}
            height={800}
            className="w-full h-auto block max-w-[564px] max-h-[800px] rounded-lg shadow-md"
            ref={canvasRef}
        />
    );
};