type ClassValue = ClassValue[] | Record<string, boolean | null | undefined> | string | number | null | undefined | false;

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (Array.isArray(input)) {
      const value = cn(...input);
      if (value) classes.push(value);
      continue;
    }

    if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
      continue;
    }

    classes.push(String(input));
  }

  return classes.join(" ");
}
