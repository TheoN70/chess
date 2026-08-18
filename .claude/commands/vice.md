Audit de securite avec `vice` (VICE - Vulnerability Inspector & Code Examiner, `/usr/local/bin/vice`), en local (white-box, code source) ou en blackbox (URL).

Argument : `$ARGUMENTS` = un chemin local (ex. `frontend`, `backend`, `.`) OU une URL (ex. `https://sandbox.officein.fr/`). Si vide, demande lequel auditer.

Les exclusions du mode local sont dans `.viceignore` a la racine du projet.

## Mode local — l'argument n'est PAS une URL

Non interactif, une seule commande. `--ci` sort en code != 0 si le score est sous le seuil, d'ou le `|| true` :

```bash
vice audit <chemin> --ci --json || true
```

Sortie JSON sur stdout. Sans `--json`, l'affichage console est lisible directement (score, findings groupes par module). Duree : moins d'une minute.

## Mode blackbox — l'argument EST une URL

**NE PAS lancer `vice scan` toi-meme.** Demande a l'utilisateur de le lancer avec le prefixe `!`, puis attends qu'il te donne le chemin du rapport :

```
! VICE_DISABLE_CHROMIUM_SANDBOX=1 vice scan <URL>
```

`VICE_DISABLE_CHROMIUM_SANDBOX=1` est **obligatoire** : sinon Chromium ne demarre pas (Ubuntu bloque les namespaces non privilegies), les modules crawl / analyse JS / XSS / login echouent silencieusement et le rapport remonte un faux CRITIQUE `Unable to launch browser - No usable sandbox!`.

Pourquoi ne pas l'automatiser (teste, echoue deux fois) : `vice scan` est interactif (cases a cocher des modules) et refuse un stdin ferme (`ERR_USE_AFTER_CLOSE`). Le contourner avec un pty synthetique (`script -qec`) fait **partir le scan en boucle CPU a 100 % sans jamais ecrire de rapport** (tue a 15 min puis a 53 min, zero I/O, Chromium fils inactif). Accessoirement, rediriger la sortie vers un fichier ecrit ~7 Mo/s de redraws de spinner (1,3 Go en 15 min). Depuis un vrai terminal, le scan passe du premier coup en 15 a 30 min.

Le rapport est ecrit dans `~/.vice/scans/vice-report-<hote>-<timestamp>.json`. Attention : le dossier contient les rapports precedents du meme hote — prendre celui que l'utilisateur indique, ou le plus recent (`ls -t`), jamais un match par nom seul.

Lecture du rapport :

```bash
python3 -c "
import json,sys
d=json.load(open(sys.argv[1]))
print(d['grade'], d['score'], '| fiable:', d.get('score_reliable'))
for f in d['findings']: print(f['severity'], '|', f['module'], '|', f['title'])
" <rapport.json>
```

## Restitution

Trie par severite et **triez les faux positifs avant de les presenter** — c'est le coeur du travail, `vice` est bruyant. Faux positifs connus sur ce projet :

- **`dangerouslySetInnerHTML` sans sanitizer** : faux positif si l'appel passe par `cleanHTML()` (`frontend/src/lib/sanitize.ts`, DOMPurify). `vice` ne reconnait pas le wrapper. N'est un vrai finding que si `__html` recoit une valeur brute.
- **`innerHTML` sur template statique** : pas d'injection possible, ignorer.
- **`Unable to launch browser`** (CRITIQUE) : probleme d'environnement local, pas une faille — voir piege 3 ci-dessus, le scan est a relancer.
- **Paquets npm outdated** : signal de maintenance, pas une vulnerabilite. Ne compte que si `npm audit` remonte une CVE.

Pour chaque finding retenu : severite, emplacement (`fichier:ligne` ou endpoint), impact concret, remediation. Dis explicitement ce qui a ete ecarte et pourquoi.

Les findings assumes / by-design (pentest 2026-07-23 : Swagger public, `order_by` 500, bypass ClamAV > 250 Mo...) ne doivent pas etre re-signales.
