export const GameStatus = ["Активный", "Неактивный", "Завершен"];
export type GameDTO = Omit<Game, "id" | "created_at">;
export type Game = {
  id: number; // Assuming `id` is a unique identifier, often a number
  name_kz: string; // Assuming `name_kz` is a string (Kazakh name)
  name_ru: string; // Assuming `name_ru` is a string (Russian name)
  event_date: string; // Can be a string (ISO format) or a Date object
  created_at: string; // Can be a string (ISO format) or a Date object
  status: string; // Depending on the status type (string, boolean, or enum)
};

export interface AdminTicket {
  id: number;
  event: number;
  order: number;
  code: string;
  created_at: string;
  will_deactivate_at: string;
  status: string;
  email: string;
  telephone: string;
  psign: string;
  user: number;
}

export type Ticket = {
  name_ru: string;
  name_kz: string;
  date: string;
  status: string;
  code: string;
};
export type Shareholder = {
  id: number;
  full_name: string;
  phone: string;
  code: string;
  email: string;
  birth_date: string;
  shares_count: number;
  shareholder_level: string;
  shareholder_level_display: string;
  bonus_status: boolean;
  e_certificate: boolean;
  created_at: string;
  updated_at: string;
  total_shares_value: number;
  level_description: string;
  waiting_confirmation: boolean;
};

export const notificationErrors = {
  file: {
    title: "Ошибка при загрузке файла.",
    message: "Что-то пошло не так, попробуйте позже.",
  },
  create: {
    title: "Ошибка при создании записи.",
    message: "Что-то пошло не так, попробуйте позже.",
  },
  update: {
    title: "Ошибка при обновлении записи.",
    message: "Что-то пошло не так, попробуйте позже.",
  },
  delete: {
    title: "Ошибка при удалении записи.",
    message: "Что-то пошло не так, попробуйте позже.",
  },
  get: {
    title: "Ошибка загрузки.",
    message: "Произошла ошибка при загрузке записей.",
  },
  login: {
    title: "Вход.",
    message: "Oшибка входа.",
  },
};

export const notificationSuccess = {
  file: {
    title: "Загружено.",
    message: "Файл загружен успешно.",
  },
  create: {
    title: "Создано.",
    message: "Запись создана успешно.",
  },
  update: {
    title: "Обновлено.",
    message: "Запись обновлена успешно.",
  },
  delete: {
    title: "Удалено.",
    message: "Запись удалена успешно.",
  },
  login: {
    title: "Вход",
    message: "Вы успешно авторизовались.",
  },
};
