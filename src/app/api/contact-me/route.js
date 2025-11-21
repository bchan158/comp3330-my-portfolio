import { Resend } from "resend";
import { contactFormSchema } from "@/lib/schemas";

// POST handler for contact form submissions
export async function POST(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    // Parse JSON body
    const body = await req.json();

    // Validate input using shared schema
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          ok: false,
          message: "Validation failed",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = validationResult.data;

    // Escape HTML to prevent XSS
    const escapeHtml = (text) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Send email using Resend
    // For testing: Resend only allows sending to your own email address
    // For production: Verify a domain and use a verified email as 'from'
    const recipientEmail = process.env.RESEND_TO_EMAIL || "bchan158@my.bcit.ca";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: `New Contact Form Message from ${escapeHtml(name)}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        {
          ok: false,
          message: "Failed to send email. Please try again later.",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        ok: true,
        message: "Email sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API route error:", error);
    return Response.json(
      {
        ok: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}

// Method guard for non-POST methods
export async function GET() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}
