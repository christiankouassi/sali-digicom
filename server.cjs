const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const RECIPIENT_EMAIL = process.env.FORM_RECIPIENT_EMAIL || 'contact@sali-digicom.com';

// Enable CORS
app.use(cors());

// Limit JSON payload size to prevent DOS
app.use(express.json({ limit: '100kb' }));

// Set up rate limiting to prevent spam (max 5 submissions per IP every 15 minutes)
const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de requêtes. Veuillez réessayer dans 15 minutes.' }
});

app.use('/api/', emailRateLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Post route to handle email submission
app.post('/api/send-email', async (req, res) => {
  const { formType, clientInfo, responses, company, message } = req.body;

  // Basic validation
  if (!clientInfo || !clientInfo.email || !clientInfo.name) {
    // Check if it's the standard contact form which has a flattened structure
    if (!req.body.email || !req.body.name) {
      return res.status(400).json({ error: 'Le nom et l\'adresse e-mail sont obligatoires.' });
    }
  }

  // Construct Email Content
  let emailTitle = '';
  let emailHtml = '';
  let clientName = '';
  let clientEmail = '';
  let clientPhone = '';
  let clientWhatsapp = '';
  let clientCompany = '';

  const now = new Date().toLocaleString('fr-FR', { timeZone: 'UTC' });

  if (formType === 'website' || formType === 'community') {
    clientName = clientInfo.name;
    clientEmail = clientInfo.email;
    clientPhone = clientInfo.phone || 'Non renseigné';
    clientWhatsapp = clientInfo.whatsapp || 'Non renseigné';
    clientCompany = clientInfo.company || 'Non renseigné';
    emailTitle = formType === 'website' 
      ? 'Nouveau Questionnaire - Création de Site Web (SALI DigiCom)' 
      : 'Nouveau Questionnaire - Community Management (SALI DigiCom)';

    // Build questionnaire responses section
    let responsesRows = '';
    let currentCategory = '';

    responses.forEach(resp => {
      if (resp.category !== currentCategory) {
        currentCategory = resp.category;
        responsesRows += `
          <tr>
            <td colspan="2" style="background-color: #ebf1f8; padding: 12px; font-weight: bold; color: #1c2c46; border-top: 2px solid #1d9878; font-size: 14px;">
              ${currentCategory}
            </td>
          </tr>
        `;
      }

      // Format answers (handle array/choices vs string)
      let answerText = '';
      if (Array.isArray(resp.answer)) {
        answerText = resp.answer.filter(Boolean).join(', ');
      } else {
        answerText = resp.answer || 'Non renseigné';
      }

      responsesRows += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e8f0; width: 40%; font-weight: 600; color: #4a5568; font-size: 13px;">
            ${resp.question}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e8f0; color: #1a202c; font-size: 13px; white-space: pre-line;">
            ${answerText}
          </td>
        </tr>
      `;
    });

    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #d3dfed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #1c2c46; padding: 20px; text-align: center; border-bottom: 3px solid #1d9878;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">SALI DigiCom</h2>
          <p style="color: #1d9878; margin: 5px 0 0 0; font-weight: bold; font-size: 14px;">${emailTitle}</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <h3 style="color: #1c2c46; border-bottom: 1px solid #ebf1f8; padding-bottom: 8px; margin-top: 0;">Coordonnées du prospect</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 30%;">Nom complet :</td>
              <td style="padding: 8px 0; color: #1a202c;">${clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Entreprise :</td>
              <td style="padding: 8px 0; color: #1a202c;">${clientCompany}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">E-mail :</td>
              <td style="padding: 8px 0; color: #1a202c;"><a href="mailto:${clientEmail}">${clientEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Téléphone :</td>
              <td style="padding: 8px 0; color: #1a202c;">${clientPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Joignable sur WhatsApp :</td>
              <td style="padding: 8px 0; color: #1a202c;">${clientWhatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Date de soumission :</td>
              <td style="padding: 8px 0; color: #718096; font-size: 12px;">${now} (UTC)</td>
            </tr>
          </table>

          <h3 style="color: #1c2c46; border-bottom: 1px solid #ebf1f8; padding-bottom: 8px; margin-top: 0;">Réponses au Questionnaire</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${responsesRows}
          </table>
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0;">
          Cet e-mail a été généré automatiquement depuis le système de formulaires de SALI DigiCom.
        </div>
      </div>
    `;
  } else {
    // Standard contact form fallback
    clientName = req.body.name;
    clientEmail = req.body.email;
    clientPhone = req.body.phone || 'Non renseigné';
    const clientCompany = company || 'Non renseigné';
    const projectType = req.body.projectType || 'Non spécifié';
    const messageContent = message || '';

    emailTitle = `Nouveau Message de Contact - ${clientCompany}`;
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d3dfed; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1c2c46; padding: 20px; text-align: center; border-bottom: 3px solid #1d9878;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">SALI DigiCom</h2>
          <p style="color: #1d9878; margin: 5px 0 0 0; font-weight: bold;">Nouveau Message de Contact</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 30%;">Nom complet :</td>
              <td style="padding: 8px 0; color: #1a202c;">${clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Entreprise :</td>
              <td style="padding: 8px 0; color: #1a202c;">${clientCompany}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">E-mail :</td>
              <td style="padding: 8px 0; color: #1a202c;"><a href="mailto:${clientEmail}">${clientEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Téléphone :</td>
              <td style="padding: 8px 0; color: #1a202c;">${clientPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Type de projet :</td>
              <td style="padding: 8px 0; color: #1a202c;">${projectType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Date d'envoi :</td>
              <td style="padding: 8px 0; color: #718096; font-size: 12px;">${now} (UTC)</td>
            </tr>
          </table>

          <h3 style="color: #1c2c46; border-bottom: 1px solid #ebf1f8; padding-bottom: 8px;">Message :</h3>
          <div style="padding: 15px; background-color: #f7fafc; border-radius: 6px; color: #2d3748; line-height: 1.6; white-space: pre-line; border-left: 3px solid #1d9878;">
            ${messageContent}
          </div>
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0;">
          Cet e-mail a été généré automatiquement depuis le formulaire de contact de SALI DigiCom.
        </div>
      </div>
    `;
  }

  // Nodemailer Mailer logic
  try {
    let transporter;

    if (process.env.SMTP_HOST) {
      // Production SMTP Transporter
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      console.log(`Sending email using configured SMTP: ${process.env.SMTP_HOST}`);
    } else {
      // Mock Transporter for Development if no credentials
      console.warn('[SMTP Warning] SMTP_HOST not configured. Using fallback console log and test mailer.');
      
      // We will print details to the console log
      console.log('================ EMAIL SUBMISSION ================');
      console.log(`To: ${RECIPIENT_EMAIL}`);
      console.log(`Subject: ${emailTitle}`);
      console.log(`Client Email: ${clientEmail || req.body.email}`);
      console.log('==================================================');

      // Generate a mock SMTP account
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const mailOptions = {
      from: `"Formulaire Web SALI DigiCom" <noreply@sali-digicom.com>`,
      replyTo: clientEmail || req.body.email,
      to: RECIPIENT_EMAIL,
      subject: emailTitle,
      html: emailHtml,
      attachments: req.body.graphicCharterFilesData && req.body.graphicCharterFiles 
        ? req.body.graphicCharterFiles.map((filename, idx) => ({
            filename: filename,
            path: req.body.graphicCharterFilesData[idx]
          }))
        : []
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log preview link for test Ethereal account
    if (!process.env.SMTP_HOST) {
      const testPreviewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[Development Mock] Test Mail sent! Preview URL: ${testPreviewUrl}`);
      return res.status(200).json({ 
        success: true, 
        message: 'Message simulé envoyé avec succès !',
        previewUrl: testPreviewUrl 
      });
    }

    console.log(`Message sent successfully: ${info.messageId}`);
    res.status(200).json({ success: true, message: 'Votre message a été envoyé avec succès !' });

  } catch (error) {
    console.error('SMTP sending error:', error);
    res.status(500).json({ error: 'Erreur lors de la transmission du message. Veuillez réessayer ultérieurement.' });
  }
});

// Fallback to static files in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
