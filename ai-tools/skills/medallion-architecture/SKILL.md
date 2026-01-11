---
name: medallion-architecture
description: Understanding and implementing the Bronze-Silver-Gold medallion data architecture
triggers:
  - "medallion architecture"
  - "data lake layers"
  - "bronze silver gold"
  - "data architecture"
---

# Medallion Architecture Skill

## Purpose

Implement and maintain the Bronze-Silver-Gold medallion architecture pattern for Indie Campers' data lake, ensuring proper data flow, quality, and governance across layers.

## Architecture Overview

```
                    RAW DATA SOURCES
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌────────┐          ┌──────────┐          ┌─────────┐
│Platform│          │  Stripe  │          │ Zendesk │
│   DB   │          │   API    │          │   API   │
└────┬───┘          └────┬─────┘          └────┬────┘
     │                   │                     │
     └───────────────────┼─────────────────────┘
                         │
                         ▼
    ╔════════════════════════════════════════════╗
    ║            BRONZE LAYER                    ║
    ║   Raw data, append-only, full history     ║
    ║   s3://all-indie-data-and-ml-bronze-*     ║
    ╚════════════════════════════════════════════╝
                         │
                         ▼
    ╔════════════════════════════════════════════╗
    ║            SILVER LAYER                    ║
    ║   Cleaned, standardized, deduplicated     ║
    ║   s3://all-indie-data-and-ml-silver-*     ║
    ╚════════════════════════════════════════════╝
                         │
                         ▼
    ╔════════════════════════════════════════════╗
    ║             GOLD LAYER                     ║
    ║   Business-ready, aggregated, enriched    ║
    ║   s3://all-indie-data-and-ml-gold         ║
    ╚════════════════════════════════════════════╝
```

## Bronze Layer

### Purpose
- Store raw data exactly as received from source
- Preserve full history for reprocessing
- Enable data lineage and auditing

### Characteristics
- **Format**: Delta Lake (append-only)
- **Schema**: Matches source system
- **Updates**: Incremental appends
- **Retention**: Full history

### Location Pattern
```
s3://all-indie-data-and-ml-bronze-[source]/[table]/
```

### Example Sources
| Source | Bucket | Description |
|--------|--------|-------------|
| Platform | bronze-platform | Core booking system |
| Stripe | bronze-stripe | Payment data |
| Zendesk | bronze-zendesk | Support tickets |
| Pipedrive | bronze-pipedrive | CRM data |
| Google Ads | bronze-google-ads | Marketing data |
| Meta Ads | bronze-meta-ads | Marketing data |

### Bronze Job Pattern
```python
# Read from source
df = read_from_source(connection, query)

# Add metadata
df = df.withColumn("_ingested_at", F.current_timestamp())
df = df.withColumn("_source_system", F.lit("platform"))

# Append to bronze (never overwrite)
df.write.format("delta") \
    .mode("append") \
    .save(bronze_path)
```

## Silver Layer

### Purpose
- Clean and standardize data
- Apply business rules
- Deduplicate records
- Create consistent schemas

### Characteristics
- **Format**: Delta Lake
- **Schema**: Standardized, typed
- **Updates**: Merge/upsert by key
- **Quality**: Validated, deduplicated

### Location Pattern
```
s3://all-indie-data-and-ml-silver-[source]/[table]/
```

### Common Transformations
- Column renaming for consistency
- Data type standardization
- NULL handling
- Timestamp normalization
- Currency conversion
- Status code mapping

### Silver Job Pattern
```python
# Read from bronze
bronze_df = spark.read.format('delta').load(bronze_path)

# Clean and transform
silver_df = bronze_df \
    .withColumnRenamed("old_name", "standard_name") \
    .withColumn("amount", F.col("amount").cast("decimal(18,2)")) \
    .filter(F.col("deleted_at").isNull())

# Deduplicate by key
silver_df = silver_df \
    .orderBy("id", F.desc("updated_at")) \
    .dropDuplicates(["id"])

# Write to silver (overwrite)
silver_df.write.format("delta") \
    .mode("overwrite") \
    .option("mergeSchema", "true") \
    .save(silver_path)
```

## Gold Layer

### Purpose
- Create business-ready datasets
- Implement business logic
- Build aggregated metrics
- Support analytics and reporting

### Characteristics
- **Format**: Delta Lake
- **Schema**: Optimized for queries
- **Updates**: Full rebuild or incremental
- **Quality**: Business validated

### Location Pattern
```
s3://all-indie-data-and-ml-gold/[domain]__[table_name]
```

### Gold Domains
| Domain | Description | Examples |
|--------|-------------|----------|
| core | Core business entities | booking_dimensions, depots |
| revenue | Revenue analytics | daily_revenue, revenue_by_depot |
| ops | Operations metrics | fleet_utilization, maintenance |
| growth | Growth and marketing | acquisition, conversion |
| kpis | Business KPIs | company_kpis |

### Gold Job Pattern
```python
# Read from silver (multiple sources)
bookings = spark.read.format('delta').load(silver_bookings)
clients = spark.read.format('delta').load(silver_clients)
depots = spark.read.format('delta').load(silver_depots)

# Join and enrich
gold_df = bookings \
    .join(clients, "client_id", "left") \
    .join(depots, "depot_id", "left") \
    .withColumn("revenue_eur", calculate_revenue()) \
    .withColumn("booking_status_group", map_status())

# Aggregate if needed
summary = gold_df.groupBy("depot_id", "month").agg(
    F.sum("revenue_eur").alias("total_revenue")
)

# Write to gold
summary.write.format("delta") \
    .mode("overwrite") \
    .option("mergeSchema", "true") \
    .save(gold_path)
```

## Layer Transition Rules

### Bronze → Silver
1. Clean NULL and invalid values
2. Standardize column names
3. Cast to appropriate types
4. Deduplicate by primary key
5. Apply basic business rules
6. Add audit columns

### Silver → Gold
1. Join related tables
2. Apply complex business logic
3. Calculate derived metrics
4. Aggregate as needed
5. Optimize for query patterns
6. Document calculations

## Data Quality by Layer

| Check | Bronze | Silver | Gold |
|-------|--------|--------|------|
| Schema validation | ✓ | ✓ | ✓ |
| NOT NULL constraints | - | ✓ | ✓ |
| Referential integrity | - | ✓ | ✓ |
| Business rules | - | - | ✓ |
| Deduplication | - | ✓ | ✓ |
| Completeness | ✓ | ✓ | ✓ |

## Naming Conventions

### Table Names
```
Bronze: [source]_[original_table_name]
Silver: [table_name] (no prefix)
Gold:   [domain]__[descriptive_name]
```

### Column Names
```
Bronze: Keep original names
Silver: snake_case, standardized
Gold:   Business-friendly, documented
```

### Examples
```
Bronze: platform_prod_indie_platform_public_bookings
Silver: bookings
Gold:   core__booking_dimensions_1p
```

## Common Pitfalls

1. **Skipping Silver**: Don't write directly from Bronze to Gold
2. **Overcleaning Bronze**: Keep Bronze raw for reprocessing
3. **Inconsistent schemas**: Use Delta Lake schema evolution
4. **Missing metadata**: Add _ingested_at, _source in Bronze
5. **Hardcoded paths**: Use configuration for bucket names
6. **No deduplication**: Always dedupe in Silver layer
