export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-10">
      {children}
    </div>
  );
}
