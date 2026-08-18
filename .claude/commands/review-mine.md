Auto-review du diff git courant avant commit.

1. Lis le `git diff` complet (staged + unstaged)
2. Pour chaque fichier modifie, lis le CLAUDE.md de l'app concernee
3. Verifie chaque point :

**Conventions code (skill python) :**
- Imports dans l'ordre : stdlib → third-party → Django → DRF → local
- Nommage : snake_case fonctions/variables, PascalCase classes, UPPER_SNAKE_CASE constantes
- Guillemets doubles, f-strings, type hints quand utile
- Pas de bare `except:`, pas de valeurs hardcodees pour les constantes metier

**Tests :**
- Toute nouvelle fonctionnalite a des tests correspondants
- Les tests existants ne sont pas casses par le changement
- `@override_settings(SECURE_SSL_REDIRECT=False)` sur les classes de test

**Qualite :**
- Pas de requetes N+1 (utiliser select_related/prefetch_related)
- Pas de code mort ou commente
- `@extend_schema` sur chaque nouvel endpoint
- `__str__()` sur chaque nouveau modele

**Documentation :**
- Si le comportement public change : `<app>/docs/API.md` mis a jour
- Si la structure de fichiers change : `<app>/CLAUDE.md` mis a jour
- Si un nouveau terme metier apparait : `docs/domain/GLOSSAIRE.md` mis a jour
- Si une decision structurante est prise : ADR cree dans `docs/architecture/`

**Securite :**
- Pas de secrets, credentials, cles API dans le diff
- Pas de `csrf_exempt` sauf sur les webhooks
- Validations presentes sur les entrees externes

4. Produis un verdict :

```
## Review du diff

| Critere | Verdict | Detail |
|---------|---------|--------|
| Conventions | OK/KO | ... |
| Tests | OK/KO | ... |
| Qualite | OK/KO | ... |
| Documentation | OK/KO | ... |
| Securite | OK/KO | ... |

**Verdict final** : PASS / FAIL
**Issues a corriger** : (liste numerotee si FAIL)
```
