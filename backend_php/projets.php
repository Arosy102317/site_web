<?php
require_once __DIR__ . '/config.php';

$pdo = getPdoConnection();

$mockProjets = [
    [
        'id' => 'p1111111-1111-1111-1111-111111111111',
        'titre' => 'Projet Riziculture Résiliente & Durable (RRD-Mada)',
        'slug' => 'projet-riz-resilient',
        'domaine' => 'Agronomie',
        'resume' => 'Amélioration de la productivité rizicole dans la région d\'Alaotra Mangoro.',
        'description' => 'Mise à disposition de semences certifiées et formation des groupements paysans aux pratiques agroécologiques durables pour faire face aux variations de précipitations.',
        'statut' => 'En cours',
        'date_debut' => '2024-01-15',
        'date_fin' => '2027-12-31',
        'budget' => '1.5M EUR',
        'bailleur' => 'Union Européenne & CIRAD',
        'responsable' => 'Dr. Razafindrakoto Marie',
        'impact' => 'Augmentation de 25% des rendements chez 12 000 riziculteurs.',
        'image_url' => 'https://images.pexels.com/photos/33620444/pexels-photo-33620444.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ]
];

$slug = $_GET['slug'] ?? null;

if ($pdo) {
    try {
        if ($slug) {
            $stmt = $pdo->prepare("SELECT * FROM projets WHERE slug = :slug OR id = :slug");
            $stmt->execute(['slug' => $slug]);
            $item = $stmt->fetch();
            if ($item) {
                echo json_encode($item);
                exit();
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM projets ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll());
            exit();
        }
    } catch (Exception $e) {
        // Fallback
    }
}

if ($slug) {
    $found = array_filter($mockProjets, fn($p) => $p['slug'] === $slug);
    echo json_encode(reset($found) ?: $mockProjets[0]);
} else {
    echo json_encode($mockProjets);
}
