<?php
// Tableau de bord sécurisé pour consulter tous les questionnaires et devis reçus
header("Content-Type: text/html; charset=UTF-8");

// Vérification de la clé d'accès administrateur
$config_file = __DIR__ . '/config.php';
$admin_key = 'sali2026';
if (file_exists($config_file)) {
    $cfg = @include($config_file);
    if (isset($cfg['admin_key'])) $admin_key = $cfg['admin_key'];
}

$key = isset($_GET['key']) ? $_GET['key'] : '';
if ($key !== $admin_key) {
    http_response_code(403);
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Accès refusé</title><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#0b0f19;color:#fff;margin:0;}div{text-align:center;padding:30px;background:#17253b;border-radius:16px;border:1px solid rgba(255,255,255,0.1);max-width:400px;}h2{color:#e53e3e;margin-top:0;}p{color:rgba(255,255,255,0.7);font-size:14px;}</style></head><body><div><h2>Accès Protégé</h2><p>Veuillez fournir la clé secrète administrateur dans l\'URL :<br><code>?key=VOTRE_CLE</code></p></div></body></html>';
    exit;
}

$submissions_dir = __DIR__ . '/submissions';
$files = is_dir($submissions_dir) ? scandir($submissions_dir) : [];

// Action de visualisation d'un fichier spécifique
if (isset($_GET['view'])) {
    $file = basename($_GET['view']);
    $filepath = $submissions_dir . '/' . $file;
    if (file_exists($filepath) && (str_ends_with($file, '.html') || str_ends_with($file, '.json'))) {
        if (str_ends_with($file, '.json')) {
            header('Content-Type: application/json');
            readfile($filepath);
        } else {
            echo file_get_contents($filepath);
        }
        exit;
    }
}

// Action de téléchargement d'un fichier spécifique
if (isset($_GET['download'])) {
    $file = basename($_GET['download']);
    $filepath = $submissions_dir . '/' . $file;
    if (file_exists($filepath)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $file . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filepath));
        readfile($filepath);
        exit;
    }
}

// Liste des soumissions
$submissions = [];
foreach ($files as $f) {
    if (str_ends_with($f, '.json')) {
        $content = @json_decode(file_get_contents($submissions_dir . '/' . $f), true);
        if ($content) {
            $base = substr($f, 0, -5);
            $submissions[] = [
                'base' => $base,
                'json_file' => $f,
                'html_file' => $base . '.html',
                'date' => isset($content['timestamp']) ? $content['timestamp'] : (isset($content['date']) ? $content['date'] : 'Inconnue'),
                'type' => isset($content['formType']) ? $content['formType'] : 'Inconnu',
                'name' => isset($content['clientInfo']['name']) ? $content['clientInfo']['name'] : 'Non renseigné',
                'email' => isset($content['clientInfo']['email']) ? $content['clientInfo']['email'] : '-',
                'phone' => isset($content['clientInfo']['phone']) ? $content['clientInfo']['phone'] : '-',
                'company' => isset($content['clientInfo']['company']) ? $content['clientInfo']['company'] : '-'
            ];
        }
    }
}

// Tri par date décroissante
usort($submissions, function($a, $b) {
    return strcmp($b['base'], $a['base']);
});

$log_content = file_exists($submissions_dir . '/mail_log.txt') ? file_get_contents($submissions_dir . '/mail_log.txt') : 'Aucun journal disponible.';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>SALI DigiCom - Sauvegardes des Formulaires</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #fff; margin: 0; padding: 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 22px; color: #1d9878; }
    .badge { background: #1d9878; color: #fff; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; }
    .card { background: #17253b; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { padding: 12px 14px; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.6); font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    td { padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    tr:hover td { background: rgba(255,255,255,0.02); }
    .btn { display: inline-block; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; text-decoration: none; transition: all 0.2s; margin-right: 4px; }
    .btn-primary { background: #1d9878; color: #fff; }
    .btn-primary:hover { background: #157159; }
    .btn-outline { border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
    .btn-outline:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .type-pill { padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
    .type-website { background: rgba(29,152,120,0.15); color: #1d9878; border: 1px solid rgba(29,152,120,0.3); }
    .type-community { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
    .type-satisfaction { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
    .type-contact { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }
    pre { background: #0b0f19; padding: 16px; border-radius: 8px; font-size: 11px; overflow-x: auto; color: #a0aec0; border: 1px solid rgba(255,255,255,0.05); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>SALI DigiCom &bull; Sauvegardes des Formulaires</h1>
        <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.5); font-size: 12px;">Tous les devis et questionnaires reçus sont archivés ici de manière sécurisée.</p>
      </div>
      <span class="badge"><?= count($submissions) ?> Formulaires reçus</span>
    </header>

    <div class="card">
      <h2 style="font-size: 15px; margin: 0 0 16px 0; color: #fff;">Liste des demandes reçues</h2>
      <?php if (empty($submissions)): ?>
        <p style="color: rgba(255,255,255,0.5); font-size: 13px; text-align: center; padding: 30px 0;">Aucun formulaire n'a encore été enregistré sur le serveur.</p>
      <?php else: ?>
        <table>
          <thead>
            <tr>
              <th>Date & Heure</th>
              <th>Type</th>
              <th>Nom du prospect</th>
              <th>Société</th>
              <th>E-mail</th>
              <th>Téléphone</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($submissions as $sub): ?>
              <tr>
                <td style="color: rgba(255,255,255,0.6);"><?= htmlspecialchars($sub['date']) ?></td>
                <td>
                  <span class="type-pill type-<?= htmlspecialchars($sub['type']) ?>">
                    <?= htmlspecialchars($sub['type']) ?>
                  </span>
                </td>
                <td style="font-weight: bold;"><?= htmlspecialchars($sub['name']) ?></td>
                <td><?= htmlspecialchars($sub['company']) ?></td>
                <td><a href="mailto:<?= htmlspecialchars($sub['email']) ?>" style="color: #1d9878; text-decoration: none;"><?= htmlspecialchars($sub['email']) ?></a></td>
                <td><?= htmlspecialchars($sub['phone']) ?></td>
                <td style="text-align: right;">
                  <a href="?key=<?= urlencode($admin_key) ?>&view=<?= urlencode($sub['html_file']) ?>" target="_blank" class="btn btn-primary">Voir Fiche</a>
                  <a href="?key=<?= urlencode($admin_key) ?>&download=<?= urlencode($sub['json_file']) ?>" class="btn btn-outline">JSON</a>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>

    <div class="card">
      <h2 style="font-size: 15px; margin: 0 0 10px 0; color: #fff;">Journal d'expédition des e-mails (Logs)</h2>
      <pre><?= htmlspecialchars($log_content) ?></pre>
    </div>
  </div>
</body>
</html>
