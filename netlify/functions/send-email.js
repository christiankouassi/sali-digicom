const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée. Seul POST est permis.' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { formType, clientInfo, responses, company, message } = data;
    const recipientEmail = process.env.FORM_RECIPIENT_EMAIL || 'contact@sali-digicom.com';
    const now = new Date().toLocaleString('fr-FR', { timeZone: 'UTC' });

    let emailTitle = '';
    let emailHtml = '';
    let clientName = '';
    let clientEmail = '';

    if (formType === 'satisfaction') {
      clientName = data.clientName || 'Anonyme';
      clientEmail = data.clientEmail || 'Non renseigné';
      const questionnaireType = data.questionnaireType === 'website' ? 'Création de Site Web' : 'Community Management';
      const simplicityRating = data.simplicityRating || 'N/A';
      const coherenceRating = data.coherenceRating || 'N/A';
      const feedback = data.feedback || 'Aucun commentaire fourni.';

      emailTitle = `Enquête de satisfaction (${questionnaireType}) - Notes: ${simplicityRating}/10 & ${coherenceRating}/10`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d3dfed; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1c2c46; padding: 20px; text-align: center; border-bottom: 3px solid #1d9878;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">SALI DigiCom</h2>
            <p style="color: #1d9878; margin: 5px 0 0 0; font-weight: bold;">Enquête de Satisfaction Client</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 45%;">Questionnaire :</td><td>${questionnaireType}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Prospect :</td><td>${clientName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">E-mail :</td><td>${clientEmail}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Facilité :</td><td>${simplicityRating} / 10</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Cohérence :</td><td>${coherenceRating} / 10</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Date :</td><td>${now} (UTC)</td></tr>
            </table>
            <h4>Commentaires :</h4>
            <p style="padding: 12px; background-color: #f7fafc; border-left: 3px solid #1d9878;">${feedback}</p>
          </div>
        </div>
      `;
    } else if (formType === 'website' || formType === 'community') {
      clientName = clientInfo?.name || data.name || 'Prospect';
      clientEmail = clientInfo?.email || data.email || '';
      const clientPhone = clientInfo?.phone || 'Non renseigné';
      const clientCompany = clientInfo?.company || 'Non renseigné';
      const clientWhatsapp = clientInfo?.whatsapp ? 'Oui' : 'Non';

      emailTitle = formType === 'website' 
        ? 'Nouveau Questionnaire - Création de Site Web (SALI DigiCom)' 
        : 'Nouveau Questionnaire - Community Management (SALI DigiCom)';

      let responsesRows = '';
      if (Array.isArray(responses)) {
        responses.forEach(resp => {
          let ans = Array.isArray(resp.answer) ? resp.answer.filter(Boolean).join(', ') : (resp.answer || 'Non renseigné');
          responsesRows += `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e1e8f0; width: 40%; font-weight: bold;">${resp.question}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e1e8f0;">${ans}</td>
            </tr>
          `;
        });
      }

      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #d3dfed; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1c2c46; padding: 20px; text-align: center; border-bottom: 3px solid #1d9878;">
            <h2 style="color: #ffffff; margin: 0;">SALI DigiCom</h2>
            <p style="color: #1d9878; margin: 5px 0 0 0; font-weight: bold;">${emailTitle}</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <h3>Coordonnées du prospect</h3>
            <p><strong>Nom :</strong> ${clientName}<br/>
            <strong>Entreprise :</strong> ${clientCompany}<br/>
            <strong>Email :</strong> ${clientEmail}<br/>
            <strong>Téléphone :</strong> ${clientPhone} (WhatsApp: ${clientWhatsapp})</p>
            <h3>Réponses au questionnaire</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${responsesRows}
            </table>
          </div>
        </div>
      `;
    } else {
      clientName = data.name || 'Prospect';
      clientEmail = data.email || '';
      emailTitle = `Nouveau Message de Contact - ${data.company || clientName}`;
      emailHtml = `<p>Nom: ${clientName}<br/>Email: ${clientEmail}<br/>Message: ${message || ''}</p>`;
    }

    // Try sending if SMTP is available
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: parseInt(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Formulaire SALI DigiCom" <noreply@sali-digicom.com>`,
        replyTo: clientEmail || undefined,
        to: recipientEmail,
        subject: emailTitle,
        html: emailHtml
      });
      console.log('Email sent successfully via Netlify serverless function.');
    } else {
      console.log('[Netlify Function Simulation] Email received:');
      console.log('Title:', emailTitle);
      console.log('Client:', clientName, clientEmail);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Votre message a été transmis avec succès !' })
    };

  } catch (err) {
    console.error('Serverless function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur lors du traitement du formulaire.', details: err.message })
    };
  }
};
