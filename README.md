English · [Русский](README.ru.md)

<p align="center"><img src="frontend/public/rowlore-mark.svg" width="96" height="96" alt="Rowlore logo"></p>

<h1 align="center">Rowlore</h1>

<p align="center"><strong>Ad hoc spreadsheet analysis with AI.</strong></p>

<p align="center">
  Classify requests, extract attributes from product descriptions, or tag records from an error log. Rowlore runs your plain-language instructions on rows or groups in an XLSX or CSV file and exports the results to Excel.
</p>

<p align="center">
  <a href="#deploy">Deploy Rowlore</a> · <a href="#run-an-analysis">Run a sample report</a> · <a href="docs/CONFIGURATION.md">Configure .env and replicas</a>
</p>

![Rowlore workspace with a demo workbook ready for analysis](docs/images/workspace.png)

## Deploy

You need Docker with Compose and a model endpoint reachable from the containers. Rowlore supports OpenAI-compatible HTTP APIs and Ollama.

### 1. Prepare the checkout

```bash
git clone https://github.com/MaksimSamarin/rowlore.git
cd rowlore
cp .env.example .env
```

In PowerShell, use `Copy-Item .env.example .env` for the last command.

### 2. Fill in `.env`

Use this command to generate a random value for each secret you configure.

```sh
docker run --rm python:3.12-slim python -c "import secrets; print(secrets.token_hex(32))"
```

| Setting | Value |
| --- | --- |
| `APP_SECRET` | A long random string used to encrypt saved model API keys. Keep it when upgrading. |
| `POSTGRES_PASSWORD` | The password for the PostgreSQL account in `POSTGRES_USER`. |
| `DATABASE_URL` | Rowlore’s database connection string. With the bundled database, use `postgresql://review_analyzer:<postgres-password>@postgres:5432/review_analyzer` and insert the same password as in `POSTGRES_PASSWORD`. |

For an **OpenAI-compatible endpoint**, set `OPENAI_BASE_URL` to your endpoint base URL, with or without the trailing `/v1`. Set `OPENAI_MODELS` to its model IDs, separated by commas, and set `OPENAI_API_KEY` to the key. You can also enter the key before running an analysis. For a local endpoint that accepts requests without authentication, use a placeholder such as `local`.

For **Ollama**, set `OLLAMA_BASE_URL` and `OLLAMA_MODELS`, then select Ollama in Rowlore. On Docker Desktop, a provider running on the host is reachable at an address such as `http://host.docker.internal:11434`.

To create the first local administrator, set `BOOTSTRAP_ADMIN_USERNAME` and `BOOTSTRAP_ADMIN_PASSWORD` before the first start. Use at least eight characters, including a letter and a digit, for the password.

See the [configuration guide](docs/CONFIGURATION.md) for complete examples and the settings you can tune.

### 3. Start the services

```sh
docker compose up -d --build --wait
docker compose ps
```

Open [Rowlore](http://127.0.0.1:8080/) and check the [API health endpoint](http://127.0.0.1:8080/api/health). If the port is occupied, set `FRONTEND_PORT` in `.env` and open the new port.

Start with the six default containers and a 200 GB data disk. The [hardware and scaling guide](docs/CONFIGURATION.md#hardware-and-scaling) gives a starting resource budget and shows how to add a worker when the queue grows.

## Run an analysis

1. Sign in or create a local account. Under **Data & model**, upload a file or open **Sample files** and choose the smaller demo workbook.
2. Pick the columns that should go to the model. Use the export column selector for columns to carry through unchanged. Check the sheet and model before continuing.
3. Under **Template**, choose a preset or write a prompt and add the response fields you want, such as a summary and a sentiment label. Select **Preview model input** to review the prompt, selected data, and response schema.
4. For the first run, open **Advanced LLM settings** and set **Review limit** to a small number such as 12. Select **Start a new analysis**. Follow progress in **My reports**, open the result, and download the Excel file.

Use a grouping column when several rows describe one unit, such as a store shift. Rowlore sends one request per group and returns one result row per group.

![Completed report with a summary and structured results](docs/images/report.png)

## Administration

- **Language.** English is the default. In **Administration → Settings**, choose English or Russian. This setting controls the interface, built-in prompts, and demo files. Rowlore keeps the language selected for each report when retrying or resuming it. Your prompt and selected source data keep their original language.
- **Models.** Environment variables seed the model catalog once. Use **Administration → Models** to manage it after the first start.
- **Access.** Local sign-in and registration are available by default. Administrators can manage groups, quotas, and access requests. An external OIDC provider can connect a directory such as Active Directory. [Sign-in and OIDC setup](docs/AUTHENTICATION.md)

## Upgrade an existing installation

Back up PostgreSQL and the upload and results volumes. Stop the existing services with `docker compose stop`. Keep the Compose project name, volume mappings, database credentials, and `APP_SECRET`, then run the same start command from the updated checkout. Startup applies the schema migration, preserving local passwords and reports from v2.0.0.

### Upgrade from Analyzer

Rowlore 2.3.0 is the former Analyzer under a new name and with a new interface. The upgrade keeps your data and settings:

- **Volumes.** Compose names containers, images, and volumes after the project name, which defaults to the checkout directory. Upgrade the existing checkout in place. If you clone into a new `rowlore` directory, set `COMPOSE_PROJECT_NAME` in `.env` to the previous project name, for example `ai-feedback-analysis`. A new project name starts with empty volumes.
- **Internal names.** Service names, `.env` settings, the `review_analyzer` database name and user, Redis queue keys, and browser settings keep their names. Existing `.env` files work without changes.
- **Repository.** The repository moved to `github.com/MaksimSamarin/rowlore`, and the old address redirects. Update the remote with `git remote set-url origin https://github.com/MaksimSamarin/rowlore.git`.
- **Interface.** The interface follows the system theme until a user picks a theme in the menu. A previously chosen dark theme is kept. A custom logo in `branding/` still replaces the built-in mark.

## Reference

- [Architecture and data flow](docs/ARCHITECTURE.md)
- [Development and tests](docs/TESTING.md)
- [Release notes](docs/RELEASE_NOTES_EN.md)
- [Custom logo](branding/README.md)
- [MIT license](LICENSE)
