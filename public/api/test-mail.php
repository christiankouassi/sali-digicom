<?php
// Script de diagnostic et de test d'envoi d'e-mail pour Infomaniak
header("Content-Type: text/html; charset=UTF-8");

$config_file = __DIR__ . '/config.php';
$cfg = file_exists($config_file) ? @include($config_file) : [];

$smtp_host = !empty($_POST['smtp_host']) ? $_POST['smtp_host'] : (isset($cfg['smtp_host']) ? $cfg['smtp_host'] : 'mail.infomaniak.com');
$smtp_port = !empty($_POST['smtp_port']) ? (int)$_POST['smtp_port'] : (isset($cfg['smtp_port']) ? (int)$cfg['smtp_port'] : 587);
$smtp_user = !empty($_POST['smtp_user']) ? $_POST['smtp_user'] : (isset($cfg['smtp_user']) ? $cfg['smtp_user'] : 'contact@sali-digicom.com');
$smtp_pass = isset($_POST['smtp_pass']) ? $_POST['smtp_pass'] : (isset($cfg['smtp_pass']) ? $cfg['smtp_pass'] : '');
$test_to   = !empty($_POST['test_to']) ? $_POST['test_to'] : (isset($cfg['recipient_email']) ? $cfg['recipient_email'] : 'contact@sali-digicom.com');

$results = [];
$tested = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['run_test'])) {
    $tested = true;
    $mode = $_POST['mode']; // 'smtp' ou 'mail'

    if ($mode === 'smtp') {
        if (empty($smtp_pass)) {
            $results[] = ["type" => "error", "msg" => "Le mot de passe SMTP est vide. Veuillez indiquer le mot de passe de " . htmlspecialchars($smtp_user)];
        } else {
            $results[] = ["type" => "info", "msg" => "Tentative de connexion à {$smtp_host}:{$smtp_port}..."];
            $res = run_smtp_diag($smtp_host, $smtp_port, $smtp_user, $smtp_pass, $test_to);
            $results = array_merge($results, $res);
        }
    } else {
        $results[] = ["type" => "info", "msg" => "Test via la fonction native mail() PHP vers {$test_to}..."];
        $subject = "Test mail() PHP - SALI DigiCom (" . date('H:i:s') . ")";
        $body = "Ceci est un message de test envoyé via la fonction mail() PHP depuis votre site Infomaniak.";
        $headers = "From: SALI DigiCom <contact@sali-digicom.com>
Reply-To: contact@sali-digicom.com
Content-Type: text/plain; charset=UTF-8
";
        
        $t0 = microtime(true);
        $ok = @mail($test_to, $subject, $body, $headers, "-f contact@sali-digicom.com");
        $duration = round(microtime(true) - $t0, 2);

        if ($ok) {
            $results[] = ["type" => "success", "msg" => "mail() a retourné TRUE en {$duration}s. Le message a été transmis à la file d'attente d'Infomaniak. Vérifiez votre boîte de réception (et vos Spams)."];
        } else {
            $results[] = ["type" => "error", "msg" => "mail() a retourné FALSE en {$duration}s. La fonction est probablement désactivée dans votre Manager Infomaniak ou l'envoi a été bloqué."];
        }
    }
}

function run_smtp_diag($host, $port, $user, $pass, $to) {
    $logs = [];
    $timeout = 10;
    $is_ssl = ($port == 465);
    $prefix = $is_ssl ? "ssl://" : "tcp://";

    $t0 = microtime(true);
    $socket = @stream_socket_client("{$prefix}{$host}:{$port}", $errno, $errstr, $timeout);
    if (!$socket) {
        $logs[] = ["type" => "error", "msg" => "Impossible de se connecter à {$host}:{$port} - Erreur: {$errstr} ({$errno})"];
        return $logs;
    }
    $logs[] = ["type" => "success", "msg" => "Connexion réseau établie avec succès sur {$host}:{$port} en " . round((microtime(true)-$t0)*1000) . "ms"];

    $read = function() use ($socket, &$logs) {
        $response = "";
        while ($str = fgets($socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) === " ") break;
        }
        return $response;
    };

    $send = function($cmd, $hide = false) use ($socket, $read, &$logs) {
        fputs($socket, $cmd . "
");
        $resp = $read();
        $display_cmd = $hide ? "********" : $cmd;
        return $resp;
    };

    $greeting = $read();
    if (substr($greeting, 0, 3) !== "220") {
        $logs[] = ["type" => "error", "msg" => "Réponse d'accueil inattendue : " . trim($greeting)];
        fclose($socket);
        return $logs;
    }
    $logs[] = ["type" => "success", "msg" => "Serveur prêt : " . trim($greeting)];

    $send("EHLO sali-digicom.com");

    if ($port == 587) {
        $resp = $send("STARTTLS");
        if (substr($resp, 0, 3) === "220") {
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $logs[] = ["type" => "error", "msg" => "Échec de la négociation STARTTLS."];
                fclose($socket);
                return $logs;
            }
            $logs[] = ["type" => "success", "msg" => "Chiffrement TLS établi avec succès."];
            $send("EHLO sali-digicom.com");
        } else {
            $logs[] = ["type" => "error", "msg" => "STARTTLS rejeté : " . trim($resp)];
            fclose($socket);
            return $logs;
        }
    }

    $resp = $send("AUTH LOGIN");
    if (substr($resp, 0, 3) !== "334") {
        $logs[] = ["type" => "error", "msg" => "AUTH LOGIN non supporté ou rejeté : " . trim($resp)];
        fclose($socket);
        return $logs;
    }

    $resp = $send(base64_encode($user));
    if (substr($resp, 0, 3) !== "334") {
        $logs[] = ["type" => "error", "msg" => "Nom d'utilisateur rejeté : " . trim($resp)];
        fclose($socket);
        return $logs;
    }

    $resp = $send(base64_encode($pass), true);
    if (substr($resp, 0, 3) !== "235") {
        $logs[] = ["type" => "error", "msg" => "Échec d'authentification : Mot de passe incorrect pour {$user} (" . trim($resp) . ")"];
        fclose($socket);
        return $logs;
    }
    $logs[] = ["type" => "success", "msg" => "Authentification SMTP réussie pour {$user} !"];

    $resp = $send("MAIL FROM: <{$user}>");
    if (substr($resp, 0, 3) !== "250") {
        $logs[] = ["type" => "error", "msg" => "MAIL FROM rejeté : " . trim($resp)];
        fclose($socket);
        return $logs;
    }

    $resp = $send("RCPT TO: <{$to}>");
    if (substr($resp, 0, 3) !== "250") {
        $logs[] = ["type" => "error", "msg" => "RCPT TO rejeté pour {$to} : " . trim($resp)];
        fclose($socket);
        return $logs;
    }

    $resp = $send("DATA");
    if (substr($resp, 0, 3) !== "354") {
        $logs[] = ["type" => "error", "msg" => "DATA rejeté : " . trim($resp)];
        fclose($socket);
        return $logs;
    }

    $subject = "Test SMTP Infomaniak Reussi - SALI DigiCom (" . date('H:i:s') . ")";
    $body = "Félicitations !

Ce message confirme que l'envoi d'e-mails via le serveur SMTP d'Infomaniak fonctionne parfaitement pour SALI DigiCom.
Date : " . date('d/m/Y H:i:s') . "
";
    $payload = "Subject: {$subject}
To: <{$to}>
From: SALI DigiCom <{$user}>
Content-Type: text/plain; charset=UTF-8

{$body}
.";

    $resp = $send($payload);
    $send("QUIT");
    fclose($socket);

    if (substr($resp, 0, 3) === "250") {
        $logs[] = ["type" => "success", "msg" => "E-MAIL ENVOYÉ AVEC SUCCÈS ! Vérifiez immédiatement votre boîte mail {$to} (Boîte de réception principale) !"];
    } else {
        $logs[] = ["type" => "error", "msg" => "Échec final de l'envoi : " . trim($resp)];
    }

    return $logs;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Diagnostic E-mail &bull; SALI DigiCom (Infomaniak)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #fff; margin: 0; padding: 24px; }
    .container { max-width: 800px; margin: 0 auto; }
    header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 22px; color: #1d9878; }
    .card { background: #17253b; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.6); margin-bottom: 6px; font-weight: bold; }
    input, select { width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 13px; outline: none; }
    input:focus { border-color: #1d9878; background: rgba(255,255,255,0.08); }
    .btn { background: #1d9878; color: #fff; border: none; padding: 12px 24px; border-radius: 999px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; }
    .btn:hover { background: #157159; }
    .log-item { padding: 10px 14px; border-radius: 8px; margin-bottom: 8px; font-size: 12.5px; display: flex; align-items: center; gap: 10px; }
    .log-success { background: rgba(29,152,120,0.15); border: 1px solid rgba(29,152,120,0.3); color: #4ade80; }
    .log-error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
    .log-info { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; }
    .status-pill { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; }
    .status-on { background: rgba(29,152,120,0.2); color: #4ade80; }
    .status-off { background: rgba(239,68,68,0.2); color: #f87171; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Outil de Diagnostic E-mail SALI DigiCom</h1>
      <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 6px 0 0 0;">
        Testez en 1 clic l'envoi d'e-mails depuis votre serveur Infomaniak pour vérifier la réception réelle.
      </p>
    </header>

    <div class="card">
      <h2 style="font-size: 15px; margin: 0 0 16px 0; color: #fff;">État de l'hébergement Infomaniak</h2>
      <div style="font-size: 12.5px; line-height: 1.8; color: rgba(255,255,255,0.8);">
        &bull; Version PHP : <strong><?= phpversion() ?></strong><br>
        &bull; Fonction PHP mail() : <span class="status-pill <?= function_exists('mail') ? 'status-on' : 'status-off' ?>"><?= function_exists('mail') ? 'DISPONIBLE' : 'DÉSACTIVÉE' ?></span><br>
        &bull; Support OpenSSL / Chiffrement TLS : <span class="status-pill <?= extension_loaded('openssl') ? 'status-on' : 'status-off' ?>"><?= extension_loaded('openssl') ? 'ACTIF' : 'INACTIF' ?></span><br>
        &bull; Fichier config.php : <span class="status-pill <?= file_exists($config_file) ? 'status-on' : 'status-off' ?>"><?= file_exists($config_file) ? 'DÉTECTÉ' : 'ABSENT (defaults actifs)' ?></span>
      </div>
    </div>

    <form method="POST" class="card">
      <h2 style="font-size: 15px; margin: 0 0 16px 0; color: #fff;">Lancer un test d'envoi en direct</h2>

      <div style="margin-bottom: 16px;">
        <label>Méthode d'envoi</label>
        <select name="mode" id="modeSelect" onchange="toggleSmtpFields()">
          <option value="smtp">SMTP Authentifié Infomaniak (Recommandé - Envoi en 1s)</option>
          <option value="mail">Fonction PHP mail() native</option>
        </select>
      </div>

      <div id="smtpFields" class="grid" style="margin-bottom: 16px;">
        <div>
          <label>Serveur SMTP</label>
          <input type="text" name="smtp_host" value="<?= htmlspecialchars($smtp_host) ?>">
        </div>
        <div>
          <label>Port SMTP</label>
          <input type="number" name="smtp_port" value="<?= htmlspecialchars($smtp_port) ?>">
        </div>
        <div>
          <label>Compte utilisateur SMTP</label>
          <input type="email" name="smtp_user" value="<?= htmlspecialchars($smtp_user) ?>">
        </div>
        <div>
          <label>Mot de passe SMTP de contact@sali-digicom.com</label>
          <input type="password" name="smtp_pass" value="<?= htmlspecialchars($smtp_pass) ?>" placeholder="Saisissez le mot de passe">
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <label>Envoyer l'e-mail de test à :</label>
        <input type="email" name="test_to" value="<?= htmlspecialchars($test_to) ?>">
      </div>

      <button type="submit" name="run_test" class="btn">Tester l'envoi maintenant &rarr;</button>
    </form>

    <?php if ($tested): ?>
      <div class="card">
        <h2 style="font-size: 15px; margin: 0 0 16px 0; color: #fff;">Résultats du test</h2>
        <?php foreach ($results as $r): ?>
          <div class="log-item log-<?= $r['type'] ?>">
            <span><?= $r['type'] === 'success' ? '✔' : ($r['type'] === 'error' ? '✖' : 'ℹ') ?></span>
            <span><?= htmlspecialchars($r['msg']) ?></span>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <div style="text-align: center; font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 16px;">
      <a href="view-submissions.php?key=<?= isset($cfg['admin_key']) ? $cfg['admin_key'] : 'sali2026' ?>" style="color: #1d9878; text-decoration: none;">&larr; Accéder au tableau des leads sauvegardés</a>
    </div>
  </div>

  <script>
    function toggleSmtpFields() {
      var mode = document.getElementById('modeSelect').value;
      document.getElementById('smtpFields').style.display = (mode === 'smtp') ? 'grid' : 'none';
    }
  </script>
</body>
</html>
