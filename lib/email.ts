import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SurveyNotificationParams {
  guestName: string;
  guestId: string;
  arrivalDate: string;
  departureDate: string;
  topPreferences: string;
}

export async function sendSurveyNotification({
  guestName,
  guestId,
  arrivalDate,
  departureDate,
  topPreferences,
}: SurveyNotificationParams) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured — skipping email notification");
    return;
  }

  await resend.emails.send({
    from: "Visit Mariemont <noreply@visitmariemont.com>",
    to: adminEmail,
    subject: `🎉 ${guestName} just completed their Visit Mariemont survey!`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f7f7f7;">
        <div style="background: #0b2618; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏛️ Mariemont Bureau of Visitor Affairs</h1>
          <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">OFFICIAL SURVEY COMPLETION NOTICE</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
          <p style="font-size: 18px; color: #0b2618;">A new survey has been received.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 12px 0; color: #666; font-size: 14px;">Guest Name</td>
              <td style="padding: 12px 0; font-weight: bold;">${guestName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 12px 0; color: #666; font-size: 14px;">Arrival Date</td>
              <td style="padding: 12px 0;">${arrivalDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 12px 0; color: #666; font-size: 14px;">Departure Date</td>
              <td style="padding: 12px 0;">${departureDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; font-size: 14px; vertical-align: top;">Key Preferences</td>
              <td style="padding: 12px 0;">${topPreferences}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${baseUrl}/admin/guests/${guestId}"
               style="background: #0b2618; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; display: inline-block;">
              Review &amp; Edit Itinerary →
            </a>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999; text-align: center;">
            Draft itinerary auto-generated and awaiting your personal touches.
          </p>
        </div>
      </div>
    `,
  });
}
