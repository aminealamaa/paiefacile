#!/bin/bash

# =====================================================
# BACKUP SCRIPT FOR PAIEFACILE PRODUCTION
# =====================================================

# Configuration
BACKUP_DIR="/backups/paiefacile"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="paiefacile_backup_$DATE.sql"
RETENTION_DAYS=30

# Environment variables (set these in your environment)
SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_DB_PASSWORD="${SUPABASE_DB_PASSWORD}"
SUPABASE_DB_HOST="${SUPABASE_DB_HOST}"
SUPABASE_DB_NAME="${SUPABASE_DB_NAME}"
SUPABASE_DB_USER="${SUPABASE_DB_USER}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to send notification (implement your notification method)
notify() {
    local message="$1"
    # Example: Send email, Slack notification, etc.
    echo "NOTIFICATION: $message"
}

# Function to create database backup
create_database_backup() {
    log "Starting database backup..."
    
    # Create pg_dump command
    PGPASSWORD="$SUPABASE_DB_PASSWORD" pg_dump \
        -h "$SUPABASE_DB_HOST" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        --no-password \
        --verbose \
        --clean \
        --if-exists \
        --create \
        --format=custom \
        --file="$BACKUP_DIR/$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        log "Database backup completed successfully: $BACKUP_FILE"
        notify "Database backup completed successfully: $BACKUP_FILE"
    else
        log "Database backup failed!"
        notify "Database backup failed!"
        exit 1
    fi
}

# Function to create compressed backup
compress_backup() {
    log "Compressing backup..."
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    if [ $? -eq 0 ]; then
        log "Backup compressed successfully"
    else
        log "Failed to compress backup"
        exit 1
    fi
}

# Function to upload to cloud storage (implement your cloud provider)
upload_to_cloud() {
    local backup_file="$BACKUP_DIR/$BACKUP_FILE.gz"
    
    # Example for AWS S3
    # aws s3 cp "$backup_file" s3://your-backup-bucket/paiefacile/
    
    # Example for Google Cloud Storage
    # gsutil cp "$backup_file" gs://your-backup-bucket/paiefacile/
    
    log "Upload to cloud storage (implement your provider)"
}

# Function to clean old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    find "$BACKUP_DIR" -name "paiefacile_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    log "Old backups cleaned up"
}

# Function to verify backup integrity
verify_backup() {
    local backup_file="$BACKUP_DIR/$BACKUP_FILE.gz"
    
    log "Verifying backup integrity..."
    
    # Test if the backup file can be read
    if gzip -t "$backup_file"; then
        log "Backup integrity verified"
        return 0
    else
        log "Backup integrity check failed!"
        notify "Backup integrity check failed!"
        return 1
    fi
}

# Main backup process
main() {
    log "Starting PaieFacile backup process..."
    
    # Check if required environment variables are set
    if [ -z "$SUPABASE_DB_HOST" ] || [ -z "$SUPABASE_DB_NAME" ] || [ -z "$SUPABASE_DB_USER" ]; then
        log "Error: Required environment variables not set"
        exit 1
    fi
    
    # Create database backup
    create_database_backup
    
    # Compress backup
    compress_backup
    
    # Verify backup
    if verify_backup; then
        # Upload to cloud storage
        upload_to_cloud
        
        # Clean up old backups
        cleanup_old_backups
        
        log "Backup process completed successfully"
        notify "Backup process completed successfully"
    else
        log "Backup verification failed, aborting process"
        notify "Backup verification failed"
        exit 1
    fi
}

# Run main function
main "$@"
