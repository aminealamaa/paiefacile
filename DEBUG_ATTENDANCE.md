# Guide de débogage - Pointage non affiché

## Problème
Les enregistrements de pointage sont sauvegardés dans Supabase mais n'apparaissent pas dans le frontend.

## Étapes de débogage

### 1. Vérifier la console du navigateur

1. Ouvrez la console du navigateur (F12 ou Clic droit > Inspecter > Console)
2. Enregistrez un nouveau pointage
3. Cherchez ces messages dans la console :

#### Messages attendus lors de la sauvegarde :
```
Attendance record saved successfully: { id: ..., employee_id: ..., date: ..., status: ... }
```

#### Messages attendus lors du chargement :
```
Loading records for employee [ID], month [M]/[Y], date range: [START] to [END]
Found X attendance records for employee [ID] between [START] and [END]
Successfully loaded X records
```

### 2. Vérifier les erreurs

Si vous voyez des erreurs, notez-les. Erreurs courantes :

- **"Employé non trouvé ou non autorisé"** : L'ID de l'employé ne correspond pas
- **"Error fetching attendance records"** : Problème de requête ou de permissions RLS
- **"No attendance record returned after upsert"** : L'enregistrement n'a pas été créé

### 3. Vérifier dans Supabase

1. Allez dans Supabase Dashboard > Table Editor
2. Ouvrez la table `attendance_records`
3. Vérifiez que vos enregistrements sont là
4. Notez :
   - L'`employee_id` de l'enregistrement
   - La `date` de l'enregistrement
   - Le `company_id` de l'enregistrement

### 4. Vérifier la correspondance des IDs

Dans la console du navigateur, vérifiez :
- L'`employeeId` utilisé pour sauvegarder
- L'`employeeId` utilisé pour charger les records
- Ils doivent être identiques !

### 5. Vérifier le mois/année

Dans la console, vérifiez :
- Le mois/année sélectionnés dans l'interface
- Le mois/année de la date enregistrée
- Ils doivent correspondre !

### 6. Test SQL direct dans Supabase

Exécutez cette requête dans Supabase SQL Editor (remplacez les valeurs) :

```sql
-- Voir tous les enregistrements récents
SELECT 
  id,
  employee_id,
  company_id,
  date,
  status,
  check_in_time,
  check_out_time,
  total_hours
FROM attendance_records
WHERE company_id = 'VOTRE_COMPANY_ID'
ORDER BY date DESC
LIMIT 10;

-- Voir les enregistrements pour un employé spécifique
SELECT 
  id,
  employee_id,
  date,
  status,
  check_in_time,
  check_out_time
FROM attendance_records
WHERE employee_id = 'VOTRE_EMPLOYEE_ID'
  AND company_id = 'VOTRE_COMPANY_ID'
  AND date >= '2025-11-01'
  AND date <= '2025-11-30'
ORDER BY date DESC;
```

### 7. Vérifier les politiques RLS

Dans Supabase Dashboard > Authentication > Policies, vérifiez que les politiques pour `attendance_records` permettent :
- **SELECT** : Lecture des enregistrements pour votre entreprise
- **INSERT/UPDATE** : Écriture des enregistrements pour votre entreprise

## Solutions courantes

### Problème : L'employé affiché ne correspond pas à l'employé sauvegardé

**Solution** : Le composant devrait automatiquement basculer vers l'employé sauvegardé. Si ce n'est pas le cas, vérifiez les logs dans la console.

### Problème : Le mois/année ne correspond pas

**Solution** : Le composant devrait automatiquement mettre à jour le mois/année. Si ce n'est pas le cas, changez manuellement le mois/année dans les sélecteurs.

### Problème : Erreur RLS (Row Level Security)

**Solution** : Vérifiez que les politiques RLS sont correctement configurées. Exécutez à nouveau le script `attendance-schema-supabase.sql` si nécessaire.

### Problème : Format de date incorrect

**Solution** : Les dates doivent être au format `YYYY-MM-DD`. Vérifiez dans les logs que les dates sont correctement formatées.

## Informations à fournir pour le support

Si le problème persiste, fournissez :
1. Les messages de la console du navigateur
2. Les résultats de la requête SQL de test
3. Un screenshot de la table `attendance_records` dans Supabase
4. Les IDs : `employee_id`, `company_id`, et la `date` de l'enregistrement

