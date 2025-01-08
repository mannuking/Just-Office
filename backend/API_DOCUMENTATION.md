# Authentication API Documentation

## Base URL
`http://localhost:5001/api`

## Endpoints

### Sign Up
- **URL**: `/auth/signup`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Success Response**:
  - **Code**: 201
  - **Content**:
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "email": "user@example.com"
    }
}
```
- **Error Response**:
  - **Code**: 400
  - **Content**:
```json
{
    "success": false,
    "message": "User already exists"
}
```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Success Response**:
  - **Code**: 200
  - **Content**:
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "jwt_token_here",
        "user": {
            "id": "user_id",
            "email": "user@example.com"
        }
    }
}
```
- **Error Response**:
  - **Code**: 401
  - **Content**:
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

## Error Handling
All endpoints include error handling for:
- Invalid input data
- Database errors
- Server errors
- Authentication errors

## Authentication
After successful login, use the JWT token in subsequent requests:
```
Authorization: Bearer <token>
