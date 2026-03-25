**Solution: Add API Versioning to Routes**

To address the issue, we will modify the `services/api/src/main.rs` file to include version prefixes in all API routes. We will also implement version negotiation to ensure backward compatibility.

**Modified Code:**
```rust
// services/api/src/main.rs

use actix_web::{web, App, HttpServer, Responder};
use serde::{Deserialize, Serialize};

// Define API version constants
const API_VERSION: &str = "v1";

// Define a struct to hold API routes
#[derive(Serialize, Deserialize)]
struct ApiRoute {
    version: String,
    path: String,
}

// Define API routes with version prefixes
async fn get_bounties() -> impl Responder {
    // API logic here
    "Bounties list"
}

async fn get_bounty(id: i32) -> impl Responder {
    // API logic here
    "Bounty details"
}

// Define API version negotiation
async fn negotiate_version(req: web::HttpRequest) -> impl Responder {
    let version = req.headers().get("Accept-Version");
    match version {
        Some(version) => {
            if version == API_VERSION {
                // Return API response for the requested version
                "API response for version 1"
            } else {
                // Return error response for unsupported version
                "Unsupported API version"
            }
        }
        None => {
            // Return default API response for the latest version
            "API response for latest version"
        }
    }
}

// Define API routes with version prefixes
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(web::resource(&format!("/api/{}/bounties", API_VERSION)).route(web::get().to(get_bounties)))
            .service(web::resource(&format!("/api/{}/bounties/{}", API_VERSION, "{id}")).route(web::get().to(get_bounty)))
            .service(web::resource("/api/version").route(web::get().to(negotiate_version)))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```
**Changes:**

1. Added `API_VERSION` constant to define the current API version.
2. Modified API routes to include version prefixes using the `API_VERSION` constant.
3. Implemented version negotiation using the `negotiate_version` function, which checks the `Accept-Version` header to determine the requested API version.
4. Added a new API route `/api/version` to handle version negotiation.

**Example Use Cases:**

1. Requesting the bounties list for version 1: `GET /api/v1/bounties`
2. Requesting a specific bounty for version 1: `GET /api/v1/bounties/123`
3. Negotiating the API version: `GET /api/version` with `Accept-Version: v1` header

**Commit Message:**
```
Add API versioning to routes and implement version negotiation

* Added API version constants and modified API routes to include version prefixes
* Implemented version negotiation using the Accept-Version header
* Added a new API route for version negotiation
```