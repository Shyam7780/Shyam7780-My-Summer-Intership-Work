# Chhotan Ram Construction - Backend (MongoDB)

## Setup Instructions

1. Go to `backend/` folder
2. Run:
   ```bash
   npm install
   cp .env.example .env
   ```

3. Add your MongoDB Atlas connection string in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- **Rate**: `GET/PUT /api/rate`
- **Inquiries**: `POST /api/inquiries`, `GET /api/inquiries`
- **Feedback**: `POST /api/feedback`, `GET /api/feedback`
- **Gallery**: `GET/POST/DELETE /api/gallery`
- **Admin Login**: `POST /api/admin/login` (email: admin@chhotanram.com, password: admin123)

Frontend is already updated to call these endpoints (change the baseURL if backend is deployed on Render/H Railway).

The frontend and backend are now completely separated into two folders.
