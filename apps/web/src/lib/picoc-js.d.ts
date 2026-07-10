declare module 'picoc-js' {
  export function runC(code: string, writeCallback: (line: string) => void): void;
}
