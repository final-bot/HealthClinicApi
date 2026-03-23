<a id="readme-top"></a>

# Clinic Appointment API

### Product features:
- Ability to book appointments between a clinician and a patient
- Admin has ability to view all appointments (including a limit or time range, sorted in ASCENDING order)
- Ability to view appointments for a specific clinician

### Design decisions:
- Typescript/Express server setup for type safety & simplicity
- Prisma + SQLite for simplicity and reliability
- Zod for schema validation
- Service layer for business logic
- Overlap handled via query condition: start < other.end && end > other.start

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

You will see you're now connected to the server/database via port 3000

## Running tests

```bash
npm test
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# API examples

Use the below examples to test the Clinic API. Just copy + paste into your terminal after starting up your server (either locally (port 3000) or via Dockerfile (port 3001))

### Create appointment - 201

```bash
curl -X POST http://localhost:3000/appointments \
-H "Content-Type: application/json" \
-d '{
  "start": "2030-01-01T10:00:00.000Z",
  "end": "2030-01-01T11:00:00.000Z",
  "clinicianId": "c1",
  "patientId": "p1"
}'
```

### Create appointment - 201 - Back-to-back booking

```bash
curl -X POST http://localhost:3000/appointments \
-H "Content-Type: application/json" \
-d '{
  "start": "2030-01-01T11:00:00.000Z",
  "end": "2030-01-01T12:00:00.000Z",
  "clinicianId": "c1",
  "patientId": "p3"
}'
```

### Create appointment - 400 BAD REQUEST - booking in the past

```bash
curl -X POST http://localhost:3000/appointments \
-H "Content-Type: application/json" \
-d '{
  "start": "2020-01-01T10:00:00.000Z",
  "end": "2020-01-01T11:00:00.000Z",
  "clinicianId": "c1",
  "patientId": "p7"
}'
```

### Create appointment - 400 BAD REQUEST - zero-length appointment

```bash
curl -X POST http://localhost:3000/appointments \
-H "Content-Type: application/json" \
-d '{
  "start": "2030-01-01T12:00:00.000Z",
  "end": "2030-01-01T12:00:00.000Z",
  "clinicianId": "c1",
  "patientId": "p6"
}'
```

### Create appointment - 409 CONFLICT - Attempted overlapped booking

```bash
curl -X POST http://localhost:3000/appointments \
-H "Content-Type: application/json" \
-d '{
  "start": "2030-01-01T10:30:00.000Z",
  "end": "2030-01-01T11:30:00.000Z",
  "clinicianId": "c1",
  "patientId": "p2"
}'
```

### CLINICIANS - Get appointments

```bash
curl http://localhost:3000/clinicians/c1/appointments
```

### ADMIN - Get all appointments

```bash
curl http://localhost:3000/appointments \
-H "x-role: admin"
```

- With from/to filtering

```bash
curl "http://localhost:3000/appointments?from=2030-01-01T00:00:00Z&to=2030-01-02T00:00:00Z" \
-H "X-Role: admin"
```

- With limit utilised

```bash
curl "http://localhost:3000/appointments?limit=2" \
-H "X-Role: admin"
```

### NON-ADMIN - Try to get all appointments - Forbidden

```bash
curl http://localhost:3000/appointments
```

### Successful delete as admin - 200

```bash
curl -X DELETE http://localhost:3000/appointments/<id> \
-H "X-Role: admin"
```

### Non-admin delete - 409

```bash
curl -X DELETE http://localhost:3000/appointments/<id> \
-H "X-Role: patient"
```

### Successful admin delete with reason and deletedBy fulfilled - 200

```bash
curl -X DELETE http://localhost:3000/appointments/<id> \
-H "Content-Type: application/json" \
-H "X-Role: admin" \
-d '{                                 
  "deletedBy": "admin",             
  "deletionReason": "Patient requested cancellation"
}'
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Docker via Dockerfile

```dockerfile
FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD sh -c "npx prisma migrate deploy && npm run dev"
```

### Build the image

```bash
docker build -t clinic-api .
```

### Run the container

```bash
docker run -p 3000:3000 \
-e DATABASE_URL="file:/app/prisma/dev.db" \
-v $(pwd)/prisma:/app/prisma \
clinic-api
```

### Verify the data persisted (e.g appointments created)

```bash
docker ps
docker exec -it <container_id> sh

sqlite3 prisma/dev.db

.tables
```

View appointments or run other typical SQL queries:

```bash
SELECT * FROM Appointment;
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Swagger API spec:

```bash
http://localhost:3000/docs
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Tradeoffs/considerations: 

- ### No real authentication (header simulation only)

### Concurrency & Race Conditions

Appointment creation is wrapped in a database transaction to reduce the risk of race conditions during concurrent booking attempts.

The flow is:

1. Start a transaction
2. Check for overlapping appointments for the same clinician
3. Insert the new appointment if no overlap exists

This ensures the overlap check and insert occur atomically within a single transaction.

### Limitations

SQLite has limited concurrency support and does not provide strong guarantees under high contention. In a production system, this would be improved by:

- Using a database with stronger isolation guarantees (e.g. PostgreSQL)
- Applying row-level locking or exclusion constraints on time ranges
- Adding retry logic for failed transactions

For the purposes of this challenge, the transactional approach provides reasonable protection against race conditions while keeping the implementation simple.

----------------------------------------------------

<p align="right">(<a href="#readme-top">back to top</a>)</p>