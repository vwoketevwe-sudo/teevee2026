// app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen  bg-gradient-to-b from-cream via-roseLight/20 to-white">
      {children}
    </div>
  );
}
