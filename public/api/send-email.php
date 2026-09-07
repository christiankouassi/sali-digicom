<?php
// PHP Script to handle SALI DigiCom email submissions on Infomaniak Shared Hosting
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// ============================================================================
// CONFIGURATION D'ENVOI D'E-MAILS - INFOMANIAK
// ============================================================================
$recipient_email = "contact@sali-digicom.com";

// OPTION 1 : Mode SMTP Authentifié (Recommandé par Infomaniak pour 100% de délivrabilité)
// Si vous souhaitez utiliser le serveur SMTP officiel d'Infomaniak, passez $smtp_enabled à true
// et indiquez le mot de passe de la boîte contact@sali-digicom.com ci-dessous.
$smtp_enabled = false; // Mettre à true pour activer le SMTP
$smtp_host    = "mail.infomaniak.com";
$smtp_port    = 587;
$smtp_user    = "contact@sali-digicom.com";
$smtp_pass    = ""; // Mot de passe de la boîte e-mail Infomaniak

// OPTION 2 : Fonction native mail() PHP (par défaut)
// NOTE : Sur Infomaniak, activez la fonction "PHP Mail()" dans votre Manager :
// Manager Infomaniak > Hébergement Web > Paramètres avancés > PHP/Apache > Activer PHP Mail()
// ============================================================================

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
if ($formType === 'satisfaction') {
    $clientName = !empty($data['clientName']) ? strip_tags($data['clientName']) : 'Anonyme';
    $clientEmail = !empty($data['clientEmail']) ? filter_var($data['clientEmail'], FILTER_VALIDATE_EMAIL) : 'contact@sali-digicom.com';
    if (!$clientEmail) $clientEmail = 'contact@sali-digicom.com';
    $simplicityRating = isset($data['simplicityRating']) ? (int)$data['simplicityRating'] : 8;
    $coherenceRating = isset($data['coherenceRating']) ? (int)$data['coherenceRating'] : 8;
    $feedback = !empty($data['feedback']) ? htmlspecialchars($data['feedback']) : 'Aucun commentaire fourni.';
    $questionnaireType = (isset($data['questionnaireType']) && $data['questionnaireType'] === 'website') ? 'Création de Site Web' : 'Community Management';
} elseif ($formType === 'website' || $formType === 'community') {
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

if ($formType === 'satisfaction') {
    $emailTitle = "Enquête de satisfaction (" . $questionnaireType . ") - Notes: " . $simplicityRating . "/10 & " . $coherenceRating . "/10";
    $emailHtml = '
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d3dfed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #1c2c46; padding: 20px; text-align: center; border-bottom: 3px solid #1d9878;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">SALI DigiCom</h2>
          <p style="color: #1d9878; margin: 5px 0 0 0; font-weight: bold; font-size: 14px;">Enquête de Satisfaction Client</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 45%;">Questionnaire complété :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $questionnaireType . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Nom du prospect :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . $clientName . '</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">E-mail :</td>
              <td style="padding: 8px 0; color: #1a202c;"><a href="mailto:' . $clientEmail . '">' . $clientEmail . '</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Facilité à remplir :</td>
              <td style="padding: 8px 0; color: #1d9878; font-weight: bold; font-size: 15px;">' . $simplicityRating . ' / 10</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Cohérence des questions :</td>
              <td style="padding: 8px 0; color: #1d9878; font-weight: bold; font-size: 15px;">' . $coherenceRating . ' / 10</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Date de soumission :</td>
              <td style="padding: 8px 0; color: #718096; font-size: 12px;">' . $now . '</td>
            </tr>
          </table>

          <h3 style="color: #1c2c46; border-bottom: 1px solid #ebf1f8; padding-bottom: 8px; margin-top: 0;">Commentaires / Recommandations :</h3>
          <div style="padding: 15px; background-color: #f7fafc; border-radius: 6px; color: #2d3748; line-height: 1.6; white-space: pre-line; border-left: 3px solid #1d9878;">
            ' . nl2br($feedback) . '
          </div>
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0;">
          Cet e-mail a été généré automatiquement depuis l\'enquête de satisfaction de SALI DigiCom.
        </div>
      </div>
    ';
} elseif ($formType === 'website' || $formType === 'community') {
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

// ============================================================================
// ENVOI DE L'E-MAIL (SMTP ou Mail PHP)
// ============================================================================
if ($smtp_enabled && !empty($smtp_pass)) {
    $smtp_res = send_smtp_mail(
        $smtp_host,
        $smtp_port,
        $smtp_user,
        $smtp_pass,
        $smtp_user,
        $recipient_email,
        $emailTitle,
        $body,
        $headers
    );

    if ($smtp_res['success']) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Votre message a été transmis avec succès via le serveur SMTP Infomaniak !"]);
    } else {
        http_response_code(500);
        echo json_encode([
            "error" => "Échec de l'envoi SMTP Infomaniak : " . $smtp_res['error'],
            "hint" => "Vérifiez vos identifiants dans api/send-email.php ou utilisez le mode mail() PHP."
        ]);
    }
} else {
    // Mode mail() PHP par défaut
    if (@mail($recipient_email, $emailTitle, $body, $headers)) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Votre message a été envoyé avec succès !"]);
    } else {
        http_response_code(500);
        echo json_encode([
            "error" => "Erreur lors de la transmission via la fonction PHP mail().",
            "hint" => "Sur Infomaniak, la fonction mail() est désactivée par défaut. Activez-la dans votre Manager Infomaniak (Hébergement Web > Paramètres avancés > PHP/Apache > Activer PHP Mail) ou activez le mode SMTP ($smtp_enabled = true avec mot de passe) dans api/send-email.php."
        ]);
    }
}

// Fonction utilitaire SMTP native (sans dépendance externe)
function send_smtp_mail($host, $port, $user, $pass, $from, $to, $subject, $body, $headers_str) {
    $timeout = 15;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    $socket = @stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        return ["success" => false, "error" => "Impossible de se connecter à {$host}:{$port} ($errstr)"];
    }

    $read = function() use ($socket) {
        $response = "";
        while ($str = fgets($socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) === " ") break;
        }
        return $response;
    };

    $send = function($cmd) use ($socket, $read) {
        fputs($socket, $cmd . "\r\n");
        return $read();
    };

    $resp = $read();
    if (substr($resp, 0, 3) !== "220") {
        fclose($socket);
        return ["success" => false, "error" => "Serveur non prêt : " . trim($resp)];
    }

    $client_host = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'sali-digicom.com';
    $resp = $send("EHLO " . $client_host);

    // STARTTLS
    $resp = $send("STARTTLS");
    if (substr($resp, 0, 3) === "220") {
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            return ["success" => false, "error" => "Échec du chiffrement TLS."];
        }
        $send("EHLO " . $client_host);
    }

    // AUTH LOGIN
    $resp = $send("AUTH LOGIN");
    if (substr($resp, 0, 3) !== "334") {
        fclose($socket);
        return ["success" => false, "error" => "AUTH LOGIN rejeté : " . trim($resp)];
    }

    $resp = $send(base64_encode($user));
    if (substr($resp, 0, 3) !== "334") {
        fclose($socket);
        return ["success" => false, "error" => "Identifiant rejeté : " . trim($resp)];
    }

    $resp = $send(base64_encode($pass));
    if (substr($resp, 0, 3) !== "235") {
        fclose($socket);
        return ["success" => false, "error" => "Mot de passe refusé : " . trim($resp)];
    }

    // Envelope
    $resp = $send("MAIL FROM: <{$from}>");
    if (substr($resp, 0, 3) !== "250") {
        fclose($socket);
        return ["success" => false, "error" => "Expéditeur refusé : " . trim($resp)];
    }

    $resp = $send("RCPT TO: <{$to}>");
    if (substr($resp, 0, 3) !== "250") {
        fclose($socket);
        return ["success" => false, "error" => "Destinataire refusé : " . trim($resp)];
    }

    $resp = $send("DATA");
    if (substr($resp, 0, 3) !== "354") {
        fclose($socket);
        return ["success" => false, "error" => "DATA refusé : " . trim($resp)];
    }

    $data_payload = "Subject: " . $subject . "\r\n";
    $data_payload .= "To: <" . $to . ">\r\n";
    $data_payload .= trim($headers_str) . "\r\n\r\n";
    $data_payload .= $body . "\r\n.";

    $resp = $send($data_payload);
    $send("QUIT");
    fclose($socket);

    if (substr($resp, 0, 3) === "250") {
        return ["success" => true];
    } else {
        return ["success" => false, "error" => "Envoi rejeté : " . trim($resp)];
    }
}
?>
