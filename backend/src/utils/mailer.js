const OTP_TTL_MINUTES = 10;
let transporterPromise;

const hasEmailConfig = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );

const getTransporter = async () => {
  if (!hasEmailConfig()) {
    throw new Error("Email service is not configured. Add SMTP credentials to enable password reset.");
  }

  if (!transporterPromise) {
    transporterPromise = import("nodemailer").then(({ default: nodemailer }) =>
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        pool: true,
        maxConnections: 3,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })
    );
  }

  return transporterPromise;
};

export const sendPasswordResetOtp = async ({ email, name, otp }) => {
  const transporter = await getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "SkillNexa password reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1f2937;">
        <h2 style="margin-bottom: 12px;">Reset your SkillNexa password</h2>
        <p>Hello ${name || "there"},</p>
        <p>Use the OTP below to reset your password. This code is valid for ${OTP_TTL_MINUTES} minutes.</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 10px; padding: 16px 20px; background: #fff7ed; border: 1px solid #fdba74; border-radius: 14px; display: inline-block; margin: 12px 0 18px;">
          ${otp}
        </div>
        <p>If you did not request this reset, you can safely ignore this email.</p>
      </div>
    `
  });
};

export { hasEmailConfig, OTP_TTL_MINUTES };
