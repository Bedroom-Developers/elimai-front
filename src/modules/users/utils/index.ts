import { Shareholder } from "@/shared/api/generated"
import { Certificate } from "../types"

export const formatCertificateData = (data: Shareholder): Certificate => {
    return {
        code: data.code!,
        full_name: data.user_full_name!,
        shareholder_level: data.shareholder_level!,
        position: data.position!.toString(),
        count: data.shares_count.toString(),
        id: data.id!.toString(),
    }
}