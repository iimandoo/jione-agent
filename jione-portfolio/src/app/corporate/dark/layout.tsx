'use client';
import { StyleProvider } from '@/styles/provider';
import { darkTheme } from '@/styles/themes/dark';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <StyleProvider theme={darkTheme}>{children}</StyleProvider>;
}
