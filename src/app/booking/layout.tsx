import { NotificationProvider } from "./context/NotificationContext"

export default function BookingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}
