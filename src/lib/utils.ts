export type ClassValue = string | false | null | undefined;

export function cn(...inputs: ClassValue[]) {
  return inputs.filter((input): input is string => Boolean(input)).join(" ");
}
