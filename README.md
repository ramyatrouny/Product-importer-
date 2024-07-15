# Products Importer

This project is a NestJS application that imports products from a CSV file into a MongoDB database. The project includes a scheduler that runs daily to handle the import process, ensuring that products and vendors are updated or created as necessary. Additionally, the product descriptions are enhanced using GPT-4.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Imports products from a CSV file into MongoDB
- Ensures vendors are up-to-date and creates them if necessary
- Handles product variants and maintains data integrity
- Enhances product descriptions using GPT-4
- Schedules the import process to run daily at midnight

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (v4 or later)
- NestJS CLI

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/products-importer.git
   cd products-importer

   ```

2. **Install the dependencies**

   ```sh
   npm install
   ```

3. **Install the dependencies**
   Ensure you have a MongoDB instance running. Update the connection string in the configuration.

## Configuration

Create a .env file in the root directory of the project and add the following variables:

```sh
MONGODB_URI=mongodb://localhost:27017/products-importer
OPENAI_API_KEY=your_openai_api_key
CSV_FILE_PATH=path/to/your/csv/file.csv
```

## Usage

1. **Run the application:**

   ```sh
   npm run start
   ```

2. **Scheduler**
   The scheduler is set to run the import process daily at midnight. You can adjust the cron expression in `product.scheduler.ts` if needed.

## License

This project is licensed under the MIT License.
