"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function buildSlots(bookedSlots = []) {
  const bookedSet = new Set(
    bookedSlots.map((slot) => new Date(slot).toISOString())
  );
  const slots = [];
  const now = new Date();
  for (let day = 0; day < 14; day += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) continue; // skip weekends
    [10, 14].forEach((hour) => {
      const slotDate = new Date(date);
      slotDate.setHours(hour, 0, 0, 0);
      const iso = slotDate.toISOString();
      slots.push({
        iso,
        label: `${slotDate.toLocaleDateString()} ${slotDate.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`,
        available: !bookedSet.has(iso),
      });
    });
  }
  return slots;
}

export default function BookingCalendar({ bookedSlots = [] }) {
  const slots = useMemo(() => buildSlots(bookedSlots), [bookedSlots]);
  const [selectedSlot, setSelectedSlot] = useState(
    slots.find((s) => s.available)?.iso || ""
  );
  const [form, setForm] = useState({ name: "", email: "", notes: "" });
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "", error: "" });
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slot: selectedSlot }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to book slot");
      }
      setStatus({ loading: false, message: "Request submitted!", error: "" });
    } catch (error) {
      setStatus({ loading: false, message: "", error: error.message });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-4 space-y-4">
        <div>
          <p className="text-sm text-stone-500">Availability</p>
          <h2 className="text-xl font-semibold">Pick a slot</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {slots.map((slot) => (
            <Button
              key={slot.iso}
              variant={selectedSlot === slot.iso ? "default" : "outline"}
              disabled={!slot.available}
              onClick={() => setSelectedSlot(slot.iso)}
              className={!slot.available ? "opacity-50" : ""}
            >
              {slot.label} {!slot.available ? "(Booked)" : ""}
            </Button>
          ))}
          {slots.length === 0 && (
            <p className="text-sm text-stone-500">No slots available.</p>
          )}
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div>
          <p className="text-sm text-stone-500">Request a booking</p>
          <h2 className="text-xl font-semibold">Share your details</h2>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
              Name
            </label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
              Email
            </label>
            <Input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
              Notes (optional)
            </label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Anything we should prepare?"
            />
          </div>
          <Button type="submit" disabled={!selectedSlot || status.loading}>
            {status.loading ? "Submitting..." : "Request booking"}
          </Button>
          {status.message && (
            <p className="text-sm text-green-600">{status.message}</p>
          )}
          {status.error && (
            <p className="text-sm text-red-600">{status.error}</p>
          )}
        </form>
      </Card>
    </div>
  );
}
