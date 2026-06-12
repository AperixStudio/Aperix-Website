/** Dev routes skip intro / heavy shell wrappers where needed */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
