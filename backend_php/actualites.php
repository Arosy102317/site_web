<?php
require_once __DIR__ . '/config.php';

$pdo = getPdoConnection();

// Données de secours (Fallback Mock) si la base SQL n'est pas configurée
$mockActualites = [
    [
        'id' => '11111111-1111-1111-1111-111111111111',
        'titre' => 'Lancement de nouvelles variétés de riz adaptées au changement climatique',
        'slug' => 'nouvelles-varietes-riz-2026',
        'extrait' => 'Le FOFIFA présente 3 nouvelles variétés de riz à haut rendement tolérantes à la sécheresse.',
        'contenu' => 'Face aux défis climatiques récents à Madagascar, le Département de Recherches Rizicoles (DRR) du FOFIFA a homologué de nouvelles semences qui réduisent le besoin en eau de 30% tout en maintenant un rendement supérieur à 5 tonnes par hectare.',
        'image_url' => 'https://images.pexels.com/photos/33620444/pexels-photo-33620444.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        'auteur' => 'Dr. Razafindrakoto',
        'date_publication' => date('Y-m-d H:i:s'),
        'tags' => ['Riziculture', 'Climat', 'Innovation'],
        'lu' => 142,
        'categorie' => [
            'id' => 'cat-1',
            'nom' => 'Riziculture',
            'slug' => 'riziculture',
            'couleur' => 'emerald'
        ]
    ],
    [
        'id' => '22222222-2222-2222-2222-222222222222',
        'titre' => 'Colloque national sur l\'agroforesterie et la biodiversité à Antananarivo',
        'slug' => 'colloque-agroforesterie-2026',
        'extrait' => 'Plus de 150 chercheurs et partenaires internationaux réunis pour discuter de la gestion durable des forêts.',
        'contenu' => 'Le FOFIFA a accueilli cette semaine le colloque annuel sur la préservation des forêts malgaches et les techniques d\'agroforesterie associant le vanillier et les essences endémiques.',
        'image_url' => 'https://images.pexels.com/photos/11627650/pexels-photo-11627650.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        'auteur' => 'FOFIFA DRFP',
        'date_publication' => date('Y-m-d H:i:s', strtotime('-5 days')),
        'tags' => ['Foresterie', 'Biodiversité'],
        'lu' => 98,
        'categorie' => [
            'id' => 'cat-2',
            'nom' => 'Environnement',
            'slug' => 'environnement',
            'couleur' => 'blue'
        ]
    ]
];

$slug = $_GET['slug'] ?? null;
$search = $_GET['search'] ?? null;

if ($pdo) {
    try {
        if ($slug) {
            $stmt = $pdo->prepare("SELECT a.*, c.nom as cat_nom, c.slug as cat_slug, c.couleur as cat_couleur FROM actualites a LEFT JOIN categories c ON a.categorie_id = c.id WHERE a.slug = :slug");
            $stmt->execute(['slug' => $slug]);
            $item = $stmt->fetch();
            if ($item) {
                // Increment views
                $pdo->prepare("UPDATE actualites SET lu = lu + 1 WHERE id = :id")->execute(['id' => $item['id']]);
                $item['tags'] = is_string($item['tags']) ? json_decode($item['tags']) : [];
                $item['categorie'] = [
                    'id' => $item['categorie_id'],
                    'nom' => $item['cat_nom'],
                    'slug' => $item['cat_slug'],
                    'couleur' => $item['cat_couleur']
                ];
                echo json_encode($item);
                exit();
            }
        } else {
            $query = "SELECT a.*, c.nom as cat_nom, c.slug as cat_slug, c.couleur as cat_couleur FROM actualites a LEFT JOIN categories c ON a.categorie_id = c.id";
            $params = [];
            if ($search) {
                $query .= " WHERE a.titre LIKE :search OR a.extrait LIKE :search";
                $params['search'] = '%' . $search . '%';
            }
            $query .= " ORDER BY a.date_publication DESC";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();
            $results = array_map(function($row) {
                $row['tags'] = is_string($row['tags']) ? json_decode($row['tags']) : [];
                $row['categorie'] = [
                    'id' => $row['categorie_id'],
                    'nom' => $row['cat_nom'],
                    'slug' => $row['cat_slug'],
                    'couleur' => $row['cat_couleur']
                ];
                return $row;
            }, $rows);
            echo json_encode($results);
            exit();
        }
    } catch (Exception $e) {
        // Fallback below
    }
}

// Fallback Mock Response
if ($slug) {
    $found = array_filter($mockActualites, fn($a) => $a['slug'] === $slug);
    echo json_encode(reset($found) ?: $mockActualites[0]);
} else {
    echo json_encode($mockActualites);
}
