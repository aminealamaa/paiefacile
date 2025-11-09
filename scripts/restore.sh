#!/bin/bash

# =====================================================
# RESTORE SCRIPT FOR PAIEFACILE PRODUCTION
# =====================================================

# Configuration
BACKUP_DIR="/backups/paiefacile"
RESTORE_DB_NAME="paiefacile_restore"

# Environment variables (set these in your environment)
SUPABASE_DB_PASSWORD="${SUPABASE_DB_PASSWORD}"
SUPABASE_DB_HOST="${SUPABASE_DB_HOST}"
SUPABASE_DB_NAME="${SUPABASE_DB_NAME}"
SUPABASE_DB_USER="${SUPABASE_DB_USER}"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to send notification (implement your notification method)
notify() {
    local message="$1"
    echo "NOTIFICATION: $message"
}

# Function to list available backups
list_backups() {
    log "Available backups:"
    ls -la "$BACKUP_DIR"/paiefacile_backup_*.sql.gz 2>/dev/null || echo "No backups found"
}

# Function to restore from backup
restore_from_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        log "Error: No backup file specified"
        echo "Usage: $0 <backup_file>"
        echo "Example: $0 paiefacile_backup_20241201_120000.sql.gz"
        exit 1
    fi
    
    local full_path="$BACKUP_DIR/$backup_file"
    
    if [ ! -f "$full_path" ]; then
        log "Error: Backup file not found: $full_path"
        exit 1
    fi
    
    log "Starting restore from backup: $backup_file"
    
    # Create restore database
    log "Creating restore database: $RESTORE_DB_NAME"
    PGPASSWORD="$SUPABASE_DB_PASSWORD" createdb \
        -h "$SUPABASE_DB_HOST" \
        -U "$SUPABASE_DB_USER" \
        "$RESTORE_DB_NAME"
    
    if [ $? -ne 0 ]; then
        log "Failed to create restore database"
        exit 1
    fi
    
    # Restore from backup
    log "Restoring database from backup..."
    PGPASSWORD="$SUPABASE_DB_PASSWORD" pg_restore \
        -h "$SUPABASE_DB_HOST" \
        -U "$SUPABASE_DB_USER" \
        -d "$RESTORE_DB_NAME" \
        --verbose \
        --clean \
        --if-exists \
        "$full_path"
    
    if [ $? -eq 0 ]; then
        log "Database restore completed successfully"
        notify "Database restore completed successfully to $RESTORE_DB_NAME"
    else
        log "Database restore failed!"
        notify "Database restore failed!"
        exit 1
    fi
}

# Function to verify restore
verify_restore() {
    log "Verifying restore..."
    
    # Check if database exists and has data
    local table_count=$(PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -U "$SUPABASE_DB_USER" \
        -d "$RESTORE_DB_NAME" \
        -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    
    if [ "$table_count" -gt 0 ]; then
        log "Restore verification successful: $table_count tables found"
        return 0
    else
        log "Restore verification failed: No tables found"
        return 1
    fi
}

# Function to switch to restored database (DANGEROUS - use with caution)
switch_to_restored_db() {
    log "WARNING: This will replace the current database with the restored one!"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        log "Switching to restored database..."
        
        # Backup current database first
        local current_backup="current_db_backup_$(date +%Y%m%d_%H%M%S).sql"
        log "Creating backup of current database: $current_backup"
        
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
            --file="$BACKUP_DIR/$current_backup"
        
        # Drop and recreate current database
        log "Dropping current database..."
        PGPASSWORD="$SUPABASE_DB_PASSWORD" dropdb \
            -h "$SUPABASE_DB_HOST" \
            -U "$SUPABASE_DB_USER" \
            "$SUPABASE_DB_NAME"
        
        # Rename restored database to current
        log "Renaming restored database to current..."
        PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
            -h "$SUPABASE_DB_HOST" \
            -U "$SUPABASE_DB_USER" \
            -d postgres \
            -c "ALTER DATABASE $RESTORE_DB_NAME RENAME TO $SUPABASE_DB_NAME;"
        
        log "Database switch completed"
        notify "Database switch completed - current database replaced with restored version"
    else
        log "Database switch cancelled"
    fi
}

# Function to show help
show_help() {
    echo "PaieFacile Database Restore Script"
    echo ""
    echo "Usage:"
    echo "  $0 <backup_file>                    - Restore from specific backup"
    echo "  $0 list                             - List available backups"
    echo "  $0 verify <backup_file>             - Verify backup file"
    echo "  $0 switch <backup_file>             - Switch to restored database (DANGEROUS)"
    echo ""
    echo "Examples:"
    echo "  $0 paiefacile_backup_20241201_120000.sql.gz"
    echo "  $0 list"
    echo "  $0 verify paiefacile_backup_20241201_120000.sql.gz"
}

# Main function
main() {
    case "$1" in
        "list")
            list_backups
            ;;
        "verify")
            if [ -z "$2" ]; then
                log "Error: No backup file specified for verification"
                exit 1
            fi
            verify_restore
            ;;
        "switch")
            if [ -z "$2" ]; then
                log "Error: No backup file specified for switch"
                exit 1
            fi
            restore_from_backup "$2"
            if verify_restore; then
                switch_to_restored_db
            fi
            ;;
        "")
            show_help
            ;;
        *)
            restore_from_backup "$1"
            if verify_restore; then
                log "Restore completed successfully. Database available as: $RESTORE_DB_NAME"
                log "To switch to this database, run: $0 switch $1"
            fi
            ;;
    esac
}

# Check if required environment variables are set
if [ -z "$SUPABASE_DB_HOST" ] || [ -z "$SUPABASE_DB_NAME" ] || [ -z "$SUPABASE_DB_USER" ]; then
    log "Error: Required environment variables not set"
    exit 1
fi

# Run main function
main "$@"
