<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée. Utilisez POST.']);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$nom = trim($data['nom'] ?? '');
$email = trim($data['email'] ?? '');
$sujet = trim($data['sujet'] ?? '');
$message = trim($data['message'] ?? '');

if (empty($nom) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Veuillez remplir tous les champs obligatoires (nom, email, message).']);
    exit();
}

$pdo = getPdoConnection();
$savedInDb = false;

if ($pdo) {
    try {
        $stmt = $pdo->prepare("INSERT INTO messages_contact (id, nom, email, sujet, message, created_at) VALUES (UUID(), :nom, :email, :sujet, :message, NOW())");
        $stmt->execute([
            'nom' => $nom,
            'email' => $email,
            'sujet' => $sujet,
            'message' => $message
        ]);
        $savedInDb = true;
    } catch (Exception $e) {
        // Log Error or fallback to mail
    }
}

// Optionnel: envoi par mail via mail() natif ou PHPMailer si configuré
$to = getenv('ADMIN_EMAIL') ?: 'contact@fofifa.mg';
$headers = "From: " . $email . "\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

@mail($to, "[FOFIFA Contact] " . $sujet, "Nom: $nom\nEmail: $email\n\nMessage:\n$message", $headers);

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Votre message a bien été envoyé au FOFIFA.',
    'db_saved' => $savedInDb
]);
