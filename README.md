# Real-Time-Disaster-Alert-Resource-Coordination-Platform



## Database Schema Code

```
Table disaster {
  id integer [primary key]
  created_by integer
  title text
  description text
  type enum
  severity enum
  source enum [note: "Where you got the info from"]
  status enum
  radius float
  location_id integer
  external_id text
  start_time timestamp [not null]
  end_time timestamp
  created_at timestamp
  updated_at timestamp
}

Table location {
  id integer [primary key]
  latitude decimal
  longitude decimal
  city text
  country text
  coordinates GEOGRAPHY
  created_at timestamp
  updated_at timestamp
}


Table user {
  id integer [primary key]
  email text [unique]
  password_hash text
  role enum
  created_at timestamp
  updated_at timestamp
}

Table volunteer_profile {
  id integer [primary key]
  user_id integer
  status enum
  location_id integer
}

Table assignment {
  id integer [primary key]
  description text
  status enum
  assigned_to integer [note: "volunteer id"]
  assigned_by integer [note: "coordinator id"]
  disaster_id integer
  created_at timestamp
  updated_at timestamp
}


Table resource {
  id integer [primary key]
  name text
  type enum
  quantity integer
  status enum
  assigned_by integer
  location_id integer
  disaster_id integer
  created_at timestamp
  updated_at timestamp
}

Table notification {
  id integer [primary key]
  user_id integer
  type enum
  title text
  message text
  is_read boolean
  created_at timestamp
  updated_at timestamp
}


Ref: "disaster"."location_id" - "location"."id"

Ref: "user"."id" < "assignment"."assigned_by"

Ref: "user"."id" < "resource"."assigned_by"

Ref: "location"."id" < "resource"."location_id"

Ref: "disaster"."id" < "resource"."disaster_id"

Ref: "volunteer_profile"."user_id" - "user"."id"

Ref: "volunteer_profile"."location_id" - "location"."id"

Ref: "notification"."user_id" > "user"."id"

Ref: "assignment"."assigned_to" > "user"."id"

Ref: "user"."id" < "disaster"."id"

Ref: "location"."id" < "location"."longitude"
```