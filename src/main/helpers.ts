import { shell } from "electron";

export function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetUrl: string): void {
  e.preventDefault();
  shell.openExternal(targetUrl);
}
