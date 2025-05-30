interface ParsedHttpStructure {
    method: string;
    path: string;
    lines: Array<string>;
}

interface ParsedRequest {
    method: string;
    path: string;
    headers: Record<string, string>;
    body: string;
}

export type { ParsedHttpStructure, ParsedRequest };
