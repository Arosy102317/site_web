<?php
require_once __DIR__ . '/config.php';

$pdo = getPdoConnection();

$mockDepartements = [
    [
        'id' => 'd1',
        'nom' => 'Département de Recherches Zootechniques et Vétérinaires (DRZV)',
        'slug' => 'drzv',
        'mission' => 'Amélioration des races locales, nutrition animale et santé vétérinaire à Madagascar.',
        'description' => 'Le DRZV mène des travaux appliqués pour accroître la productivité des filières bétail, volaille et apiculture.',
        'responsable' => 'Dr. Ramanantsoa Jean',
        'email' => 'drzv@fofifa.mg',
        'telephone' => '+261 20 22 234 56',
        'icon_name' => 'Fish',
        'ordre' => 1
    ],
    [
        'id' => 'd2',
        'nom' => 'Département de Recherches Rizicoles et Agronomiques (DRR)',
        'slug' => 'drr',
        'mission' => 'Création de variétés de riz résilientes et optimisation de la riziculture durable.',
        'description' => 'Développement de semences améliorées, gestion intégrée des ravageurs et fertilité des sols.',
        'responsable' => 'Dr. Razafindrakoto Marie',
        'email' => 'drr@fofifa.mg',
        'telephone' => '+261 20 22 345 67',
        'icon_name' => 'Sprout',
        'ordre' => 2
    ]
];

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM departements ORDER BY ordre ASC");
        $deptList = $stmt->fetchAll();
        if (!empty($deptList)) {
            echo json_encode($deptList);
            exit();
        }
    } catch (Exception $e) {
        // Fallback
    }
}

echo json_encode($mockDepartements);
