export interface TransformationResult {
  summary: string;
  emoji_version: string;
  formal_version: string;
}

export interface MagicResponse {
  result: TransformationResult | null;
  error: string | null;
}