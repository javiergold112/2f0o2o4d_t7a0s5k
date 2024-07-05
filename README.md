# Food Search Project

## Setup Instructions

Follow these instructions to set up the Food Search Project in your local environment. This guide assumes that you have Node.js and npm installed.

## Prerequisites

- Node.js: Ensure you have Node.js (v18.x or above) installed. You can download it from [here](https://nodejs.org/).
- Replace .env file with .env file I sent via email.
- Move ca.pem file I sent via email to folder `src/db/`

## Installing Dependencies

Navigate to the project directory and install the required npm packages:

```
npm install
```

## Running the Project

Run the main backend project locally using the Nx CLI to compile the TypeScript code and prepare it for deployment:

```
npm run dev
```

## Verification

### Test initializing project

Send GET request to this endpoint.

```
http://localhost:4000/initialize-project
```

### Test initializing project

Send POST request to this endpoint with GraphQL query.

```
http://localhost:4000/initialize-project
```

```
query {
  search(search: "sushi in london") {
    brand {
      id
      name
    }
    city {
      id
      name
    }
    diet {
      id
      name
    }
    dishType {
      id
      name
    }
  }
}
```