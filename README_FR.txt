FAMILLED — ESPACE EN LIGNE

Cette archive rassemble la version du site et la configuration Supabase mise à jour.

ESPACE EN LIGNE : SUPABASE
Le projet Supabase qhlrbzqlivkaiydfkkqg sert d'espace en ligne pour conserver les données familiales :
- 12 membres de la famille
- photos de profil dans Family-media
- publications texte/photo
- commentaires
- réactions
- dates de création

SITE : GITHUB PAGES
Le site reste hébergé séparément sur GitHub Pages.
Conserver famille-banner.jpg dans le dépôt GitHub.

MOT DE PASSE DU SITE : DEO

CONFIGURATION SUPABASE
URL : https://qhlrbzqlivkaiydfkkqg.supabase.co
La clé publishable utilisée par le site est publique côté navigateur et ne doit pas être remplacée par une clé secrète.

INSTALLATION / MISE À JOUR
1. Dans Supabase > SQL Editor, ouvrir Familled_SUPABASE_TOUT_EN_UN.sql et cliquer Run.
2. Le script crée/actualise les tables, les 12 membres, les règles RLS et le bucket Family-media.
3. Dans GitHub, remplacer uniquement index.html par celui fourni ici.
4. Garder famille-banner.jpg.
5. L'authentification anonyme doit rester activée dans Supabase (elle l'est déjà dans le projet actuel).

IMPORTANT
Ne jamais mettre une clé secrète/service_role dans index.html.
Les photos lourdes sont compressées par le site avant envoi.
