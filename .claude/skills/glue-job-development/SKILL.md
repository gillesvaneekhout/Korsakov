---
name: glue-job-development
description: AWS Glue job development patterns for PySpark ETL pipelines
triggers:
  - "create glue job"
  - "write etl"
  - "build pipeline"
  - "process data"
  - "transform data"
---

# AWS Glue Job Development Skill

## Purpose

Implement AWS Glue ETL jobs following Indie Campers' data engineering standards for Bronze, Silver, and Gold layer processing.

## Job Structure

Every Glue job follows this standard structure:

```python
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from awsglue.context import GlueContext
from awsglue.job import Job
from pyspark.context import SparkContext
from pyspark.sql import functions as F
from pyspark.sql.window import Window

# 1. Initialize Glue context
args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)
logger = glueContext.get_logger()

# 2. Configure Spark session
configure_spark_session(spark)

# 3. Read source data
# ... read operations ...

# 4. Transform data
# ... transformations ...

# 5. Write output
# ... write operations ...

# 6. Commit job
job.commit()
```

## Spark Configuration

Always configure Spark for Delta Lake and date handling:

```python
def configure_spark_session(spark):
    """Configure Spark session with proper settings."""
    # Adaptive query execution
    spark.conf.set("spark.sql.adaptive.enabled", "true")
    spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
    spark.conf.set("spark.sql.files.maxPartitionBytes", "128MB")

    # Delta Lake catalog
    spark.conf.set("spark.sql.catalog.spark_catalog",
                   "org.apache.spark.sql.delta.catalog.DeltaCatalog")

    # Legacy date handling (CRITICAL for old data)
    spark.conf.set("spark.sql.parquet.int96RebaseModeInWrite", "LEGACY")
    spark.conf.set("spark.sql.parquet.int96RebaseModeInRead", "LEGACY")
    spark.conf.set("spark.sql.parquet.datetimeRebaseModeInWrite", "LEGACY")
    spark.conf.set("spark.sql.parquet.datetimeRebaseModeInRead", "LEGACY")
    spark.conf.set("spark.sql.legacy.timeParserPolicy", "LEGACY")
```

## Reading Data

**From Delta Lake**:
```python
df = spark.read.format('delta').load(f"s3://{bucket}/{table}/")

# With column selection
columns = ['id', 'name', 'created_at']
df = spark.read.format('delta').load(path).select(*columns)
```

**From Parquet**:
```python
df = spark.read.parquet(f"s3://{bucket}/{prefix}/")
```

**From JDBC (PostgreSQL)**:
```python
df = (spark.read.format("jdbc")
    .option("url", connection_url)
    .option("dbtable", f'(SELECT * FROM "{table}" WHERE updated_at > \'{timestamp}\') AS t')
    .option("user", user)
    .option("password", password)
    .option("driver", "org.postgresql.Driver")
    .load())
```

## Writing Data

**To Delta Lake**:
```python
# Full overwrite
df.write.format("delta") \
    .mode("overwrite") \
    .option("mergeSchema", "true") \
    .save(output_path)

# With partitioning
df.write.format("delta") \
    .partitionBy("year", "month") \
    .mode("overwrite") \
    .option("mergeSchema", "true") \
    .save(output_path)
```

**Append mode**:
```python
df.write.format("delta") \
    .mode("append") \
    .save(output_path)
```

## Common Transformations

**Column Operations**:
```python
# Rename columns
df = df.withColumnRenamed("old_name", "new_name")

# Drop columns
df = df.drop("unwanted_column", "another_column")

# Add computed columns
df = df.withColumn("year", F.year("date_column"))
df = df.withColumn("full_name", F.concat_ws(" ", "first_name", "last_name"))

# Cast types
df = df.withColumn("amount", F.col("amount").cast("decimal(18,2)"))
```

**Filtering**:
```python
# Simple filter
df = df.filter(F.col("status") == "active")

# Multiple conditions
df = df.filter(
    (F.col("created_at") > start_date) &
    (F.col("status").isNotNull())
)

# Filter NULL values
df = df.filter(F.col("deleted_at").isNull())
```

**Aggregations**:
```python
# Group by with aggregations
summary = df.groupBy("depot_id", "month").agg(
    F.count("id").alias("total_count"),
    F.sum("amount").alias("total_amount"),
    F.avg("duration").alias("avg_duration")
)
```

**Window Functions**:
```python
# Running total
window = Window.partitionBy("depot_id").orderBy("date")
df = df.withColumn("running_total", F.sum("amount").over(window))

# Rank within group
window = Window.partitionBy("category").orderBy(F.desc("score"))
df = df.withColumn("rank", F.row_number().over(window))

# Lag/Lead
df = df.withColumn("prev_value", F.lag("value", 1).over(window))
```

**Joins**:
```python
# Inner join
result = df1.join(df2, df1.id == df2.foreign_id, "inner")

# Left join with column selection
result = df1.join(df2, "id", "left").select(
    df1["*"],
    df2.extra_field
)

# Anti join (records not in other table)
orphans = df1.join(df2, "id", "left_anti")
```

**Deduplication**:
```python
# Keep latest by updated_at
df = df.orderBy("id", F.desc("updated_at")).dropDuplicates(["id"])
```

## Logging Best Practices

```python
# Use consistent prefixes for log parsing
logger.info(f"[{layer}]-[{source}]: Starting job")
logger.info(f"[{layer}]-[{source}]: Read {df.count()} records")
logger.info(f"[{layer}]-[{source}]: Processing completed")
logger.error(f"[{layer}]-[{source}]: Error: {str(e)}")

# Examples
logger.info("[brz]-[plat]: Starting rawdata-platform-update job")
logger.info("[slv]-[plat]: Processing bookings table")
logger.info("[gld]-[core]: Writing to gold layer")
```

## Job Configuration JSON

Create accompanying .json file for each job:

```json
{
  "name": "gold-core__booking_extras",
  "role": "arn:aws:iam::ACCOUNT:role/GlueServiceRole",
  "command": {
    "name": "glueetl",
    "scriptLocation": "s3://all-indie-scripts/gold-core__booking_extras.py",
    "pythonVersion": "3"
  },
  "defaultArguments": {
    "--enable-metrics": "true",
    "--enable-continuous-cloudwatch-log": "true",
    "--enable-spark-ui": "true",
    "--TempDir": "s3://all-indie-temp/",
    "--extra-py-files": "s3://all-indie-libs/delta-core.jar"
  },
  "glueVersion": "4.0",
  "numberOfWorkers": 10,
  "workerType": "G.1X"
}
```

## Common Pitfalls to Avoid

- Forgetting `job.commit()` at the end
- Not configuring Spark for Delta Lake
- Missing LEGACY datetime settings (causes date parsing errors)
- Not using `mergeSchema` option (schema evolution breaks)
- Forgetting to handle NULL in decimal columns (NaN issues)
- Not logging progress for monitoring
- Using wrong join type (cartesian products)
- Missing deduplication before writes
