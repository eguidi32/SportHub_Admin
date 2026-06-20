export type ApiRecord = Record<string, unknown>;
export type ApiPagePayload<T> = {
  items: T[];
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
};

const MAX_EXTRACTED_OBJECTS = 300;

export const isRecord = (value: unknown): value is ApiRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
};

const extractObjectsFromArrayString = <T>(source: string): T[] => {
  const startIndex = source.indexOf("[");
  if (startIndex === -1) return [];

  const items: T[] = [];
  let depth = 0;
  let objectStart = -1;
  let inString = false;
  let escaped = false;

  for (let index = startIndex + 1; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) {
        objectStart = index;
      }

      depth += 1;
      continue;
    }

    if (char === "[") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      if (depth === 0) continue;

      depth -= 1;

      if (depth === 0 && objectStart >= 0) {
        const fragment = source.slice(objectStart, index + 1);
        const parsed = parseJson(fragment);

        if (isRecord(parsed)) {
          items.push(parsed as T);
        }

        objectStart = -1;

        if (items.length >= MAX_EXTRACTED_OBJECTS) {
          return items;
        }
      }

      continue;
    }

    if (char === "]" && depth === 0) {
      break;
    }

    if (char === "]" && depth > 0) {
      depth -= 1;
    }
  }

  return items;
};

export const toObjectPayload = <T extends ApiRecord>(data: unknown): T | null => {
  if (isRecord(data)) return data as T;

  if (Array.isArray(data)) {
    return isRecord(data[0]) ? (data[0] as T) : null;
  }

  if (typeof data !== "string") return null;

  const parsed = parseJson(data);

  if (isRecord(parsed)) return parsed as T;

  const startIndex = data.indexOf("{");
  if (startIndex === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < data.length; index += 1) {
    const char = data[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      depth += 1;
    }

    if (char === "}" || char === "]") {
      depth -= 1;
    }

    if (depth === 0) {
      const fragment = data.slice(startIndex, index + 1);
      const extracted = parseJson(fragment);
      return isRecord(extracted) ? (extracted as T) : null;
    }
  }

  return null;
};

export const toArrayPayload = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (isRecord(data)) {
    if (Array.isArray(data.content)) return data.content as T[];
    if (Array.isArray(data.data)) return data.data as T[];
    if (Array.isArray(data.items)) return data.items as T[];
  }

  if (typeof data === "string") {
    const parsed = parseJson(data);

    if (parsed !== null) {
      return toArrayPayload<T>(parsed);
    }

    return extractObjectsFromArrayString<T>(data);
  }

  return [];
};

export const toPagePayload = <T>(data: unknown): ApiPagePayload<T> => {
  if (isRecord(data)) {
    return {
      items: toArrayPayload<T>(data),
      totalElements: toNumber(data.totalElements),
      totalPages: toNumber(data.totalPages),
      page: toNumber(data.page) ?? toNumber(data.number),
      size: toNumber(data.size),
    };
  }

  return {
    items: toArrayPayload<T>(data),
  };
};

export const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string" || value.trim() === "") return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const toStringValue = (value: unknown): string | undefined => {
  return typeof value === "string" && value.trim() ? value : undefined;
};

export const toBoolean = (value: unknown): boolean | undefined => {
  return typeof value === "boolean" ? value : undefined;
};

export const compact = <T>(items: Array<T | null | undefined>): T[] => {
  return items.filter((item): item is T => item != null);
};
