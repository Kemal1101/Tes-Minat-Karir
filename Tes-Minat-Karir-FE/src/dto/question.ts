export interface QuestionBase {
    text: string;
    category: string;
    cf_pakar: number;
    keywords?: string | null;
}

export interface QuestionCreate extends QuestionBase {}

export interface QuestionUpdate {
    text?: string;
    category?: string;
    cf_pakar?: number;
    keywords?: string;
}

export interface QuestionResponse extends QuestionBase {
    id: number;
}