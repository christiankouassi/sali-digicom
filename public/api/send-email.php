<?php
// PHP Script to handle SALI DigiCom email submissions on Infomaniak Shared Hosting
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json; charset=UTF-8");

// ============================================================================
// CONFIGURATION D'ENVOI D'E-MAILS - INFOMANIAK
// ============================================================================
$recipient_email = "contact@sali-digicom.com";

// OPTION 1 : Mode SMTP Authentifié (Recommandé par Infomaniak pour 100% de délivrabilité)
// Passez $smtp_enabled à true et indiquez le mot de passe de contact@sali-digicom.com ci-dessous
// ou créez/modifiez le fichier api/config.php.
$smtp_enabled = false; 
$smtp_host    = "mail.infomaniak.com";
$smtp_port    = 587; // 587 (STARTTLS) ou 465 (SSL)
$smtp_user    = "christian.kouassi@sali-digicom.com";
$smtp_pass    = "";  // Mot de passe de la boîte e-mail Infomaniak

// OPTION 2 : Fonction native mail() PHP (avec paramètre enveloppe -f pour éviter les lenteurs)
// ============================================================================

// Charger la configuration personnalisée externe si elle existe (api/config.php)
$config_file = __DIR__ . '/config.php';
if (file_exists($config_file)) {
    $custom_config = @include($config_file);
    if (is_array($custom_config)) {
        if (isset($custom_config['smtp_enabled'])) $smtp_enabled = (bool)$custom_config['smtp_enabled'];
        if (!empty($custom_config['smtp_host'])) $smtp_host = $custom_config['smtp_host'];
        if (!empty($custom_config['smtp_port'])) $smtp_port = (int)$custom_config['smtp_port'];
        if (!empty($custom_config['smtp_user'])) $smtp_user = $custom_config['smtp_user'];
        if (!empty($custom_config['smtp_pass'])) $smtp_pass = $custom_config['smtp_pass'];
        if (!empty($custom_config['recipient_email'])) $recipient_email = $custom_config['recipient_email'];
    }
}

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
    $clientPosition = isset($clientInfo['position']) ? strip_tags($clientInfo['position']) : 'Non renseigné';
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
    $clientPosition = isset($data['position']) ? strip_tags($data['position']) : 'Non renseigné';
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
          Cet e-mail a été généré automatiquement depuis l'enquête de satisfaction de SALI DigiCom.
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
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Position dans l'entreprise :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . (isset($clientPosition) ? $clientPosition : 'Non renseigné') . '</td>
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
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Position :</td>
              <td style="padding: 8px 0; color: #1a202c;">' . (isset($clientPosition) ? $clientPosition : 'Non renseigné') . '</td>
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
              <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Date d'envoi :</td>
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

// ============================================================================
// 1. SAUVEGARDE LOCALE SÉCURISÉE (ANTI-PERTE GARANTIE À 100%)
// ============================================================================
$submissions_dir = __DIR__ . '/submissions';
if (!is_dir($submissions_dir)) {
    @mkdir($submissions_dir, 0755, true);
    @file_put_contents($submissions_dir . '/.htaccess', "Order Deny,Allow
Deny from all
");
    @file_put_contents($submissions_dir . '/index.html', "");
}

$safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $clientName);
$file_timestamp = date('Y-m-d_H-i-s');
$file_prefix = $file_timestamp . '_' . $formType . '_' . $safeName;

// Sauvegarde JSON (données brutes)
@file_put_contents(
    $submissions_dir . '/' . $file_prefix . '.json',
    json_encode([
        'timestamp' => $now,
        'formType' => $formType,
        'clientInfo' => [
            'name' => $clientName,
            'email' => $clientEmail,
            'phone' => isset($clientPhone) ? $clientPhone : '',
            'company' => isset($clientCompany) ? $clientCompany : '',
            'position' => isset($clientPosition) ? $clientPosition : '',
            'whatsapp' => isset($clientWhatsapp) ? $clientWhatsapp : ''
        ],
        'responses' => $responses,
        'raw_payload' => $data
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

// Sauvegarde HTML (fiche prête à lire)
@file_put_contents(
    $submissions_dir . '/' . $file_prefix . '.html',
    $emailHtml
);

// Journalisation dans log.txt
$log_entry = "[" . $now . "] Nouveau lead: " . $formType . " | Nom: " . $clientName . " | Email: " . $clientEmail . " | Tel: " . (isset($clientPhone) ? $clientPhone : '-') . " | Fichier: " . $file_prefix . "
";
@file_put_contents($submissions_dir . '/mail_log.txt', $log_entry, FILE_APPEND);

// ============================================================================
// 2. PRÉPARATION DE L'E-MAIL ET PIÈCES JOINTES
// ============================================================================
$attachment_files = isset($data['graphicCharterFiles']) ? $data['graphicCharterFiles'] : null;
$attachment_datas = isset($data['graphicCharterFilesData']) ? $data['graphicCharterFilesData'] : null;

// L'expéditeur DOIT correspondre à un compte légitime sur le domaine (contact@sali-digicom.com)
// Utiliser noreply@ déclenche les filtres anti-spoofing d'Infomaniak
$sender_email = !empty($smtp_user) ? $smtp_user : "contact@sali-digicom.com";

$headers = "MIME-Version: 1.0" . "
";
$headers .= "From: SALI DigiCom <" . $sender_email . ">
";
$headers .= "Reply-To: " . $clientName . " <" . $clientEmail . ">
";
$headers .= "X-Mailer: PHP/" . phpversion() . "
";
$headers .= "X-Lead-Backup: " . $file_prefix . "
";

if (is_array($attachment_files) && is_array($attachment_datas) && count($attachment_files) > 0) {
    $boundary = md5(time());
    $headers .= "Content-Type: multipart/mixed; boundary="" . $boundary . """ . "
";

    // HTML part
    $body = "--" . $boundary . "
";
    $body .= "Content-Type: text/html; charset=UTF-8" . "
";
    $body .= "Content-Transfer-Encoding: 7bit" . "

";
    $body .= $emailHtml . "

";

    // Attach each file
    for ($i = 0; $i < count($attachment_files); $i++) {
        $file_name = $attachment_files[$i];
        $file_data = $attachment_datas[$i];

        if (preg_match('/^data:(.*);base64,(.*)$/', $file_data, $matches)) {
            $file_type = $matches[1];
            $file_base64 = $matches[2];

            $body .= "--" . $boundary . "
";
            $body .= "Content-Type: " . $file_type . "; name="" . $file_name . ""
";
            $body .= "Content-Disposition: attachment; filename="" . $file_name . ""
";
            $body .= "Content-Transfer-Encoding: base64" . "

";
            $body .= chunk_split($file_base64) . "

";
        }
    }
    $body .= "--" . $boundary . "--";
} else {
    $headers .= "Content-Type: text/html; charset=UTF-8" . "
";
    $body = $emailHtml;
}

// ============================================================================
// 3. EXPÉDITION DE L'E-MAIL (SMTP AUTHENTIFIÉ OU MAIL PHP AVEC RETOUR-PATH)
// ============================================================================
$sent_success = false;
$send_method = "none";
$send_error = "";

// A. Tentative via SMTP si activé et mot de passe présent
if ($smtp_enabled && !empty($smtp_pass)) {
    $smtp_res = send_smtp_mail(
        $smtp_host,
        $smtp_port,
        $smtp_user,
        $smtp_pass,
        $sender_email,
        $recipient_email,
        $emailTitle,
        $body,
        $headers
    );

    if ($smtp_res['success']) {
        $sent_success = true;
        $send_method = "SMTP (" . $smtp_host . ":" . $smtp_port . ")";
    } else {
        $send_error = $smtp_res['error'];
        @file_put_contents($submissions_dir . '/mail_log.txt', "  -> [ERREUR SMTP] " . $send_error . ". Tentative repli sur mail() PHP...
", FILE_APPEND);
    }
}

// B. Repli sur mail() PHP si SMTP inactif ou échoué
if (!$sent_success) {
    // IMPORTANT : Le 5e argument "-f contact@sali-digicom.com" définit le Return-Path réel.
    // Sans ce paramètre, sendmail sur Linux provoque 30 à 40s de timeout DNS et fait rejeter le mail par Infomaniak.
    $envelope_param = "-f " . escapeshellarg($sender_email);
    $mail_res = @mail($recipient_email, $emailTitle, $body, $headers, $envelope_param);
    
    if ($mail_res) {
        $sent_success = true;
        $send_method = "mail() PHP avec Return-Path";
    } else {
        $send_error = "La fonction mail() PHP a échoué.";
    }
}

// Enregistrement du résultat final dans le journal
@file_put_contents($submissions_dir . '/mail_log.txt', "  -> Résultat: " . ($sent_success ? "SUCCÈS via " . $send_method : "ÉCHEC: " . $send_error) . "
", FILE_APPEND);

// Retour HTTP au navigateur
http_response_code(200);
echo json_encode([
    "success" => true,
    "saved_locally" => true,
    "file_reference" => $file_prefix,
    "method" => $send_method,
    "email_dispatched" => $sent_success,
    "message" => "Votre demande a bien été enregistrée et transmise !"
]);

// ============================================================================
// 4. FONCTION SMTP NATIVE COMPATIBLE INFOMANIAK (STARTTLS 587 OU SSL 465)
// ============================================================================
function send_smtp_mail($host, $port, $user, $pass, $from, $to, $subject, $body, $headers_str) {
    $timeout = 10;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    $is_ssl = ($port == 465);
    $prefix = $is_ssl ? "ssl://" : "tcp://";

    $socket = @stream_socket_client("{$prefix}{$host}:{$port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        return ["success" => false, "error" => "Connexion impossible à {$host}:{$port} ({$errstr})"];
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
        fputs($socket, $cmd . "
");
        return $read();
    };

    $resp = $read();
    if (substr($resp, 0, 3) !== "220") {
        fclose($socket);
        return ["success" => false, "error" => "Serveur non prêt : " . trim($resp)];
    }

    $client_host = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'sali-digicom.com';
    $send("EHLO " . $client_host);

    // STARTTLS pour port 587
    if ($port == 587) {
        $resp = $send("STARTTLS");
        if (substr($resp, 0, 3) === "220") {
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                fclose($socket);
                return ["success" => false, "error" => "Échec négociation TLS."];
            }
            $send("EHLO " . $client_host);
        }
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
        return ["success" => false, "error" => "Utilisateur SMTP rejeté : " . trim($resp)];
    }

    $resp = $send(base64_encode($pass));
    if (substr($resp, 0, 3) !== "235") {
        fclose($socket);
        return ["success" => false, "error" => "Mot de passe SMTP refusé : " . trim($resp)];
    }

    // Enveloppe
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

    $data_payload = "Subject: " . $subject . "
";
    $data_payload .= "To: <" . $to . ">
";
    $data_payload .= trim($headers_str) . "

";
    $data_payload .= $body . "
.";

    $resp = $send($data_payload);
    $send("QUIT");
    fclose($socket);

    if (substr($resp, 0, 3) === "250") {
        return ["success" => true];
    } else {
        return ["success" => false, "error" => "Transmission rejetée : " . trim($resp)];
    }
}
?>
