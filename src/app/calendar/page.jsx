import BookingCalendar from "@/components/BookingCalendar";
import { listBookings } from "@/lib/db";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const existing = await listBookings({ upcomingOnly: true });
  const bookedSlots = existing.map((b) => b.slot);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <Card className="p-6 space-y-2">
        <p className="text-sm text-stone-500">Availability</p>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Book a call
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Pick an available slot and send a request. Confirmations are emailed.
        </p>
      </Card>

      <BookingCalendar bookedSlots={bookedSlots} />
    </main>
  );
}
