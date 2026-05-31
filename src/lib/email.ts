export interface LeadEmailData {
  name: string;
  email: string;
  company?: string;
  package?: string;
  message: string;
}

export async function sendLeadEmail(lead: LeadEmailData) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || !apiKey.startsWith('re_')) {
    console.warn('RESEND_API_KEY not set. Skipping email.');
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'amir@example.com',
      subject: `New Lead: ${lead.name}`,
      html: `
        <h1>New Lead Received</h1>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Company:</strong> ${lead.company || 'N/A'}</p>
        <p><strong>Package:</strong> ${lead.package || 'Custom'}</p>
        <p><strong>Message:</strong></p>
        <p>${lead.message}</p>
        <hr />
        <p>Sent from your portfolio site.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
