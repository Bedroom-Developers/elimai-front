export type Ticket = {
    name_ru: string;
    name_kz: string;
    date: string;
    status: string;
    code: string;
};
export type ScanStatus = "idle" | "loading" | "success" | "error";

export type ScanResult =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; message: string }
    | { status: "error"; message: string };

