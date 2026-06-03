# Polling System

## Overview

The polling system allows teachers to create live polls and lets students vote anonymously in real time. Results are updated instantly across all connected devices using WebSockets.

### Real-World Example

Think of it like a classroom quiz:

1. Teacher writes a question on the board.
2. Students raise their hands to vote.
3. Vote counts update immediately.
4. Teacher sees live results.

This system provides the same experience digitally.

---

## How It Works

### 1. Teacher Creates a Poll

The teacher creates a poll from the dashboard.

**Example:**

Question:

```
Which topic should we cover next?
```

Options:

```
Algebra
Geometry
Statistics
```

When the teacher clicks **Create Poll**:

* The poll is saved in the database.
* A WebSocket event is sent.
* All connected students instantly receive the new poll.

---

### 2. Students Vote

Students access the public polling page without logging in.

Steps:

1. The poll appears automatically.
2. The student selects an option.
3. The vote is stored in the database.
4. Updated results are broadcast to everyone.

---

### 3. Live Results

Results are updated in real time.

Example:

```
Algebra     : 15 votes (60%)
Geometry    : 7 votes (28%)
Statistics  : 3 votes (12%)
```

Teachers and students see the results update instantly whenever a new vote is submitted.

---

## Database Structure

### Polls Table

Stores poll information.

| Field      | Description              |
| ---------- | ------------------------ |
| id         | Poll identifier          |
| question   | Poll question            |
| options    | Available choices        |
| teacher_id | Poll creator             |
| is_active  | Poll status              |
| end_time   | Optional expiration time |
| created_at | Creation timestamp       |

Example:

```json
{
  "id": "abc-123",
  "question": "Which topic should we cover next?",
  "options": ["Algebra", "Geometry", "Statistics"],
  "teacher_id": "teacher-id",
  "is_active": true
}
```

### Votes Table

Stores individual votes.

| Field         | Description        |
| ------------- | ------------------ |
| id            | Vote identifier    |
| poll_id       | Associated poll    |
| option_index  | Selected option    |
| voter_session | Anonymous voter ID |
| created_at    | Vote timestamp     |

Example:

```json
{
  "poll_id": "abc-123",
  "option_index": 0,
  "voter_session": "xyz789"
}
```

---

## Preventing Double Voting

Each browser receives a unique session identifier:

```javascript
const session =
  localStorage.getItem('voter_session') ||
  Math.random().toString(36);
```

The database enforces:

```sql
UNIQUE(poll_id, voter_session)
```

This ensures that a user can only vote once per poll.

If a duplicate vote is attempted:

```json
{
  "success": false,
  "error": "Already voted"
}
```

---

## Real-Time Updates with WebSockets

### Without WebSockets

```
Student votes
      ↓
Vote saved
      ↓
Other users must refresh page
```

### With WebSockets

```
Student votes
      ↓
Vote saved
      ↓
Server broadcasts update
      ↓
All connected users see new results instantly
```

This works similarly to a live sports scoreboard where everyone sees updates at the same time.

---

## API Endpoints

### Teacher Endpoints

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| POST   | /api/polls            | Create a new poll              |
| GET    | /api/polls/my-polls   | View teacher polls and results |
| PATCH  | /api/polls/:id/toggle | Activate or deactivate a poll  |
| DELETE | /api/polls/:id        | Delete a poll                  |

### Student/Public Endpoints

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| GET    | /api/polls/active   | Get active polls |
| POST   | /api/polls/:id/vote | Submit a vote    |

---

## Polling Workflow

```text
Teacher creates poll
        ↓
Poll saved to database
        ↓
Students receive poll instantly
        ↓
Students vote
        ↓
Votes stored in database
        ↓
Server broadcasts updates
        ↓
Results update live for everyone
```

---

## Summary

The polling system enables teachers to create live polls, allows students to vote anonymously, prevents duplicate voting, and provides real-time results using WebSockets.
