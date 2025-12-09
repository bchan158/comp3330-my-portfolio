import { NextResponse } from "next/server";
import { Resend } from "resend";
import { bookingRequestSchema } from "@/lib/schemas";
import { createBooking, listBookings } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const upcomingOnly = searchParams.get("upcoming") !== "false";
    const bookings = await listBookings({ upcomingOnly });
    return NextResponse.json({ message: "Bookings fetched", data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message, data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const parsed = bookingRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid booking request", errors: parsed.error.errors },
        { status: 400 }
      );
    }
    const booking = await createBooking(parsed.data);

    // Email confirmation/notification
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const toEmail = process.env.RESEND_TO_EMAIL || parsed.data.email;
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `New booking from ${parsed.data.name}`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${parsed.data.name}</p>
          <p><strong>Email:</strong> ${parsed.data.email}</p>
          <p><strong>Requested slot:</strong> ${parsed.data.slot}</p>
          <p><strong>Notes:</strong> ${parsed.data.notes || "None"}</p>
        `,
        replyTo: parsed.data.email,
      });
    }

    return NextResponse.json(
      { message: "Booking request received", data: booking },
      { status: 201 }
    );
  } catch (error) {
    const status = error.message === "Slot already booked" ? 409 : 500;
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status }
    );
  }
}
