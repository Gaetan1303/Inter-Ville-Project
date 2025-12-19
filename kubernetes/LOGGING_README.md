# Pipeline de Logs Inter-Ville

##  Architecture de monitoring

```
Applications (Frontend/Backend) 
    ↓ (logs JSON structurés)
Fluentd (collecteur)
    ↓ (indexation)
Elasticsearch (stockage)
    ↓ (visualisation)  
Kibana (dashboard)
```

## Déploiement automatique

La pipeline de logs est déployée automatiquement avec votre application via GitHub Actions.

### Services déployés :
- **Fluentd** : Collecte des logs depuis tous les pods
- **Elasticsearch** : Stockage et indexation des logs  
- **Kibana** : Interface de visualisation

##  Accès aux dashboards

Une fois déployé, accédez à Kibana via :
- **URL** : `http://inter-ville.local/kibana`
- **Configuration** : Aucune authentification requise

##  Index patterns Kibana

### Configuration automatique :
1. **Pattern** : `inter-ville-*` 
2. **Champ timestamp** : `@timestamp`
3. **Refresh** : Auto (30s)

### Champs disponibles :
- `level` : Niveau de log (info, warn, error)
- `message` : Message du log
- `service` : Service source (backend/frontend)
- `method` : Méthode HTTP (GET, POST, etc.)
- `url` : URL de la requête
- `statusCode` : Code de réponse HTTP
- `duration` : Temps de traitement
- `ip` : IP du client
- `userAgent` : User-Agent du navigateur

##  Dashboards recommandés

### 1. **Vue d'ensemble application**
- Nombre de requêtes par minute
- Répartition des codes de statut
- Temps de réponse moyen
- Top 10 des URLs les plus utilisées

### 2. **Monitoring des erreurs** 
- Logs d'erreur en temps réel
- Tendance des erreurs sur 24h
- Top des erreurs par service
- Stack traces complètes

### 3. **Performance**
- Latence P50, P95, P99
- Requêtes les plus lentes
- Pics de charge
- Usage des ressources

##  Alertes (optionnel)

Pour configurer des alertes :
1. Installer Elasticsearch Watcher
2. Définir des seuils (ex: > 50 erreurs/min)
3. Notifications par email/Slack

##  Configuration avancée

### Filtres personnalisés Fluentd :
- Exclusion des health checks
- Parsing spécifique par service
- Enrichissement avec métadonnées K8s

### Retention Elasticsearch :
- **Par défaut** : 7 jours
- **Configurable** via ILM policies
- **Archivage** vers S3 possible

##  Debugging

### Vérifier les logs :
```bash
# Status Fluentd
kubectl logs daemonset/fluentd

# Status Elasticsearch  
kubectl logs deployment/elasticsearch

# Status Kibana
kubectl logs deployment/kibana
```

### Troubleshooting commun :
- **Pas de logs** : Vérifier permissions RBAC Fluentd
- **Kibana inaccessible** : Vérifier Ingress + DNS
- **ES out of memory** : Augmenter limits dans deployment

---

 **Pipeline de logs complète et production-ready !**