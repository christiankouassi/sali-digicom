<?php
// PHP Script to handle SALI DigiCom email submissions on Infomaniak Shared Hosting
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// CONFIGURATION: Set your recipient email address here
$recipient_email = "contact@sali-digicom.com";

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée. Seuls les appels POST sont permis."]);
    exit;
}

// Get JSON payload
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Données JSON invalides ou vides."]);
    exit;
}

$formType = isset($data['formType']) ? $data['formType'] : 'contact';
$clientInfo = isset($data['clientInfo']) ? $data['clientInfo'] : null;
$responses = isset($data['responses']) ? $data['responses'] : [];

// Basic validation
if ($formType === 'website' || $formType === 'community') {
    if (!$clientInfo || empty($clientInfo['email']) || empty($clientInfo['name'])) {
        http_response_code(400);
        echo json_encode(["error" => "Le nom et l'adresse e-mail sont obligatoires."]);
        exit;
    }
    $clientName = strip_tags($clientInfo['name']);
    $clientEmail = filter_var($clientInfo['email'], FILTER_VALIDATE_EMAIL);
    $clientPhone = isset($clientInfo['phone']) ? strip_tags($clientInfo['phone']) : 'Non renseigné';
    $clientWhatsapp = isset($clientInfo['whatsapp']) ? strip_tags($clientInfo['whatsapp']) : 'Non renseigné';
    $clientCompany = isset($clientInfo['company']) ? strip_tags($clientInfo['company']) : 'Non renseigné';
} else {
    // Standard contact form fallback
    if (empty($data['name']) || empty($data['email'])) {
        http_response_code(400);
        echo json_encode(["error" => "Le nom et l'adresse e-mail sont obligatoires."]);
        exit;
    }
    $clientName = strip_tags($data['name']);
    $clientEmail = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    $clientPhone = isset($data['phone']) ? strip_tags($data['phone']) : 'Non renseigné';
    $clientCompany = isset($data['company']) ? strip_tags($data['company']) : 'Non renseigné';
    $projectType = isset($data['projectType']) ? strip_tags($data['projectType']) : 'Non spécifié';
    $messageContent = isset($data['message']) ? htmlspecialchars($data['message']) : '';
}

if (!$clientEmail) {
    http_response_code(400);
    echo json_encode(["error" => "Adresse e-mail invalide."]);
    exit;
}

$now = date('d/m/Y H:i:s');
$emailTitle = "";
$emailHtml = "";

if ($formType === 'website' || $formType === 'community') {
    $emailTitle = ($formType === 'website') 
        ? "Nouveau Questionnaire - Création de Site Web (SALI DigiCom)" 
        : "Nouveau Questionnaire - Community Management (SALI DigiCom)";

    // Format questionnaire responses rows
    $responsesRows = "";
    $currentCategory = "";

    foreach ($responses as $resp) {
        $category = isset($resp['category']) ? strip_tags($resp['category']) : '';
        $question = isset($resp['question']) ? strip_tags($resp['question']) : '';
        $answer = isset($resp['answer']) ? $resp['answer'] : '';

        if ($category !== $currentCategory) {
            $currentCategory = $category;
            $responsesRows .= '
              <tr>
                <td colspan="2" style="background-color: #ebf1f8; padding: 12px; font-weight: bold; color: #1c2c46; border-top: 2px solid #1d9878; font-size: 14px;">
                  ' . $currentCategory . '
                </td>
              </tr>
            ';
        }

        if (is_array($answer)) {
            $answerText = implode(', ', array_filter($answer));
        } else {
            $answerText = strip_tags($answer);
        }
        if (empty($answerText)) {
            $answerText = "Non renseigné";
        }

        $responsesRows .= '
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e1e8f0; width: 40%; font-weight: 600; color: #4a5568; font-size: 13px;">
              ' . $question . '
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #e1e8f0; color: #1a202c; font-size: 13px; white-space: pre-line;">
              ' . nl2br($answerText) . '
            </td>
          </tr>
        ';
    }

    $emailHtml = '
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #d3dfed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #1c2c46; padding: 20px; text-align: center; border-bottom: 3px solid #1d9878;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">SALI DigiCom</h2>
          <p style="color: #1d9878; margin: 5px 0 0 0; font-weight: bold; font-size: 14px;">' . $emailTitle . '</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <h3 style="color: #1c2c46; border-bottom: 1px solid #ebf1f8; padding-bottom: 8px; margin-top: 0;">Coordonnées du prospect</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 30%;">Nom complet :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $clientName . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Entreprise :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $clientCompany . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">E-mail :</td>
              <td style="padding: 8px 0; color: #1a202c;"><a href="mailto:' . $clientEmail . '">' . $clientEmail . '</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Téléphone :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $clientPhone . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Joignable sur WhatsApp :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $clientWhatsapp . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Date de soumission :</td>
              <td style="padding: 8px 0; color: #718096; font-size: 12px;">' . $now . '</td>
            </tr>
          </table>

          <h3 style="color: #1c2c46; border-bottom: 1px solid #ebf1f8; padding-bottom: 8px; margin-top: 0;">Réponses au Questionnaire</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ' . $responsesRows . '
          </table>
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0;">
          Cet e-mail a été généré automatiquement depuis le système de formulaires de SALI DigiCom.
        </div>
      </div>
    ';
} else {
    // Standard contact form
    $emailTitle = "Nouveau Message de Contact - " . $clientCompany;
    $emailHtml = '
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d3dfed; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1c2c46; padding: 20px; text-align: center; border-bottom: 3px solid #1d9878;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">SALI DigiCom</h2>
          <p style="color: #1d9878; margin: 5px 0 0 0; font-weight: bold;">Nouveau Message de Contact</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 30%;">Nom complet :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $clientName . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Entreprise :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $clientCompany . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">E-mail :</td>
              <td style="padding: 8px 0; color: #1a202c;"><a href="mailto:' . $clientEmail . '">' . $clientEmail . '</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Téléphone :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $clientPhone . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Type de projet :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $projectType . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Date d\'envoi :</td>
              <td style="padding: 8px 0; color: #718096; font-size: 12px;">' . $now . '</td>
            </tr>
          </table>

          <h3 style="color: #1c2c46; border-bottom: 1px solid #ebf1f8; padding-bottom: 8px;">Message :</h3>
          <div style="padding: 15px; background-color: #f7fafc; border-radius: 6px; color: #2d3748; line-height: 1.6; white-space: pre-line; border-left: 3px solid #1d9878;">
            ' . nl2br($messageContent) . '
          </div>
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0;">
          Cet e-mail a été généré automatiquement depuis le formulaire de contact de SALI DigiCom.
        </div>
      </div>
    ';
}

// Check for attachments
$attachment_files = isset($data['graphicCharterFiles']) ? $data['graphicCharterFiles'] : null;
$attachment_datas = isset($data['graphicCharterFilesData']) ? $data['graphicCharterFilesData'] : null;

$body = "";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "From: Formulaire Web SALI DigiCom <noreply@sali-digicom.com>" . "\r\n";
$headers .= "Reply-To: " . $clientName . " <" . $clientEmail . ">" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (is_array($attachment_files) && is_array($attachment_datas) && count($attachment_files) > 0) {
    $boundary = md5(time());
    $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"" . "\r\n";

    // HTML part
    $body = "--" . $boundary . "\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $body .= "Content-Transfer-Encoding: 7bit" . "\r\n\r\n";
    $body .= $emailHtml . "\r\n\r\n";

    // Attach each file
    for ($i = 0; $i < count($attachment_files); $i++) {
        $file_name = $attachment_files[$i];
        $file_data = $attachment_datas[$i];

        if (preg_match('/^data:(.*);base64,(.*)$/', $file_data, $matches)) {
            $file_type = $matches[1];
            $file_base64 = $matches[2];

            $body .= "--" . $boundary . "\r\n";
            $body .= "Content-Type: " . $file_type . "; name=\"" . $file_name . "\"\r\n";
            $body .= "Content-Disposition: attachment; filename=\"" . $file_name . "\"\r\n";
            $body .= "Content-Transfer-Encoding: base64" . "\r\n\r\n";
            $body .= chunk_split($file_base64) . "\r\n\r\n";
        }
    }
    $body .= "--" . $boundary . "--";
} else {
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $body = $emailHtml;
}

// Send Mail
if (mail($recipient_email, $emailTitle, $body, $headers)) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Votre message a été envoyé avec succès !"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la transmission du message via le serveur de messagerie PHP."]);
}
?>
