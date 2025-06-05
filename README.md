**Tours API**
A simple RESTful API built with Node.js, Express, and MongoDB/Mongoose to manage tour data. It supports basic CRUD operations plus filtering, sorting, field limiting, and pagination in the “get all tours” endpoint.

---

## Endpoints

### 1. GET /tours

* **Description:** Return all tours (with optional filtering, sorting, field limiting, pagination).
* \*\*Query Parameters (optional):
  • Filtering: e.g. `?duration[gte]=5&price[lt]=1500`
  • Sort: `?sort=-price,ratingsAverage`
  • Fields: `?fields=name,price,ratingsAverage`
  • Pagination: `?page=2&limit=10`
* **Example:**

```
GET /api/v1/tours?duration[gte]=5&sort=-price&page=2&limit=5
```

* **Response:**

  ```json
  {
    "status": "success",
    "size": <number_of_tours_returned>,
    "data": { "tours": [ /* array of tour objects */ ] }
  }
  ```

---

### 2. GET /tours/\:id

* **Description:** Return a single tour by its MongoDB ObjectId.
* **URL Parameter:** `:id` (tour’s ObjectId)
* **Example:**

```
GET /api/v1/tours/60c72b2f9f1b8c6a5f4d8a3e
```

* **Response:**

  ```json
  {
    "status": "success",
    "data": { "tour": { /* tour object */ } }
  }
  ```

---

### 3. POST /tours

* **Description:** Create a new tour.
* **Request Body (JSON):**

  ```json
  {
    "name": "The Forest Hiker",
    "duration": 5,
    "maxGroupSize": 25,
    "difficulty": "medium",
    "price": 397,
    "summary": "Breathtaking hike …",
    "description": "Full description here …",
    "imageCover": "tour-1-cover.jpg",
    "startDates": ["2021-07-19", "2021-08-19"]
  }
  ```
* **Example:**

```
POST /api/v1/tours
Content-Type: application/json

{ /* JSON body as above */ }
```

* **Response:**

  ```json
  {
    "status": "success",
    "data": { "tour": { /* newly created tour object */ } }
  }
  ```

---

### 4. PATCH /tours/\:id

* **Description:** Partially update a tour’s fields by its ID.
* **URL Parameter:** `:id` (tour’s ObjectId)
* **Request Body (JSON):** Include only fields you want to change.

  ```json
  { "price": 450, "difficulty": "hard" }
  ```
* **Example:**

```
PATCH /api/v1/tours/60c72b2f9f1b8c6a5f4d8a3e
Content-Type: application/json

{ "price": 450, "difficulty": "hard" }
```

* **Response:**

  ```json
  {
    "status": "success",
    "data": { "tour": { /* updated tour object */ } }
  }
  ```

---

### 5. DELETE /tours/\:id

* **Description:** Delete a tour by its ID.
* **URL Parameter:** `:id` (tour’s ObjectId)
* **Example:**

```
DELETE /api/v1/tours/60c72b2f9f1b8c6a5f4d8a3e
```

* **Response:**

  ```json
  {
    "status": "success",
    "data": null
  }
  ```

---

**Note:** All endpoints are prefixed with `/api/v1`. Ensure MongoDB is running and Mongoose is connected before making requests.
