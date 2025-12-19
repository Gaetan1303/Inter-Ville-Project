# Guide d'installation de Kubernetes et Minikube

Ce guide explique pas à pas comment installer Kubernetes (via Minikube) sur une machine locale (Linux, Ubuntu conseillé).

## 1. Prérequis
- Système : Linux (Ubuntu recommandé)
- Accès root/sudo
- Connexion Internet
- Docker installé (ou autre hyperviseur compatible)

## 2. Installer Docker (si besoin)
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
```
> Déconnecte-toi/reconnecte-toi pour activer le groupe docker.

## 3. Installer kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client
```

## 4. Installer Minikube
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version
```

## 5. Démarrer Minikube
```bash
minikube start --driver=docker
```
> Si tu as peu de RAM, tu peux spécifier la mémoire :
> ```bash
> minikube start --driver=docker --memory=1800
> ```

## 6. Vérifier l'installation
```bash
minikube status
minikube kubectl -- get pods -A
```

## 7. Utiliser kubectl
Pour utiliser kubectl directement :
```bash
alias kubectl="minikube kubectl --"
```

## 8. Arrêter et supprimer Minikube
```bash
minikube stop
minikube delete
```

## 9. Créer le dossier `kubernetes` et organiser ses fichiers

Pour gérer tes déploiements, crée un dossier `kubernetes` à la racine de ton projet :
```bash
mkdir kubernetes
```
Place dans ce dossier tous tes fichiers YAML de configuration (ex : `backend-deployment.yaml`, `frontend-deployment.yaml`, `mysql-deployment.yaml`, etc.).

Exemple d’arborescence :
```
kubernetes/
  backend-deployment.yaml
  backend-service.yaml
  frontend-deployment.yaml
  frontend-service.yaml
  mysql-deployment.yaml
  mysql-service.yaml
  redis-deployment.yaml
  redis-service.yaml
```

Pour appliquer tous tes manifests d’un coup :
```bash
minikube kubectl -- apply -f kubernetes/
```

## 10. Problèmes courants et solutions

- **ErrImageNeverPull** : Vérifie que l’image existe dans Minikube (`minikube ssh -- docker images`) et que le champ `imagePullPolicy` est bien `IfNotPresent`.
- **Mémoire insuffisante** : Minikube peut échouer à démarrer si la mémoire allouée est trop faible. Utilise `--memory=1800` ou ajuste selon ta machine.
- **Pods bloqués en ContainerCreating** : Vérifie les logs du pod avec :
  ```bash
  minikube kubectl -- describe pod <nom-du-pod>
  minikube kubectl -- logs <nom-du-pod>
  ```
- **Problèmes de port-forwarding** : Si tu n’accèdes pas à tes services, relance le port-forwarding ou utilise `minikube service <service-name>` pour ouvrir l’URL dans le navigateur.
- **Conflits de ports** : Assure-toi qu’aucun autre service n’utilise les ports 3000, 5000, etc. sur ta machine locale.
- **Problèmes de droits Docker** : Si tu obtiens des erreurs de permission, vérifie que ton utilisateur est bien dans le groupe `docker` et reconnecte-toi.

## 11. Builder et importer les images backend/frontend dans Minikube

Pour que Minikube puisse utiliser tes images Docker locales (backend et frontend), suis ces étapes :

### a) Builder les images localement
Place-toi à la racine de ton projet et exécute :
```bash
docker build -t backend:latest ./backend
docker build -t frontend:latest ./frontend
```

### b) Importer les images dans Minikube
```bash
minikube image load backend:latest
minikube image load frontend:latest
```

### c) Vérifier la présence des images dans Minikube
```bash
minikube ssh -- docker images
```

Assure-toi que tes fichiers de déploiement Kubernetes (`backend-deployment.yaml`, `frontend-deployment.yaml`) utilisent bien les images `backend:latest` et `frontend:latest` (sans préfixe de registre).

---

**Remarque** : Si tu rebuildes une image, pense à refaire `minikube image load ...` pour mettre à jour l’image dans le cluster.

---

Pour toute question, consulte la documentation officielle ou demande de l’aide à Mimine !

