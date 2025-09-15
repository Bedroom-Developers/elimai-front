import { customFetch } from "@/shared/api";
import { Game, GameDTO } from "@/shared/consts";
import { AdminTicket, Shareholder, Ticket } from "@/shared/types";

export const rAddGame = (body: GameDTO) => {
  return customFetch({ method: "POST", path: "events/", body: { json: body } });
};
export const rEditGame = (body: Game) => {
  return customFetch({
    method: "PATCH",
    path: `events/${body.id}/`,
    body: { json: body },
  });
};
export const rDeleteGame = (id: number) => {
  return customFetch({ method: "DELETE", path: `events/${id}/` });
};
export const rGetGame = (id: number) => {
  return customFetch({ method: "GET", path: `events/${id}/` });
};

export const rGetGameExcel = (id: number): Promise<Blob> => {
  return customFetch({
    method: "GET",
    path: `export-tickets/`,
    query: { EVENT_ID: id },
    returnType: "blob",
  });
};
export const rGetSubExcel = (): Promise<Blob> => {
  return customFetch({
    method: "GET",
    path: `export-aboniments/`,
    returnType: "blob",
  });
};

export const rGetGames = (): Promise<Game[]> => {
  return customFetch({ method: "GET", path: "get-events" });
};

export const rBuyTicket = (body: { data: any }): Promise<any> => {
  return customFetch({
    method: "POST",
    path: "create-ticket/",
    body: { json: body.data },
  });
};

export const rCreateAdminTicket = (body: {
  data: any;
}): Promise<AdminTicket> => {
  return customFetch({
    method: "POST",
    path: "tickets/",
    body: { json: body.data },
  });
};
export const rCreateAdminSub = (body: { data: any }): Promise<AdminTicket> => {
  return customFetch({
    method: "POST",
    path: "aboniments/",
    body: { json: body.data },
  });
};
export const rGetTickets = (order: string | null): Promise<Ticket[]> => {
  return customFetch({
    method: "GET",
    path: "get-ticket/",
    query: { ORDER: order },
  });
};
export const rGetSub = (order: string | null): Promise<Ticket[]> => {
  return customFetch({
    method: "GET",
    path: "get-aboniment/",
    query: { ORDER: order },
  });
};

export const rGetTicketsByUser = (): Promise<Ticket[]> => {
  return customFetch({ method: "GET", path: "get-tickets-by-user/" });
};

export const rGetSubByUser = (): Promise<Ticket> => {
  return customFetch({ method: "GET", path: "get-aboniment-by-user/" });
};
export const rGetCertByUser = (): Promise<Shareholder> => {
  return customFetch({ method: "GET", path: "my-shareholder/" });
};

export const rGetTicketsCount = (
  gameId: number
): Promise<{ message: string }> => {
  return customFetch({
    method: "GET",
    path: "get-tickets-count/",
    query: { EVENT_ID: gameId },
  });
};
export const rGetSubscriptionCount = (): Promise<{ message: string }> => {
  return customFetch({ method: "GET", path: "get-aboniment-count/" });
};

export const rGetUserTicketLimit = (
  gameId: number
): Promise<{ message: string }> => {
  return customFetch({
    method: "GET",
    path: "event-limit/",
    query: { EVENT_ID: gameId },
  });
};

export const rScanTicket = (data: {
  code: string;
  event_id: string;
}): Promise<{ message: string }> => {
  return customFetch({ method: "GET", path: "ticket-scan/", query: data });
};
export const rScanSub = (data: {
  code: string;
  event_id: string;
}): Promise<{ message: string }> => {
  return customFetch({ method: "GET", path: "aboniment-scan/", query: data });
};

export const rScanCert = (data: {
  code: string;
  event_id: string;
}): Promise<ScanCertResponse> => {
  return customFetch({
    method: "GET",
    path: "shareholder-scan/",
    query: data,
  });
};

export type ScanCertResponse = {
  bonus_status: boolean;
  expiry: string;
  full_name: string;
  message: string;
  shareholder_level: string;
  time: string;
};
