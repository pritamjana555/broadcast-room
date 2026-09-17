import RoomShell from "@/app/components/room/room-shell";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoomShell>{children}</RoomShell>;
}