# hellogassy-backend

## Configuration

Créez un fichier `.env` à la racine du dossier backend avec les variables suivantes :

```env
MONGODB_URI=...
JWT_SECRET=...
MAIL_USER=...
MAIL_PASS=...

# WhatsApp Cloud API
WHATSAPP_TOKEN=EAAG...
WHATSAPP_PHONE_ID=123456789012345
# Liste de numéros admin séparés par des virgules, format E.164 sans + (ex: 221774093230)
WHATSAPP_ADMIN_NUMBERS=221774093230
```

Assurez-vous que le numéro client capté est au format local (9 chiffres SN) ou international; le service convertit automatiquement en E.164 sans le signe `+`.
