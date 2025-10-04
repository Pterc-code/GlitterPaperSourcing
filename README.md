# Glitter Paper Sourcing

Glitter Paper Sourcing is a full-stack web application that helps sourcing teams manage product catalogs, forms, and user accounts. The project is split into a Django REST backend and a React frontend, enabling the team to track supplier information and collaborate on sourcing tasks efficiently.

## Project Structure

- **backend/** – Django project that exposes REST APIs for accounts, forms, and product management.
- **frontend/** – React application that consumes the backend APIs to deliver the user experience.

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+
- (Optional) A virtual environment tool such as `venv` or `conda`

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The development server will start on `http://127.0.0.1:8000/` by default.

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React development server runs on `http://localhost:3000/`.

## Configuration

Adjust Django settings in `backend/backend/settings.py` as needed (e.g., secret key, email, database). For the React app, you can create a `.env` file in `frontend/` to override defaults like the API base URL (e.g., `REACT_APP_API_URL`).

## Running Tests

- **Backend** – `python manage.py test`
- **Frontend** – `npm test`

## Linting & Formatting

- **Backend** – Use `flake8` and `black` (install via `pip` as needed).
- **Frontend** – Run `npm run lint` to check linting status.

## Contributing

1. Fork the repository and create your feature branch: `git checkout -b feature/my-feature`.
2. Commit your changes: `git commit -am 'Add new feature'`.
3. Push to the branch: `git push origin feature/my-feature`.
4. Open a Pull Request describing your changes.

## License

This project is intended for internal use by the Glitter Paper Sourcing team. Contact the maintainers for licensing details.
