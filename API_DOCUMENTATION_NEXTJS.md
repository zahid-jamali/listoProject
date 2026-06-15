# Listo API Documentation for Next.js Frontend Migration

This document was prepared by reading the live app's API wiring in:

- `server.js`
- `api/*.js`
- `controller/*.js`
- `model/*.js`
- `controller/listoBackEnd/v1/*.js`

It is focused on one practical goal:

1. Identify every API route present in this codebase.
2. Separate public/frontend-usable APIs from admin/internal ones.
3. Explain what each API does, what auth it expects, and how it can help in a Next.js rebuild.

## 1. Big Picture

This project is not a clean API-only backend. It is a mixed Express app where:

- `router.js` serves Handlebars pages.
- `api/*.js` serves JSON APIs and action endpoints.
- some `/api/...` routes return JSON,
- some `/api/...` routes trigger emails or mutations,
- some `/api/...` routes render HTML messages instead of JSON,
- some older SaaS/account routes appear inherited from a starter template and may be partially legacy.

For a Next.js migration, the most important usable data APIs are:

- listings/search APIs
- project/pre-construction APIs
- stats/BI APIs
- address/building APIs
- auth/user/bookmark/watchlist APIs
- inquiry/contact/share/promo APIs

## 2. Base URL and Mounting

All API routers are mounted at app root through:

- `server.js` -> `app.use(api)`
- `api/index.js`

So the routes in this document are already the full path, for example:

- `GET /api/listings`
- `POST /v1/api/listing-inquiry`
- `GET /api/get_projects`

## 3. Authentication Model

Auth is handled by `model/auth.js`.

### How auth works

- Public endpoints usually use `auth.verify_listo('public')`.
- This does **not** require login. It allows anonymous access and sets an empty session user if no token exists.
- Protected endpoints require JWT auth.
- JWT is read from either:
  - `Authorization: Bearer <token>`
  - cookie `authToken`

### Important cookies

- JWT cookie: `authToken`
- favorites cookie: `l_favs`
- listing history cookie: `l_history`
- email-verification prompt cookie: `reqvf`

### Role names used in the app

- `public`
- `auth_user`
- `user`
- `owner`
- `admin`
- `l_admin`
- `c_admin`
- `listo_agent`
- `master`

### External API key auth

Some routes use `auth.verify_key()` instead of JWT. Those require:

- header `x-api-name`
- header `x-api-key`

These are meant for trusted external systems, not browser clients.

## 4. Common Response/Query Patterns

### Common pagination and sorting

Many list APIs use `controller/apiHelper.js`, so they commonly support:

- `limit`
- `offset`
- `sort`
- `order`
- `incl_total=1`

Typical paginated response shape:

```json
{
  "total": 123,
  "rows": [...]
}
```

### Data masking / restricted data

Several listing APIs pass through `listoController.restrict_data`.

That means anonymous users may receive masked or IDX-safe data, especially for:

- sold/private detail fields
- some listing history content

So when you build Next.js, expect public listing responses to be "frontend safe", not raw unrestricted MLS data.

## 5. Public APIs Most Useful for a Next.js Frontend

This is the most important section for your migration.

## 5.1 Search, Autocomplete, Global Navigation

### `GET /api/main_search/`

- Auth: `public`
- Controller: `listoController.main_search`
- Purpose: top search/autocomplete for locations and search targets
- Query:
  - `q` = search text
  - `s_r` = optional `Sale` or `Lease`
- Internals:
  - uses DB function `f_main_search(...)`
  - may also include address autocomplete fallback via Google-based helpers in model layer
- Good for:
  - homepage search bar
  - global header search
  - location suggestion dropdown

### `GET /api/get_geo_info`

- Auth: `public`
- Controller: `listingController.get_geo_info`
- Query:
  - `search_type`
  - `search_text`
- Response:
  - typically `{ lat, lng }`
- Good for:
  - map centering
  - converting location slug into coordinates

### `GET /api/picklist_loc`

- Auth: `public`
- Controller: `listoController.get_picklist_location`
- Purpose: location picklist / dropdown support

### `GET /api/picklist_projects`

- Auth: no auth middleware on route
- Validation:
  - `type` required
- Query:
  - `type=AREA|ARDV|DV`
  - optional supporting filters like `area`, `developer_name`
- Purpose:
  - project-area/project-developer picklists

## 5.2 Core Listings APIs

These are the primary APIs to rebuild listing pages, search results, cards, map results, compare pages, and single listing supporting data.

### `GET /api/listings`

- Auth: `public`
- Controller: `listingController.get_listings_combined`
- Post-processing: `listoController.restrict_data`
- Purpose: main internal listing search API for Ontario/local DB results
- Response shape:

```json
{
  "rows": [...],
  "count": 20,
  "total": 245
}
```

- Important query params:
  - `type` = comma-separated listing families
    - `RS` resale
    - `SD` sold
    - `PC` pre-construction
    - `CUST` custom
    - `ASGN` assignment
    - `EXCL` exclusive
  - `out` = response size
    - `S`
    - `M`
    - `HB`
    - `XS`
  - `s_r` = `Sale` or `Lease`
  - `sub_type`
    - `RES`
    - `CND`
    - `RES,CND`
    - `COM`
  - `sub_type2` = more granular home-style codes
  - `search_type`
    - `MAP`
    - location/default search
  - `viewport` = `minLat:maxLat:minLng:maxLng` for map search
  - `loc_type`
    - `AREA`
    - `MUNC`
    - `COMM`
    - `CITY`
  - `search_text` = location slug
  - `br_min`
  - `bath_min`
  - `sqft_min`
  - `sqft_max`
  - `pr_min`
  - `pr_max`
  - `max_dom`
  - `min_park_spcs`
  - `min_gar_spaces`
  - `facing`
  - `features`
    - `POOL`
    - `BASEMENT`
    - `OH`
    - also code handles ravine/wooded-like filtering
  - `collections`
    - `INV`
    - `BUILD`
  - sold-related:
    - `cd_s`
    - `cd_e`
    - `trsd_dom`
  - listing-date filters:
    - `ld`
    - `ld_s`
    - `ld_e`
  - pagination:
    - `limit`
    - `offset`
    - `sort`
    - `order`
    - `incl_total=1`
    - `incl_total_flex=1`
    - `incl_type_totals=1`
    - `separate_data=true`
- Good for:
  - main listings page
  - map page
  - filter sidebar
  - combined resale + sold + project feeds

### `GET /api/get_listings_n_stats`

- Auth: `public`
- Purpose: lightweight combined result set for stats-oriented UI
- Query:
  - `stat_type=GEN_STATS`
  - similar filters to listings
- Response:
  - currently returns `rows`
- Good for:
  - summary widgets
  - smaller overview sections

### `GET /api/listingPhotos`

- Auth: none on route
- Controller: `listingController.get_listing_photos`
- Query:
  - `type`
  - `id`
  - for resale also `brd`
- Behavior:
  - `type=RS` reads MLS photo store
  - `type=PC|CUST|ASGN|EXCL` reads project photos
- Response:

```json
[{ "src": "..." }]
```

- Good for:
  - gallery
  - carousel
  - single property lightbox

### `GET /api/get_comps`

- Auth: `public`
- Post-processing: restricted output
- Purpose: comparable listings for a single listing page
- Query:
  - driven by `model/listing.js`
  - typically based on listing `id`, listing type, comp rules
- Good for:
  - "similar homes"
  - market comps module

### `GET /api/get_insights`

- Auth: `public`
- Purpose: listing insights / AI-ready listing data bundle
- Query:
  - listing-specific params
- Good for:
  - detailed listing facts panel
  - AI-generated summary or insight component

### `GET /api/get_nearest`

- Auth: `public`
- Purpose: nearest listings / nearby inventory
- Query:
  - listing/location coordinates or equivalent model-supported params
- Good for:
  - "near this property" modules
  - nearby recommendations

### `GET /v1/api/get-user-property-feed`

- Auth: `public`
- Post-processing: restricted output
- Purpose: property-feed API used behind property notification/feed UX
- Good for:
  - feed-based cards
  - change monitoring sections

### `GET /v1/api/get-open-houses`

- Auth: `public`
- Purpose: open house feed
- Good for:
  - open-house page
  - homepage "this weekend open houses"

### `GET /v1/api/get-deals`

- Auth: `public`
- Purpose: "deals" listing feed
- Good for:
  - deals landing page
  - promo/deals rail

### `GET /v1/api/global/listings`

- Auth: `public`
- Purpose: global listing feed, including external/non-Ontario federation
- Controller decides source:
  - Ontario -> internal DB
  - other provinces/states -> external backend (`controller/listoBackEnd/v1/listings.js`)
- For external listing queries, useful params include:
  - `country`
  - `state`
  - `city`
  - `source=REPLIERS|EXT|MIX`
  - `sort`
  - `order`
  - `limit`
  - `page`
- Good for:
  - Alberta / external city pages
  - future global Next.js pages

## 5.3 Address / Building APIs

### `GET /api/get_addr_hist`

- Auth: `auth_user`
- Purpose: listing history for a property/building/unit
- Query supports patterns like:
  - `addr_type=building`
  - `addr_slug`
  - or unit-level selectors like `st_num`, `apt_num`, `st`, `zip`
  - `sub_type`
  - `lsc`
  - `limit`
- Good for:
  - price/listing history tabs
  - unit history

### `GET /api/getAddrListings`

- Auth: `public`
- Post-processing: restricted output
- Purpose: active listings within a building/address
- Query:
  - `type=RS`
  - `addr_slug`
  - `sub_type`
  - `addr_type`
  - optional `s_r`
  - optional `br`
  - optional `incl_total=1`
- Response:
  - `rows`
  - optional `summary`
- Good for:
  - condo building page
  - unit inventory in a building

### `GET /api/popular_buildings`

- Auth: `public`
- Purpose: list popular buildings
- Query:
  - optional `area_slug`
  - optional pagination/search helpers

### `GET /api/picklist_popular_buildings`

- Auth: `public`
- Purpose: building picklist / search dropdown support

### `GET /api/get_addr_comp_stats`

- Auth: `public`
- Purpose: building-level price comparison cards
- Query:
  - `addr_slug`
  - `s_r`
  - `type`
- Response:
  - array of quick stat cards with `num`, `text`, `access_url`
- Good for:
  - "other units in this building"
  - quick comparative pricing box

## 5.4 Stats / BI APIs

These power area pages, market stats pages, building stats, trend charts, and market pulse widgets.

### `GET /api/get_comm_breakdown`

- Auth: `public`
- Purpose: community breakdown by home type / trend mix

### `GET /api/get_comm_sold_monthly`

- Auth: `public`
- Purpose: monthly sold series by community

### `GET /api/get_area_treemap`

- Auth: `public`
- Purpose: area treemap data

### `GET /api/get_building_sold_monthly`

- Auth: `public`
- Required query:
  - `addr`
  - `s_r`
  - `type`
- Purpose: monthly sold averages at building level

### `GET /api/get_building_sold_monthly_chart_series`

- Auth: `public`
- Required query:
  - `addr_slug`
  - `s_r`
  - `type`
- Purpose: building trend chart series

### `GET /api/get_sold_summary`

- Auth: `public`
- Typical query:
  - `location_type`
  - `area_slug`
  - optional `munc_slug`
  - optional `comm_slug`
  - `sub_type`
  - optional `limit`
- Purpose: sold summary series by location

### `GET /api/v1/get_market_pulse`

- Auth: `public`
- Typical query:
  - `location_type`
  - `area_slug`
  - optional `munc_slug`
  - optional `comm_slug`
  - optional `sub_type`
- Response includes:
  - `market_pulse_data`
  - `market_pulse_ranges`
  - `market_pulse_score`
  - `market_pulse_label`
  - `market_pulse_title`
- Good for:
  - buyer/seller market widgets

### `GET /api/monthly_sold_trends/`

- Auth: `public`
- Query commonly supports:
  - `loc_type`
  - `sub_type`
  - `search`
  - `min_num_sold`
  - `limit`
  - pagination/sort

### `GET /api/monthly_listing_summary/`

- Auth: `public`
- Query commonly supports:
  - `loc_type`
  - `sub_type`
  - `s_r`
  - `date`
  - `search`
  - pagination/sort

### `GET /api/monthly_listings_insights/`

- Auth: `public`
- Query commonly supports:
  - `loc_type`
  - `sub_type`
  - `s_r`
  - `sub_type2`
  - `br`
  - `date`
  - `search`

### `GET /api/stats_in_json/`

- Auth: `public`
- Purpose: returns stats JSON from DB function
- Good for:
  - richer analytics pages
  - comparison widgets

### `GET /api/stats_comparison_in_json/`

- Auth: `public`
- Purpose: returns comparison stats JSON from DB function

### `GET /api/get_sold_monthly_chart_series`

- Auth: `public`
- Typical query:
  - `location_type`
  - `area_slug`
  - optional `munc_slug`
  - optional `comm_slug`
  - `type`
  - optional `limit`

### `GET /api/get_sold_trends_home_type_level`

- Auth: `public`
- Purpose: home-style trend table by location

### `GET /api/get_stats_by_days`

- Auth: `public`
- Required query:
  - `sub_type`
  - `area_slug`
  - `s_r`
  - `days`
  - optional `munc_slug`
  - optional `comm_slug`
- Good for:
  - recent X-day stats

### `GET /api/get_monthly_insights/`

- Auth: `listo_agent`
- Internal analytics endpoint

### `GET /api/listo_user_activity/`

- Auth: `c_admin`
- Internal/admin activity analytics

## 5.5 Project / Pre-Construction APIs

These are the main APIs for pre-construction overview pages, featured projects, project detail supporting data, and user submitted projects.

### `GET /api/get_projects`

- Auth: `public`
- Purpose: list active projects
- Query:
  - `type`
  - `area_slug`
  - `developer_name`
  - `status`
  - `country`
  - `search`
  - `attributes[]`
  - common pagination/sort params
- Good for:
  - pre-construction list page
  - developer landing pages
  - area landing pages

### `GET /api/list-pc-gantt`

- Auth: `public`
- Purpose: timeline/Gantt-style project feed
- Query:
  - `select_area`
  - `months`
  - pagination/sort

### `GET /api/get_featured`

- Auth: `public`
- Purpose: featured project feed
- Notes:
  - defaults to `PC`
  - can be extended by controller input
- Good for homepage sections

### `POST /api/project_register`

- Auth: `public`
- Purpose: register user interest for pre-construction project/development
- Important body fields:
  - form fields captured into `project_dev_registration`
  - `access_url` is used for email link generation
- Important note:
  - this endpoint renders a thank-you message view, not a clean JSON API
- Good for:
  - lead form submission
- For Next.js:
  - either proxy it server-side and handle HTML response
  - or replace it with a new JSON endpoint later

### `GET /api/get_models`

- Auth: `public`
- Validation:
  - `dv_id` required
- Query:
  - `dv_id`
  - optional `project_id`
  - optional `incl_inactive`
- Good for:
  - project detail page model tables
  - floorplan/model cards

### `GET /api/get_products`

- Auth: `public`
- Validation:
  - `dv_id` required
- Query:
  - `dv_id`
  - optional `incl_inactive`
- Good for:
  - development product/unit type tables

### `POST /api/project`

- Auth: `auth_user`
- Purpose: create custom/assignment/exclusive project posting
- Important note:
  - controller currently renders a success message page, not a JSON payload

### `PATCH /api/project`

- Auth: `auth_user`
- Purpose: update project
- Body:
  - `id` required
  - update fields depend on project type
- Returns JSON message

### `GET /api/my-projects`

- Auth: `auth_user`
- Purpose: logged-in user's project postings
- Query:
  - common pagination/sort
  - optional `status_listo`
- Internally constrained to custom + assignment types

### `GET /api/edit-projects`

- Auth: `c_admin`
- Purpose: admin list of projects

### `DELETE /api/project`

- Auth: `c_admin`
- Body:
  - `id`

### `PATCH /api/project_development`

- Auth: `c_admin`
- Purpose: update development row for a project

### `DELETE /api/project_development`

- Auth: `c_admin`
- Body:
  - `id`

### `POST|PATCH|DELETE /api/project_development/model`

- Auth: `c_admin`
- Purpose: CRUD for floorplan/model entities

### `POST|PATCH|DELETE /api/project_development/product`

- Auth: `c_admin`
- Purpose: CRUD for development products

### `POST /upload-excel-projects`

- Auth: `c_admin`
- Purpose: admin Excel import for projects

### `GET /api/list-pc-developments`

- Auth: `c_admin`
- Query:
  - `project_id`
  - `search`
  - pagination/sort

### `POST /api/project_agents/`

- Auth: `l_admin`
- Purpose: attach agents to a project

### `GET /api/list-pc-registrations`

- Auth: `l_admin`
- Purpose: admin view of project registrations

### `POST /api/multi_project_status_update`

- Auth: `c_admin`
- Body:
  - `entity`
  - `status`
  - `ids[]`

## 5.6 User, Auth, Bookmark, Watchlist APIs

### `POST /api/user/auth`

- Auth: none
- Purpose: email/password login
- Body:
  - `email`
  - `password`
  - optional `from_web`
  - optional `postLoginAction`
- Response:
  - `token`
  - `subscription`
  - `plan`
  - `permission`
  - `name`

### `POST /api/account`

- Auth: request origin check + reCAPTCHA flow
- Purpose: account signup
- Important note:
  - tightly coupled to current web signup flow
  - uses referer/domain validation

### `POST /api/user`

- Auth: none
- Purpose: invited-user signup into an existing account
- Body:
  - `inviteId`
  - `email`
  - `password`
  - `name`
  - `permission`

### `GET /api/my_info`

- Auth: `user`
- Purpose: logged-in user profile
- Good for:
  - account dropdown
  - dashboard profile page
  - SSR auth bootstrap in Next.js

### `GET /api/user/permissions`

- Auth: `user`
- Purpose: available permissions map

### `PATCH /api/user`

- Auth: `auth_user`
- Purpose: update own profile

### `PATCH /api/user/password`

- Auth: `user`
- Body:
  - `oldpassword`
  - `newpassword`

### `POST /api/user/password/reset/request`

- Auth: none
- Body:
  - `email`

### `POST /api/user/password/reset`

- Auth: none
- Body:
  - `email`
  - `jwt`
  - `password`

### `POST /api/user/verify`

- Auth: none
- Body:
  - `token`

### `POST /api/user/verify/resend`

- Auth: session-backed
- Purpose: resend verification email

### `GET /api/checkAuthUser`

- Auth: `auth_user`
- Purpose: quick auth check

### `GET /api/favs`

- Auth: `auth_user`
- Purpose: get user bookmarks/favorites

### `POST /api/fav`

- Auth: `auth_user`
- Validation:
  - `type`
  - `brd`
  - `id`
- Purpose: add favorite

### `DELETE /api/fav`

- Auth: `auth_user`
- Validation:
  - `type`
  - `brd`
  - `id`
- Purpose: remove favorite

### `GET /api/user_feed`

- Auth: `auth_user`
- Purpose: user feed

### `GET /api/getUserPrefs`

- Auth: `auth_user`
- Purpose: get saved user prefs

### `POST /api/user_prefs`

- Auth: `auth_user`
- Purpose: upsert saved search/user preferences

### `POST /api/watchlist`

- Auth: `auth_user`
- Purpose: create/update community or building watchlist
- Body commonly includes:
  - `area`
  - `municipality`
  - `community`
  - watchlist-specific fields

### `GET /api/getWatchlist`

- Auth: `auth_user`
- Important note:
  - current controller appears broken; it references `cown.get_user_cowns` instead of watchlist model

### `GET /api/get_feed`

- Auth: `public`
- Purpose: watchlist feed/community info

### `GET /api/get_user_cowns`

- Auth: `auth_user`
- Purpose: user's co-ownership items

### `POST /api/add_user_cown`

- Auth: `auth_user`
- Purpose: create co-ownership interest

### `GET /api/get_cown_counts`

- Auth: `public`
- Purpose: co-ownership counts/stats

### `GET /api/listCowns`

- Auth: `l_admin`
- Purpose: admin list of co-ownership entries

## 5.7 Leads, Forms, Contact, Sharing, Newsletter

### `POST /v1/api/listing-inquiry`

- Auth: `public`
- Validation:
  - `prop_id`
  - `prop_type`
  - `brd`
- Also expects in practical usage:
  - `access_url`
  - buyer/contact fields
- Purpose: submit listing inquiry
- Good for:
  - contact agent form on listing page

### `GET /api/inquiries`

- Auth: `l_admin`
- Purpose: admin inquiries list

### `PATCH /v1/api/listing-inquiry`

- Auth: `l_admin`

### `DELETE /v1/api/listing-inquiry`

- Auth: `l_admin`

### `POST /v1/api/contact`

- Auth: `public`
- Validation:
  - `name`
  - `email`
- Purpose: generic contact form

### `GET /api/contacts`

- Auth: `l_admin`

### `PATCH /v1/api/contact`

- Auth: `owner`

### `DELETE /v1/api/contact`

- Auth: `owner`

### `POST /v1/api/offer2`

- Auth: `public`
- Validation:
  - `prop_id`
  - `prop_type`
  - `offer`
- Purpose: offer submission form

### `POST /api/email_share`

- Auth: `public`
- Purpose: email a listing/page/search/comparison link
- Body patterns:
  - `share_type`
  - `share_url`
  - `receiver_email`
  - optional listing fields like `prop_id`, `prop_type`, `title`
- Good for:
  - share modal
  - email friend flow

### `POST /api/generic_form/`

- Auth: `public`
- Purpose: generic website form handler
- Internally switches on `req.body.listo_action`
- Good for:
  - one-off forms already wired into legacy site

### `POST /api/newsletter`

- Auth: `public`
- Purpose: newsletter signup

### `POST /v1/api/promo-signup2`

- Auth: `public`
- Validation:
  - `name`
  - `email`
- Purpose: promo signup and promo-code issue

### `GET /v1/api/listo-promo-submissions`

- Auth: `c_admin`

## 5.8 Ads, Trending, Price Changes, Misc Public Data

### `GET /api/trending`

- Auth: `public`
- Post-processing: restricted data
- Purpose: trending listings feed

### `GET /api/pricechanges`

- Auth: `public`
- Post-processing: restricted data
- Purpose: price-change listings feed

### `GET /api/listingpricechanges`

- Auth: `public`
- Validation:
  - `prop_id`
- Purpose: price changes for a specific listing

### `GET /api/get_agent/`

- Auth: `public`
- Purpose: fetch default/target agent info used in frontend

### `GET /api/get_iliv_treb_data`

- Auth: none on route
- Purpose: TREB data bridge for iLiv integration

### `GET /api/ask_openai`

- Auth: `public`
- Purpose: OpenAI-backed content/insight endpoint
- Note:
  - use carefully, as frontend dependency may not be stable or cheap

## 5.9 Media / AWS Upload APIs

These are mostly for admin/authenticated content editing, not public page rendering.

### `POST /s3/s3handler`

- Auth: none on route
- Purpose:
  - FineUploader S3 signing
  - upload verification callback

### `POST /s3/success`

- Auth: none on route
- Purpose:
  - alternate upload success callback

### `DELETE /s3/s3handler`

- Auth: none on route
- Purpose:
  - delete uploaded file from S3 and metadata store
- Query usually includes:
  - `key`
  - `content_type`
  - `entity_type`
  - `entity_id`

### `GET /api/get-aws-content/:content_type/:entity_type/:entity_id`

- Auth: `auth_user`
- Purpose: fetch image/doc metadata for projects/models/developments/agents/ads/addresses
- Supported `content_type`:
  - `IMG`
  - `DOC`
- Supported `entity_type` includes:
  - `PR`
  - `PR_DV`
  - `MD`
  - `ADDR`
  - `AG`
  - `DVLPR`
  - `ADVERTISEMENT`

## 5.10 External / Internal Automation APIs

### `POST /v1/api_external/campaign-submission`

- Auth: `x-api-key`
- Body:
  - `campaign_name`
  - campaign payload
- Currently accepted campaign:
  - `TR_USER_PREFS`
- Purpose:
  - trusted external campaign/lead ingestion

### `GET /v1/api/campaign-submissions`

- Auth: `c_admin`

### `PATCH /v1/api/campaign-submission`

- Auth: `c_admin`

### `DELETE /v1/api/campaign-submission`

- Auth: `c_admin`

### `POST /v1/api/update-photos`

- Auth: none on route
- Purpose:
  - system photo metadata updates
- Treat as internal/unsafe for public browser use

### `POST /v1/api_external/verify-token`

- Auth: JWT verify route
- Purpose:
  - validate token externally

### `PATCH /v1/api/sys-parameters`

- Auth: `c_admin`
- Purpose:
  - update system parameters

### `POST /api/master/refreshMVMainSearch`

- Auth: `l_admin`
- Purpose:
  - refresh materialized views/search caches

### `POST /api/master/refreshProjectData`

- Auth: `c_admin`
- Purpose:
  - refresh project-side derived data

### `POST /api/master/googleIndexAPI`

- Auth: `l_admin`
- Purpose:
  - submit URLs to Google index API

### `POST /api_external/googleIndexAPI`

- Auth: `x-api-key`
- Purpose:
  - trusted external Google indexing trigger

### `GET /v1/api/terminatedListings`

- Auth: `listo_agent`

### `GET /v1/api/soldPriceDiff`

- Auth: `listo_agent`

## 6. Legacy Account / SaaS / Admin APIs

These exist in the codebase, but many seem more related to an older SaaS starter/account-management layer than the public real-estate frontend.

Use only after testing them carefully.

### Account routes

- `POST /api/account`
- `GET /api/account`
- `PATCH /api/account`
- `PATCH /api/account/plan`
- `PATCH /api/account/card`
- `GET /api/account/plans`
- `GET /api/account/users`
- `GET /api/account/subscription`
- `POST /api/account/upgrade`
- `DELETE /api/account`
- `DELETE /api/own_account`

### Invite routes

- `POST /api/invite`
- `DELETE /api/invite`

### Master routes

- `GET /api/master/accounts`
- `PATCH /api/master/account`
- `DELETE /api/master/account`
- `GET /api/master/users`
- `PATCH /api/master/user`
- `DELETE /api/master/user`

### Metrics routes

- `GET /api/metrics/accounts`
- `GET /api/metrics/accounts/growth`

### Demo routes

- `GET /api/demo/stats`
- `GET /api/demo/revenue`
- `GET /api/demo/progress`
- `GET /api/demo/users/list`
- `GET /api/demo/users/types`

## 7. Route Inventory by API File

This is the full route inventory found in `api/`.

### `api/listing.js`

- `GET /api/listings`
- `GET /api/get_listings_n_stats`
- `GET /api/picklist_inv_listings`
- `GET /api/get_inv_listings`
- `GET /api/listingPhotos`
- `GET /api/get_comps`
- `GET /api/get_insights`
- `GET /api/get_geo_info`
- `GET /api/get_nearest`
- `GET /v1/api/get-user-property-feed`
- `GET /v1/api/get-open-houses`
- `GET /v1/api/get-deals`
- `GET /v1/api/global/listings`

### `api/project.js`

- `GET /api/get_projects`
- `GET /api/list-pc-gantt`
- `GET /api/get_featured`
- `POST /api/project_register`
- `GET /api/get_models`
- `GET /api/get_products`
- `POST /api/project`
- `PATCH /api/project`
- `GET /api/my-projects`
- `GET /api/edit-projects`
- `DELETE /api/project`
- `PATCH /api/project_development`
- `DELETE /api/project_development`
- `POST /api/project_development/model`
- `PATCH /api/project_development/model`
- `DELETE /api/project_development/model`
- `POST /api/project_development/product`
- `PATCH /api/project_development/product`
- `DELETE /api/project_development/product`
- `POST /upload-excel-projects`
- `GET /api/list-pc-developments`
- `POST /api/project_agents/`
- `GET /api/list-pc-registrations`
- `POST /api/multi_project_status_update`

### `api/listo.js`

- `GET /api/main_search/`
- `GET /api/get_agent/`
- `POST /api/generic_form/`
- `GET /api/favs`
- `POST /api/fav`
- `DELETE /api/fav`
- `GET /api/user_feed`
- `GET /api/getUserPrefs`
- `GET /api/checkAuthUser`
- `POST /v1/api/listing-inquiry`
- `GET /api/inquiries`
- `DELETE /v1/api/listing-inquiry`
- `PATCH /v1/api/listing-inquiry`
- `GET /api/logs`
- `POST /api/email_share`
- `GET /api/get_user_cowns`
- `POST /api/add_user_cown`
- `GET /api/get_cown_counts`
- `GET /api/listCowns`
- `POST /api/watchlist`
- `GET /api/getWatchlist`
- `GET /api/get_feed`
- `POST /api/newsletter`
- `POST /v1/api/contact`
- `GET /api/contacts`
- `PATCH /v1/api/contact`
- `DELETE /v1/api/contact`
- `POST /v1/api/offer2`
- `POST /v1/api/promo-signup2`
- `GET /v1/api/listo-promo-submissions`
- `PATCH /api/addr`
- `POST /api/user_prefs`
- `GET /api/get-agents`
- `POST /api/agent`
- `PATCH /api/agent`
- `DELETE /api/agent`
- `GET /api/developers`
- `PATCH /api/developer`
- `DELETE /api/developer`
- `GET /api/get-events`
- `DELETE /api/auth_user/entity/del`
- `GET /api/picklist_loc`
- `GET /api/picklist_projects`
- `GET /api/send_email_test`
- `POST /api/reCaptcha`
- `GET /api/reCaptcha_V2`
- `GET /api/trending`
- `GET /api/pricechanges`
- `GET /api/listingpricechanges`
- `GET /api/get_iliv_treb_data`
- `GET /api/ask_openai`
- `GET /api/v1/ads`
- `POST /api/v1/ad`
- `PATCH /api/v1/ad`
- `DELETE /api/v1/ad`
- `GET /api/check_typos`
- `GET /api/check_typos_for_date`
- `GET /api/get_typos`
- `POST /api/update_typo_status`
- `POST /v1/api_external/campaign-submission`
- `GET /v1/api/campaign-submissions`
- `PATCH /v1/api/campaign-submission`
- `DELETE /v1/api/campaign-submission`
- `POST /v1/api/update-photos`
- `POST /v1/api_external/verify-token`
- `PATCH /v1/api/sys-parameters`

### `api/bi.js`

- `GET /api/get_comm_breakdown`
- `GET /api/get_comm_sold_monthly`
- `GET /api/get_area_treemap`
- `GET /api/get_building_sold_monthly`
- `GET /api/get_building_sold_monthly_chart_series`
- `GET /api/get_sold_summary`
- `GET /api/v1/get_market_pulse`
- `GET /api/monthly_sold_trends/`
- `GET /api/monthly_listing_summary/`
- `GET /api/monthly_listings_insights/`
- `GET /api/stats_in_json/`
- `GET /api/stats_comparison_in_json/`
- `GET /api/get_sold_monthly_chart_series`
- `GET /api/get_sold_trends_home_type_level`
- `GET /api/get_stats_by_days`
- `GET /api/get_monthly_insights/`
- `GET /api/listo_user_activity/`

### `api/addr.js`

- `GET /api/get_addr_hist`
- `GET /api/getAddrListings`
- `GET /api/popular_buildings`
- `GET /api/picklist_popular_buildings`
- `GET /api/get_addr_comp_stats`

### `api/user.js`

- `POST /api/user/auth`
- `POST /api/user`
- `GET /api/user`
- `GET /api/my_info`
- `GET /api/user/permissions`
- `PATCH /api/admin_user`
- `PATCH /api/user/password`
- `POST /api/user/password/reset/request`
- `POST /api/user/password/reset`
- `PATCH /api/user`
- `DELETE /api/user`
- `POST /v1/api/admin/user-package`
- `DELETE /v1/api/admin/user-package`
- `POST /api/user/verify`
- `POST /api/user/verify/resend`
- `GET /api/admin-users`

### `api/account.js`

- `POST /api/account`
- `GET /api/account`
- `PATCH /api/account`
- `PATCH /api/account/plan`
- `PATCH /api/account/card`
- `GET /api/account/plans`
- `GET /api/account/users`
- `GET /api/account/subscription`
- `POST /api/account/upgrade`
- `DELETE /api/account`
- `DELETE /api/own_account`
- `POST /auth/apple/callback`

### `api/invite.js`

- `POST /api/invite`
- `DELETE /api/invite`

### `api/master.js`

- `GET /api/master/accounts`
- `PATCH /api/master/account`
- `DELETE /api/master/account`
- `GET /api/master/users`
- `PATCH /api/master/user`
- `DELETE /api/master/user`

### `api/metrics.js`

- `GET /api/metrics/accounts`
- `GET /api/metrics/accounts/growth`

### `api/demo.js`

- `GET /api/demo/stats`
- `GET /api/demo/revenue`
- `GET /api/demo/progress`
- `GET /api/demo/users/list`
- `GET /api/demo/users/types`

### `api/aws.js`

- `POST /s3/s3handler`
- `POST /s3/success`
- `DELETE /s3/s3handler`
- `GET /api/get-aws-content/:content_type/:entity_type/:entity_id`

### `api/internal.js`

- `POST /api/master/refreshMVMainSearch`
- `POST /api/master/refreshProjectData`
- `POST /api/master/googleIndexAPI`
- `POST /api_external/googleIndexAPI`
- `GET /v1/api/terminatedListings`
- `GET /v1/api/soldPriceDiff`

### `api/mongo.js`

- no active routes found

## 8. Known Quirks and Risks

These are important before you build directly on top of existing endpoints.

### 8.1 Some API routes are not pure JSON APIs

These routes currently render server-side thank-you/message views:

- `POST /api/project_register`
- `POST /api/project`

So if your Next.js frontend expects JSON, these need either:

- a backend wrapper/proxy,
- or a new JSON-first endpoint.

### 8.2 Watchlist read endpoint appears broken

`GET /api/getWatchlist` calls `cown.get_user_cowns(req)` inside `watchlistController.get`, which looks incorrect and likely broken.

### 8.3 Some legacy account/admin APIs may be unreliable without testing

Several legacy controllers reference:

- `req.account`
- `req.user`
- `req.permission`

But the current `auth.verify_listo(...)` middleware mainly populates:

- `req.session.user.id`
- `req.session.user.account_id`
- `req.session.user.permission`

That means some old SaaS/account routes may not be aligned with the live auth flow and should be tested before reuse.

### 8.4 External/global listings come from another backend

For non-Ontario/global listings, this app calls another backend via:

- `controller/listoBackEnd/v1/token.js`
- `controller/listoBackEnd/v1/listings.js`

So `GET /v1/api/global/listings` is a federation layer, not purely local DB data.

### 8.5 Public listing data may be masked

Anonymous users can call many listing APIs, but some fields are intentionally restricted for IDX/public compliance.

## 9. Recommended API Strategy for Your Next.js Migration

If your goal is to rebuild the current frontend in Next.js with minimum backend changes, start with these:

### Phase 1: Public pages

- `GET /api/main_search/`
- `GET /api/listings`
- `GET /api/listingPhotos`
- `GET /api/get_comps`
- `GET /api/get_insights`
- `GET /api/get_projects`
- `GET /api/get_featured`
- `GET /api/get_models`
- `GET /api/get_products`
- `GET /api/getAddrListings`
- `GET /api/get_addr_comp_stats`
- `GET /api/v1/get_market_pulse`
- `GET /api/monthly_sold_trends/`
- `GET /api/monthly_listing_summary/`
- `GET /api/monthly_listings_insights/`
- `GET /v1/api/global/listings`

### Phase 2: User features

- `POST /api/user/auth`
- `GET /api/my_info`
- `GET /api/favs`
- `POST /api/fav`
- `DELETE /api/fav`
- `GET /api/getUserPrefs`
- `POST /api/user_prefs`
- `POST /v1/api/listing-inquiry`
- `POST /api/email_share`
- `POST /api/watchlist`
- `POST /api/newsletter`

### Phase 3: Forms and conversion flows

- `POST /v1/api/contact`
- `POST /v1/api/offer2`
- `POST /v1/api/promo-signup2`
- `POST /api/project_register`

### Phase 4: Admin/Backoffice migration

- project CRUD
- agent/developer/event/admin lists
- campaign/promo/inquiry/contact dashboards
- AWS media flows

## 10. Suggested Page-to-API Mapping for Next.js

### Homepage

- featured resale/projects: `GET /api/get_featured`, `GET /api/trending`, `GET /v1/api/get-deals`
- search bar: `GET /api/main_search/`

### Listings Search Page

- results: `GET /api/listings`
- map center: `GET /api/get_geo_info`
- filters/stats: `GET /api/get_listings_n_stats`

### Single Listing Page

- main listing data: existing page controller currently assembles it from model layer, but API-side support is:
  - `GET /api/listings` or global listing API for result sets
  - `GET /api/listingPhotos`
  - `GET /api/get_comps`
  - `GET /api/get_insights`
  - `GET /api/get_nearest`
  - `GET /api/listingpricechanges`
  - `GET /api/get_addr_comp_stats`

### Building Page

- active units: `GET /api/getAddrListings`
- building stats: `GET /api/get_addr_comp_stats`
- history: `GET /api/get_addr_hist`

### Pre-Construction Listing Page

- list page: `GET /api/get_projects`
- featured: `GET /api/get_featured`

### Pre-Construction Detail Page

- project record: current app often fetches via model/view layer, but supporting APIs are:
  - `GET /api/get_models`
  - `GET /api/get_products`
  - `GET /api/get-aws-content/...` for media/doc editing contexts
  - `POST /api/project_register`

### Market Stats Page

- `GET /api/v1/get_market_pulse`
- `GET /api/get_sold_summary`
- `GET /api/monthly_sold_trends/`
- `GET /api/monthly_listing_summary/`
- `GET /api/monthly_listings_insights/`
- `GET /api/stats_in_json/`
- `GET /api/stats_comparison_in_json/`

## 11. Final Conclusion

This backend already contains enough APIs to rebuild a large part of the live frontend in Next.js, especially for:

- listings
- search
- address/building pages
- stats
- pre-construction/project pages
- user favorites/inquiry/contact flows

The main caveats are:

- some routes are legacy,
- some write endpoints return HTML instead of JSON,
- some admin/account routes should be re-tested,
- some global listings come from a second backend,
- some public listing fields are intentionally masked.

If you want, the next best step is:

1. create a clean "Next.js-ready API shortlist" from this file,
2. define exact request/response examples for each shortlisted endpoint,
3. and then build a page-by-page migration plan for `listo.ca`.
