import nodemailer from "nodemailer";

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const transporter = createTransporter();

  if (!transporter) {
    // Dev mode: no SMTP configured — log to console
    console.log("\n📧 Password reset link (configure SMTP_* env vars to send real emails):");
    console.log(`   ${resetUrl}\n`);
    return;
  }

  const from = process.env["SMTP_FROM"] ?? "Wardia <no-reply@wardia.app>";
  await transporter.sendMail({ from, to, subject: "Recupera tu contraseña – Wardia", html: buildHtml(resetUrl) });
}

function buildHtml(resetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperar contraseña</title>
</head>
<body style="margin:0;padding:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0891b2 0%,#2563eb 100%);padding:40px 40px 32px;text-align:center;">
              <div style="display:inline-block;width:52px;height:52px;background:rgba(255,255,255,0.18);border-radius:14px;text-align:center;line-height:52px;margin-bottom:16px;">
                <span style="font-size:26px;">🛡️</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">WARDIA</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;font-weight:500;">Personal Finance Manager</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#18181b;">Recupera tu contraseña</h2>
              <p style="margin:0 0 28px;font-size:15px;color:#52525b;line-height:1.7;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta.<br />
                Haz clic en el botón de abajo para crear una nueva contraseña.
              </p>
              <div style="text-align:center;margin:0 0 32px;">
                <a href="${resetUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#0891b2,#2563eb);color:#ffffff;text-decoration:none;padding:15px 36px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.2px;">
                  Restablecer contraseña →
                </a>
              </div>
              <p style="margin:0 0 6px;font-size:12px;color:#71717a;">O copia este enlace en tu navegador:</p>
              <p style="margin:0 0 28px;font-size:12px;color:#0891b2;word-break:break-all;">${resetUrl}</p>
              <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 20px;" />
              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.6;">
                Este enlace expira en <strong style="color:#71717a;">1 hora</strong>.
                Si no solicitaste este cambio, ignora este correo.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:18px 40px;text-align:center;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">© 2026 WARDIA. Todos los derechos reservados.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
