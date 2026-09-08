import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

const schema = z.object({
  bookingId: z.string().uuid(),
  title: z.string().min(1),
  startsAt: z.string().min(1),
  durationMin: z.number().int().positive().max(600),
  attendeeEmail: z.string().email().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

/**
 * Cria o evento na Agenda do Google da Josi com sala do Google Meet
 * e grava o link no agendamento.
 */
export const createMeetForBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const calendarKey = process.env["GOOGLE_CALENDAR_API_KEY"];
    if (!lovableKey || !calendarKey) {
      return { ok: false as const, reason: "not_configured" };
    }

    const start = new Date(data.startsAt);
    const end = new Date(start.getTime() + data.durationMin * 60_000);

    const res = await fetch(
      `${GATEWAY_URL}/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": calendarKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: data.title,
          description: data.notes ?? "Sessão agendada pela plataforma Josi Nascimento.",
          start: { dateTime: start.toISOString(), timeZone: "America/Sao_Paulo" },
          end: { dateTime: end.toISOString(), timeZone: "America/Sao_Paulo" },
          attendees: data.attendeeEmail ? [{ email: data.attendeeEmail }] : undefined,
          conferenceData: {
            createRequest: {
              requestId: data.bookingId,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Google Calendar failed [${res.status}]: ${body}`);
      return { ok: false as const, reason: `google_error_${res.status}` };
    }

    const event = (await res.json()) as {
      id?: string;
      hangoutLink?: string;
      conferenceData?: { entryPoints?: { uri?: string; entryPointType?: string }[] };
    };
    const meetUrl =
      event.hangoutLink ??
      event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ??
      null;

    await context.supabase
      .from("bookings")
      .update({ meet_url: meetUrl, google_event_id: event.id ?? null })
      .eq("id", data.bookingId);

    return { ok: true as const, meetUrl, eventId: event.id ?? null };
  });
