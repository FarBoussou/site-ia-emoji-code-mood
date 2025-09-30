# 📘 Rapport de projet — *Mood Sharing App*  
**Auteur** : Fares     
**Lien du site fonctionel** : [🌐 Mood Sharing App](https://v0-emoji-code-mood-app.vercel.app)  
**Lien du site déployé sur GitHub** pour montrer que le déploiement a bien été effectué, mais le site n'est pas fonctionnel car il affiche une page blanche : [❌Site déployé GitHub](https://v0-emoji-code-mood-app.vercel.app](https://farboussou.github.io/mood-sphere-56/))  

---

## ✨ 1. Présentation du projet
Le projet consiste à développer un site web qui permet aux utilisateurs de **partager leur humeur** et de **consulter celles des autres**.  
Ce site a pour **thème l’intelligence artificielle**, représentée ici à travers l’idée d’une application capable de collecter et d’analyser les émotions partagées.  

🎯 **Objectif principal** : proposer une interface simple et accessible, sans authentification complexe, qui utilise une approche inspirée de l’IA pour gérer et afficher les ressentis des utilisateurs.

---

## 🛠️ 2. Technologies utilisées
- **Frontend** : HTML, CSS, JavaScript  
- **Backend** : Node.js (gestion des routes et formulaires)  
- **Base de données** : Superdatabase (stockage des humeurs)  
- **Scripts SQL** : évolution de la base (contraintes, corrections)  

---

## 📑 3. Fonctionnalités principales
### 📝 Partage d’humeur
- Formulaire avec texte + slider (niveau d’énergie).  
- Envoi et sauvegarde automatique dans la base de données.  

### 👀 Consultation
- Page dédiée affichant toutes les humeurs partagées.  
- Navigation simple depuis la page d’accueil.  

### 🧭 Navigation
- Accueil avec bouton redirigeant vers la page *Humeurs*.  

---

## ⚠️ 4. Problèmes rencontrés et solutions
### 🔹 Contrainte `session_id` non nulle  
- **Problème** : la table `mood_responses` exigeait un `session_id`.  
- **Solution** : suppression de la dépendance aux sessions pour simplifier l’application.  

### 🔹 Contrainte `energy_level` (1 à 5)  
- **Problème** : le slider envoyait une valeur 0–100 (incompatible avec la contrainte).  
- **Solution** : conversion automatique 0–100 → 1–5.  

### 🔹 Clé étrangère `session_id` inexistante  
- **Problème** : le code utilisait un `session_id` fixe absent de la table.  
- **Solution** : suppression de la contrainte de clé étrangère et insertion sans session.  

---

## ✅ 5. Résultats obtenus
- ✔️ Les utilisateurs peuvent partager leur humeur.  
- ✔️ Les humeurs s’affichent correctement sur la page dédiée.  
- ✔️ L’application est simple, intuitive et utilisable sans compte.  

---

## 🔮 6. Limites et améliorations possibles
- 🎨 Améliorer l’UI (ajout d’emojis, couleurs dynamiques).  
- 🔎 Ajouter des filtres (par date, par énergie).  
- 🔐 Mettre en place une authentification basique pour personnaliser l’expérience.  
- 🤖 Explorer l’usage de l’IA pour **analyser automatiquement les humeurs** (ex. : reconnaître les émotions dans les textes).  

---

## 🏁 7. Conclusion
Ce projet illustre le lien entre **frontend ↔ backend ↔ base de données** et a permis de résoudre des problèmes concrets liés aux contraintes SQL et à la gestion des sessions.  

👉 Le résultat final est une application claire, fonctionnelle et inspirée du thème de l’intelligence artificielle.  

---
